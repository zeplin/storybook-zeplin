import {
    getZeplinLinkProperties,
    LinkProperties,
    RESOURCE_TYPES
} from "@zeplin/storybook-inspector";
import { Component, Configuration, ConnectedComponent, Screen, User, ZeplinApi } from "@zeplin/sdk";

import {
    ZEPLIN_TOKEN,
    ZEPLIN_API_URL,
    ZEPLIN_WEB_BASE,
    ZEPLIN_APP_BASE,
} from "../constants";

type ZeplinResource = Component | Screen;

const ZEPLIN_TOKEN_STORAGE_KEY = "storybook_zeplin:access_token";
let cachedUser: undefined | User;
const zeplinResourceCache: Map<string, ZeplinResource> = new Map();
const zeplinConnectedComponentsCache: Map<string, ConnectedComponent[]> = new Map();
const zeplinApi = new ZeplinApi(
    new Configuration({
        accessToken: getZeplinToken
    }),
    ZEPLIN_API_URL
);

type ConnectedComponentParams = {
    projectId: string;
} | {
    styleguideId: string;
};

function getZeplinToken(): string | undefined {
    return localStorage.getItem(ZEPLIN_TOKEN_STORAGE_KEY) || ZEPLIN_TOKEN;
}

const ZEPLIN_PROJECT_ID = "61bbcbc4477fb94daa1c041f";
const ZEPLIN_STYLEGUIDE_ID = null;


async function getConnectedComponents(params: ConnectedComponentParams): Promise<ConnectedComponent[]> {
    const isProject = "projectId" in params;
    const resourceId = "projectId" in params ? params.projectId : params.styleguideId;
    const cachedValue = zeplinConnectedComponentsCache.get(resourceId);
    if (cachedValue) {
        return cachedValue;
    }
    const { data: { numberOfConnectedComponents } } = (
        isProject
            ? await zeplinApi.projects.getProject(resourceId)
            : await zeplinApi.styleguides.getStyleguide(resourceId)
    );
    const numberOfRequest = Math.ceil(numberOfConnectedComponents / 100);
    const requestIndices = Array.from(Array(numberOfRequest).keys());
    const connectedComponents = (await Promise.all(requestIndices.map(async (index) => {
        const { data } = (
            isProject
                ? await zeplinApi.connectedComponents.getProjectConnectedComponents(
                    resourceId,
                    {
                        limit: 100,
                        offset: 100 * index,
                        includeLinkedStyleguides: true
                    }
                ) : await zeplinApi.connectedComponents.getStyleguideConnectedComponents(
                    resourceId,
                    {
                        limit: 100,
                        offset: 100 * index,
                        includeLinkedStyleguides: true
                    }
                )
        );
        return data;
    }))).flat();
    zeplinConnectedComponentsCache.set(resourceId, connectedComponents);
    return connectedComponents;
}

function linkPropertiesToUrl(linkProperties: LinkProperties) {
    switch (linkProperties.type) {
        case RESOURCE_TYPES.PROJECT_COMPONENT:
            return `${ZEPLIN_WEB_BASE}/project/${linkProperties.pid}/styleguide/components?coid=${linkProperties.coid}`;
        case RESOURCE_TYPES.STYLEGUIDE_COMPONENT:
            return `${ZEPLIN_WEB_BASE}/styleguide/${linkProperties.stid}/components?coid=${linkProperties.coid}`;
        case RESOURCE_TYPES.SCREEN:
            return `${ZEPLIN_WEB_BASE}/project/${linkProperties.pid}/screen/${linkProperties.sid}`;
        default:
            return "";
    }
}

export function isLoggedIn(): boolean {
    return Boolean(getZeplinToken());
}

export function login(token: string) {
    localStorage.setItem(ZEPLIN_TOKEN_STORAGE_KEY, token);
}

export function logout() {
    localStorage.removeItem(ZEPLIN_TOKEN_STORAGE_KEY);
    cachedUser = undefined;
    zeplinResourceCache.clear();
}

export async function getZeplinResource(
    zeplinLink: string
): Promise<ZeplinResource | { error: string }> {
    const cachedValue = zeplinResourceCache.get(zeplinLink);
    if (cachedValue) {
        return cachedValue;
    }

    const linkProperties = getZeplinLinkProperties(
        zeplinLink,
        {
            web: ZEPLIN_WEB_BASE,
            app: ZEPLIN_APP_BASE
        }
    );

    try {
        switch (linkProperties.type) {
            case RESOURCE_TYPES.PROJECT_COMPONENT: {
                const { data } = await zeplinApi.components.getProjectComponent(
                    linkProperties.pid,
                    linkProperties.coid,
                    {
                        includeLinkedStyleguides: true
                    }
                );
                zeplinResourceCache.set(zeplinLink, data);
                return data;
            }
            case RESOURCE_TYPES.STYLEGUIDE_COMPONENT: {
                const { data } = await zeplinApi.components.getStyleguideComponent(
                    linkProperties.stid,
                    linkProperties.coid,
                    {
                        includeLinkedStyleguides: true
                    }
                );
                zeplinResourceCache.set(zeplinLink, data);
                return data;
            }
            case RESOURCE_TYPES.SCREEN: {
                const { data } = await zeplinApi.screens.getScreen(
                    linkProperties.pid,
                    linkProperties.sid
                );
                zeplinResourceCache.set(zeplinLink, data);
                return data;
            }
            default:
                return {
                    error: "Zeplin link is invalid.",
                };
        }
    } catch (e) {
        return {
            error: e.response?.data?.message || e.message,
        }
    }
}

export async function getUser(): Promise<User | { error: string }> {
    if (cachedUser) {
        return cachedUser;
    }
    try {
        const { data } = await zeplinApi.users.getCurrentUser();
        cachedUser = data;
        return data;
    } catch (e) {
        return {
            error: e.response?.data?.message || e.message,
        }
    }
}

export async function getZeplinLinksFromConnectedComponents(
    storyId: string,
    params: ConnectedComponentParams
): Promise<string[]> {
    try {
        const connectedComponents = (await getConnectedComponents(params)).filter(
            ({ links }) => links.find(({ type, url }) => {
                if (type !== 'storybook') {
                    return false;
                }
                const path = new URL(url).searchParams.get("path");
                const paths = path.split("/");
                const storyIdFromUrl = paths[paths.length - 1];
                return storyIdFromUrl === storyId;
            })
        );

        return connectedComponents.map(({ components, source }) => {
            if (source.project) {
                return components.map(({ id }) => linkPropertiesToUrl({
                    pid: source.project.id,
                    coid: id,
                    type: RESOURCE_TYPES.PROJECT_COMPONENT
                }));
            }
            return components.map(({ id }) => linkPropertiesToUrl({
                stid: source.styleguide.id,
                coid: id,
                type: RESOURCE_TYPES.STYLEGUIDE_COMPONENT
            }));
        }).flat();
    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || String(e));
    }
}

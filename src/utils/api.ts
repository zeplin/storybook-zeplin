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
    ZEPLIN_STYLEGUIDE_ID,
    ZEPLIN_PROJECT_ID
} from "../constants";

type ZeplinResource = Component | Screen;

const ZEPLIN_TOKEN_STORAGE_KEY = "storybook_zeplin:access_token";
let cachedUser: undefined | User;
const zeplinCache: Map<string, ZeplinResource> = new Map();
let cachedConnectedComponents: undefined | ConnectedComponent[];
const zeplinApi = new ZeplinApi(
    new Configuration({
        accessToken: getZeplinToken
    }),
    ZEPLIN_API_URL
);

function getZeplinToken(): string | undefined {
    return localStorage.getItem(ZEPLIN_TOKEN_STORAGE_KEY) || ZEPLIN_TOKEN;
}

async function cacheConnectedComponents() {
    const { data: { numberOfConnectedComponents } } = (
        ZEPLIN_PROJECT_ID
            ? await zeplinApi.projects.getProject(ZEPLIN_PROJECT_ID)
            : await zeplinApi.styleguides.getStyleguide(ZEPLIN_STYLEGUIDE_ID)
    );
    const numberOfRequest = Math.ceil(numberOfConnectedComponents / 100);
    const requestIndices = Array.from(Array(numberOfRequest).keys());
    cachedConnectedComponents = (await Promise.all(requestIndices.map(async (index) => {
        const { data } = (
            ZEPLIN_PROJECT_ID
                ? await zeplinApi.connectedComponents.getProjectConnectedComponents(
                    ZEPLIN_PROJECT_ID,
                    {
                        limit: 100,
                        offset: 100 * index,
                        includeLinkedStyleguides: true
                    }
                ) : await zeplinApi.connectedComponents.getStyleguideConnectedComponents(
                    ZEPLIN_STYLEGUIDE_ID,
                    {
                        limit: 100,
                        offset: 100 * index,
                        includeLinkedStyleguides: true
                    }
                )
        );
        return data;
    }))).flat();
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
    zeplinCache.clear();
}

export async function getZeplinResource(
    zeplinLink: string
): Promise<ZeplinResource | { error: string }> {
    const cachedValue = zeplinCache.get(zeplinLink);
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
                    linkProperties.coid
                );
                zeplinCache.set(zeplinLink, data);
                return data;
            }
            case RESOURCE_TYPES.STYLEGUIDE_COMPONENT: {
                const { data } = await zeplinApi.components.getStyleguideComponent(
                    linkProperties.stid,
                    linkProperties.coid
                );
                zeplinCache.set(zeplinLink, data);
                return data;
            }
            case RESOURCE_TYPES.SCREEN: {
                const { data } = await zeplinApi.screens.getScreen(
                    linkProperties.pid,
                    linkProperties.sid
                );
                zeplinCache.set(zeplinLink, data);
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

export async function getZeplinLinksFromConnectedComponents(storyId: string): Promise<string[] | { error: string }>{
    if (!ZEPLIN_STYLEGUIDE_ID && !ZEPLIN_PROJECT_ID) {
        return [];
    }

    if (!cachedConnectedComponents) {
        try {
            await cacheConnectedComponents();
        } catch (e) {
            return {
                error: e.response?.data?.message || e.message,
            }
        }
    }

    const connectedComponents = cachedConnectedComponents.filter(
        ({links}) => links.find(({type, url}) => {
            if(type !== 'storybook'){
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
}

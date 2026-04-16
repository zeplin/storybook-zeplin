import {
    Component,
    Configuration,
    ConnectedComponent,
    Screen,
    User,
    ZeplinApi,
} from "@zeplin/sdk";

import { ZEPLIN_TOKEN, ZEPLIN_API_URL } from "../constants";
import { RESOURCE_TYPES, linkPropertiesToUrl, parseLink } from "./link";

type ZeplinResource = Component | Screen;

const ZEPLIN_TOKEN_STORAGE_KEY = "storybook_zeplin:access_token";
let cachedUser: undefined | User;
const zeplinResourceCache: Map<string, ZeplinResource> = new Map();
const zeplinConnectedComponentsCache: Map<string, ConnectedComponent[]> =
    new Map();
const zeplinApi = new ZeplinApi(
    new Configuration({
        accessToken: getZeplinToken,
    }),
    ZEPLIN_API_URL,
);

type ConnectedComponentParams =
    | { projectId: string }
    | { styleguideId: string };

function getZeplinToken(): string {
    return localStorage.getItem(ZEPLIN_TOKEN_STORAGE_KEY) || ZEPLIN_TOKEN || "";
}

function extractErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const withResponse = error as {
            response?: { data?: { message?: unknown } };
            message?: unknown;
        };
        if (typeof withResponse.response?.data?.message === "string") {
            return withResponse.response.data.message;
        }
        if (typeof withResponse.message === "string") {
            return withResponse.message;
        }
    }
    return String(error);
}

async function getConnectedComponents(
    params: ConnectedComponentParams,
): Promise<ConnectedComponent[]> {
    const isProject = "projectId" in params;
    const resourceId = isProject ? params.projectId : params.styleguideId;
    const cachedValue = zeplinConnectedComponentsCache.get(resourceId);
    if (cachedValue) {
        return cachedValue;
    }
    const {
        data: { numberOfConnectedComponents },
    } = isProject
        ? await zeplinApi.projects.getProject(resourceId)
        : await zeplinApi.styleguides.getStyleguide(resourceId);
    const numberOfRequest = Math.ceil(numberOfConnectedComponents / 100);
    const requestIndices = Array.from(Array(numberOfRequest).keys());
    const connectedComponents = (
        await Promise.all(
            requestIndices.map(async (index) => {
                const { data } = isProject
                    ? await zeplinApi.connectedComponents.getProjectConnectedComponents(
                          resourceId,
                          {
                              limit: 100,
                              offset: 100 * index,
                              includeLinkedStyleguides: true,
                          },
                      )
                    : await zeplinApi.connectedComponents.getStyleguideConnectedComponents(
                          resourceId,
                          {
                              limit: 100,
                              offset: 100 * index,
                              includeLinkedStyleguides: true,
                          },
                      );
                return data;
            }),
        )
    ).flat();
    zeplinConnectedComponentsCache.set(resourceId, connectedComponents);
    return connectedComponents;
}

export function isLoggedIn(): boolean {
    return Boolean(getZeplinToken());
}

export function login(token: string): void {
    localStorage.setItem(ZEPLIN_TOKEN_STORAGE_KEY, token);
}

export function logout(): void {
    localStorage.removeItem(ZEPLIN_TOKEN_STORAGE_KEY);
    cachedUser = undefined;
    zeplinResourceCache.clear();
}

export async function getZeplinResource(
    zeplinLink: string,
): Promise<ZeplinResource | { error: string }> {
    const cachedValue = zeplinResourceCache.get(zeplinLink);
    if (cachedValue) {
        return cachedValue;
    }

    const linkProperties = parseLink(zeplinLink);

    try {
        switch (linkProperties.type) {
            case RESOURCE_TYPES.PROJECT_COMPONENT: {
                const { data } = await zeplinApi.components.getProjectComponent(
                    linkProperties.pid,
                    linkProperties.coid,
                    { includeLinkedStyleguides: true },
                );
                zeplinResourceCache.set(zeplinLink, data);
                return data;
            }
            case RESOURCE_TYPES.STYLEGUIDE_COMPONENT: {
                const { data } =
                    await zeplinApi.components.getStyleguideComponent(
                        linkProperties.stid,
                        linkProperties.coid,
                        { includeLinkedStyleguides: true },
                    );
                zeplinResourceCache.set(zeplinLink, data);
                return data;
            }
            case RESOURCE_TYPES.SCREEN: {
                const { data } = await zeplinApi.screens.getScreen(
                    linkProperties.pid,
                    linkProperties.sid,
                );
                zeplinResourceCache.set(zeplinLink, data);
                return data;
            }
            default:
                if (zeplinLink.startsWith("https://zpl.io/")) {
                    return {
                        error: "zpl.io short links aren't supported yet, please paste the full Zeplin link.",
                    };
                }

                return { error: "Zeplin link is invalid." };
        }
    } catch (error) {
        return { error: extractErrorMessage(error) };
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
    } catch (error) {
        return { error: extractErrorMessage(error) };
    }
}

export async function getZeplinLinksFromConnectedComponents(
    storyId: string,
    params: ConnectedComponentParams,
): Promise<string[]> {
    try {
        const connectedComponents = (
            await getConnectedComponents(params)
        ).filter(({ links }) =>
            links.find(({ type, url }) => {
                if (type !== "storybook") {
                    return false;
                }
                const path = new URL(url).searchParams.get("path");
                if (!path) {
                    return false;
                }
                const paths = path.split("/");
                const storyIdFromUrl = paths[paths.length - 1];
                return storyIdFromUrl === storyId;
            }),
        );

        return connectedComponents.flatMap(({ components, source }) => {
            if (source?.project) {
                const pid = source.project.id;
                return components.map(({ id }) =>
                    linkPropertiesToUrl({
                        type: RESOURCE_TYPES.PROJECT_COMPONENT,
                        pid,
                        coid: id,
                    }),
                );
            }
            if (source?.styleguide) {
                const stid = source.styleguide.id;
                return components.map(({ id }) =>
                    linkPropertiesToUrl({
                        type: RESOURCE_TYPES.STYLEGUIDE_COMPONENT,
                        stid,
                        coid: id,
                    }),
                );
            }
            return [];
        });
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

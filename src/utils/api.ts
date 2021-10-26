import { getZeplinLinkProperties, RESOURCE_TYPES } from "@zeplin/storybook-inspector";
import { Component, Configuration, Screen, User, ZeplinApi } from "@zeplin/sdk";

import { ZEPLIN_TOKEN, ZEPLIN_API_URL, ZEPLIN_WEB_BASE, ZEPLIN_APP_BASE } from "../constants";

type ZeplinResource = Component | Screen;

const ZEPLIN_TOKEN_STORAGE_KEY = "storybook_zeplin:access_token";
let cachedUser: undefined | User;
const zeplinCache: Map<string, ZeplinResource> = new Map();

function getZeplinToken(): string | undefined {
    return localStorage.getItem(ZEPLIN_TOKEN_STORAGE_KEY) || ZEPLIN_TOKEN;
}

const zeplinApi = new ZeplinApi(
    new Configuration({
        accessToken: getZeplinToken
    }),
    ZEPLIN_API_URL
);

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
            error: e.message,
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
            error: e.message
        }
    }
}

import { getZeplinLinkProperties, RESOURCE_TYPES } from "@zeplin/storybook-inspector";
import { Component, Configuration, Screen, ZeplinApi } from "@zeplin/sdk";

import { ZEPLIN_TOKEN, ZEPLIN_API_URL, ZEPLIN_WEB_BASE, ZEPLIN_APP_BASE } from "../constants";

type ZeplinResource = Component | Screen;

const ZEPLIN_TOKEN_STORAGE_KEY = "storybook_zeplin:access_token";
const zeplinCache: Map<string, ZeplinResource> = new Map();


const zeplinApi = new ZeplinApi(
    new Configuration({
        accessToken: getZeplinToken
    }),
    ZEPLIN_API_URL
);

export function getZeplinToken() {
    return ZEPLIN_TOKEN || localStorage.getItem(ZEPLIN_TOKEN_STORAGE_KEY);
}

export function setZeplinToken(token: string) {
    localStorage.setItem(ZEPLIN_TOKEN_STORAGE_KEY, token);
}

export async function getZeplinResource(
    zeplinLink: string
): Promise<ZeplinResource | { error: string }> {
    const cachedValue = zeplinCache[zeplinLink];
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
                zeplinCache[zeplinLink] = data;
                return data;
            }
            case RESOURCE_TYPES.STYLEGUIDE_COMPONENT: {
                const { data } = await zeplinApi.components.getStyleguideComponent(
                    linkProperties.stid,
                    linkProperties.coid
                );
                zeplinCache[zeplinLink] = data;
                return data;
            }
            case RESOURCE_TYPES.SCREEN: {
                const { data } = await zeplinApi.screens.getScreen(
                    linkProperties.pid,
                    linkProperties.sid
                );
                zeplinCache[zeplinLink] = data;
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

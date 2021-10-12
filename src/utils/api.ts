import { getZeplinLinkProperties, RESOURCE_TYPES } from "@zeplin/storybook-inspector";

import { ZEPLIN_TOKEN, ZEPLIN_API_URL, ZEPLIN_WEB_BASE, ZEPLIN_APP_BASE } from "../constants";

const zeplinCache = {};
export async function getZeplinResource(zeplinLink: string) {
    if (!ZEPLIN_TOKEN) {
        return {
            error: "STORYBOOK_ZEPLIN_TOKEN is not set in environment variables.",
        };
    }

    const cachedValue = zeplinCache[zeplinLink];
    if (cachedValue) {
        return cachedValue;
    }

    const { type, pid, stid, coid, sid } = getZeplinLinkProperties(
        zeplinLink,
        {
            web: ZEPLIN_WEB_BASE,
            app: ZEPLIN_APP_BASE
        }
    );

    let path;
    switch (type) {
        case RESOURCE_TYPES.PROJECT_COMPONENT:
            path = `/projects/${pid}/components/${coid}`;
            break;
        case RESOURCE_TYPES.STYLEGUIDE_COMPONENT:
            path = `/styleguides/${stid}/components/${coid}`;
            break;
        case RESOURCE_TYPES.SCREEN:
            path = `/projects/${pid}/screens/${sid}`;
            break;

        default:
            return {
                error: "Zeplin link is invalid.",
            };
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${ZEPLIN_TOKEN}`);

    const response = await fetch(ZEPLIN_API_URL + path, {
        headers,
    });
    const json = await response.json();

    if (response.ok) {
        zeplinCache[zeplinLink] = json;

        return json;
    }

    return {
        error: json.message,
    };
}

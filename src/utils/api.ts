import getLinkProperties from "./zeplinLink";
import { RESOURCE_TYPES, ZEPLIN_TOKEN, ZEPLIN_API_URL } from "../constants";

const zeplinCache = {};
export async function getZeplinResource(zeplinLink: string) {
    const cachedValue = zeplinCache[zeplinLink];
    if (cachedValue) {
        return cachedValue;
    }

    const { type, pid, stid, coid, sid } = getLinkProperties(zeplinLink);

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

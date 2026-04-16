import { ZEPLIN_WEB_BASE, ZEPLIN_APP_BASE } from "../constants";

export const RESOURCE_TYPES = {
    PROJECT_COMPONENT: "project-component",
    STYLEGUIDE_COMPONENT: "styleguide-component",
    SCREEN: "screen",
    INVALID: "invalid",
} as const;

export type LinkProperties =
    | {
          type: typeof RESOURCE_TYPES.PROJECT_COMPONENT;
          pid: string;
          coid: string;
      }
    | {
          type: typeof RESOURCE_TYPES.STYLEGUIDE_COMPONENT;
          stid: string;
          coid: string;
      }
    | { type: typeof RESOURCE_TYPES.SCREEN; pid: string; sid: string }
    | { type: typeof RESOURCE_TYPES.INVALID };

const OBJECT_ID = /[\da-f]{24}/i;
const WEB_SCREEN_REGEXP = new RegExp(
    `^/project/(${OBJECT_ID.source})/screen/(${OBJECT_ID.source})$`,
    "i",
);
const WEB_PROJECT_COMPONENT_REGEXP = new RegExp(
    `^/project/(${OBJECT_ID.source})/styleguide/components$`,
    "i",
);
const WEB_STYLEGUIDE_COMPONENT_REGEXP = new RegExp(
    `^/styleguide/(${OBJECT_ID.source})/components$`,
    "i",
);

function parseWebLink(link: string): LinkProperties {
    let url: URL;
    try {
        url = new URL(link);
    } catch {
        return { type: RESOURCE_TYPES.INVALID };
    }

    const screenMatch = url.pathname.match(WEB_SCREEN_REGEXP);
    if (screenMatch) {
        return {
            type: RESOURCE_TYPES.SCREEN,
            pid: screenMatch[1],
            sid: screenMatch[2],
        };
    }

    const projectComponentMatch = url.pathname.match(
        WEB_PROJECT_COMPONENT_REGEXP,
    );
    if (projectComponentMatch) {
        const coid = url.searchParams.get("coid");
        if (coid && OBJECT_ID.test(coid)) {
            return {
                type: RESOURCE_TYPES.PROJECT_COMPONENT,
                pid: projectComponentMatch[1],
                coid,
            };
        }
    }

    const styleguideComponentMatch = url.pathname.match(
        WEB_STYLEGUIDE_COMPONENT_REGEXP,
    );
    if (styleguideComponentMatch) {
        const coid = url.searchParams.get("coid");
        if (coid && OBJECT_ID.test(coid)) {
            return {
                type: RESOURCE_TYPES.STYLEGUIDE_COMPONENT,
                stid: styleguideComponentMatch[1],
                coid,
            };
        }
    }

    return { type: RESOURCE_TYPES.INVALID };
}

function parseAppLink(link: string): LinkProperties {
    const queryIndex = link.indexOf("?");
    if (queryIndex < 0) {
        return { type: RESOURCE_TYPES.INVALID };
    }
    const prefix = link.slice(0, queryIndex);
    const params = new URLSearchParams(link.slice(queryIndex + 1));

    if (prefix === `${ZEPLIN_APP_BASE}//components`) {
        const pid = params.get("pid") ?? undefined;
        const stid = params.get("stid") ?? undefined;
        const coid = params.get("coid") ?? params.get("coids") ?? undefined;
        if (!coid || !OBJECT_ID.test(coid)) {
            return { type: RESOURCE_TYPES.INVALID };
        }
        if (pid && OBJECT_ID.test(pid)) {
            return { type: RESOURCE_TYPES.PROJECT_COMPONENT, pid, coid };
        }
        if (stid && OBJECT_ID.test(stid)) {
            return { type: RESOURCE_TYPES.STYLEGUIDE_COMPONENT, stid, coid };
        }
    }

    if (prefix === `${ZEPLIN_APP_BASE}//screen`) {
        const pid = params.get("pid");
        const sid = params.get("sid");
        if (pid && sid && OBJECT_ID.test(pid) && OBJECT_ID.test(sid)) {
            return { type: RESOURCE_TYPES.SCREEN, pid, sid };
        }
    }

    return { type: RESOURCE_TYPES.INVALID };
}

export function parseLink(link: string): LinkProperties {
    if (link.startsWith(ZEPLIN_APP_BASE)) {
        return parseAppLink(link);
    }

    if (link.startsWith(ZEPLIN_WEB_BASE)) {
        return parseWebLink(link);
    }

    return { type: RESOURCE_TYPES.INVALID };
}

export function linkPropertiesToUrl(linkProperties: LinkProperties): string {
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

import queryString from "query-string";

import { RESOURCE_TYPES, LINK_BASES, LINK_TYPES } from "../constants";

const webScreenRegex = /\/project\/([\da-f]{24})\/screen\/([\da-f]{24})?/i;
const webComponentRegex = /(?:\/project\/([\da-f]{24}))?\/styleguide(?:\/([\da-f]{24}))?\/components\?coid=([\da-f]{24})?/i;

interface LinkProperties {
    type: string;
    pid?: string;
    stid?: string;
    sid?: string;
    coid?: string;
}

function getLinkType(url: string): string | null {
    if (url.startsWith(LINK_BASES.APP)) {
        return LINK_TYPES.APP;
    } else if (url.startsWith(LINK_BASES.WEB)) {
        return LINK_TYPES.WEB;
    }

    return null;
}

function getComponentProperties({
    pid,
    stid,
    coid,
}: {
    pid?: string;
    stid?: string;
    coid: string;
}): LinkProperties {
    if (!coid || (pid && stid)) {
        return {
            type: RESOURCE_TYPES.INVALID,
        };
    }

    if (pid) {
        return {
            type: RESOURCE_TYPES.PROJECT_COMPONENT,
            pid,
            coid,
        };
    }

    if (stid) {
        return {
            type: RESOURCE_TYPES.STYLEGUIDE_COMPONENT,
            stid,
            coid,
        };
    }

    return {
        type: RESOURCE_TYPES.INVALID,
    };
}

function getWebLinkProperties(link: string): LinkProperties {
    const screenMatch = link.match(webScreenRegex) || [];
    let pid = screenMatch[1];
    const sid = screenMatch[2];

    if (pid && sid) {
        return {
            type: RESOURCE_TYPES.SCREEN,
            pid,
            sid,
        };
    }

    const componentMatch = link.match(webComponentRegex) || [];

    pid = componentMatch[1];
    const stid = componentMatch[2];
    const coid = componentMatch[3];

    return getComponentProperties({ pid, stid, coid });
}

function getAppUriProperties(uri: string): LinkProperties {
    const searchParams = uri.split("?")[1];

    if (!searchParams) {
        return { type: RESOURCE_TYPES.INVALID };
    }

    const componentUri = `${LINK_BASES.APP}//components`;
    const screenUri = `${LINK_BASES.APP}//screen`;

    if (uri.startsWith(componentUri)) {
        const parsedSearchParams = queryString.parse(searchParams);

        const pid = parsedSearchParams.pid?.toString();
        const stid = parsedSearchParams.stid?.toString();
        const coid =
            parsedSearchParams.coid?.toString() ||
            parsedSearchParams.coids?.toString();

        return getComponentProperties({ pid, stid, coid });
    } else if (uri.startsWith(screenUri)) {
        const parsedSearchParams = queryString.parse(searchParams);

        const pid = parsedSearchParams.pid?.toString();
        const sid = parsedSearchParams.sid?.toString();

        if (pid && sid) {
            return {
                type: RESOURCE_TYPES.SCREEN,
                pid,
                sid,
            };
        }
    }

    return { type: RESOURCE_TYPES.INVALID };
}

export default function getLinkProperties(link: string): LinkProperties {
    const linkType = getLinkType(link);

    if (linkType === LINK_TYPES.WEB) {
        return getWebLinkProperties(link);
    } else if (linkType === LINK_TYPES.APP) {
        return getAppUriProperties(link);
    }

    return { type: RESOURCE_TYPES.INVALID };
}

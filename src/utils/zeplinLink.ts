import { RESOURCE_TYPES, LINK_BASES, LINK_TYPES } from "../constants";

interface LinkProperties {
    type: string;
    pid?: string;
    stid?: string;
    sid?: string;
    coid?: string;
}

function getLinkType(url) {
    if (url.protocol === LINK_BASES.APP) {
        return LINK_TYPES.APP;
    }

    switch (url.origin) {
        case LINK_BASES.WEB:
            return LINK_TYPES.WEB;
        case LINK_BASES.SHORT:
            return LINK_TYPES.SHORT;

        default:
            return null;
    }
}

function getComponentProperties({
    pid,
    stid,
    coid
}) {
    if (!coid || (pid && stid)) {
        return {
            type: RESOURCE_TYPES.INVALID
        };
    }

    if (pid) {
        return {
            type: RESOURCE_TYPES.PROJECT_COMPONENT,
            pid,
            coid
        };
    }

    if (stid) {
        return {
            type: RESOURCE_TYPES.STYLEGUIDE_COMPONENT,
            stid,
            coid
        };
    }

    return {
        type: RESOURCE_TYPES.INVALID
    };
}

function getWebLinkProperties({ href }) {
    const screenRegex = /\/project\/([\da-f]{24})\/screen\/([\da-f]{24})?/i;
    const screenMatch = href.match(screenRegex) || [];
    const [, pid, sid] = screenMatch;

    if (pid && sid) {
        return {
            type: RESOURCE_TYPES.SCREEN,
            pid,
            sid
        };
    }

    const componentRegex = /(?:\/project\/([\da-f]{24}))?\/styleguide(?:\/([\da-f]{24}))?\/components\?coid=([\da-f]{24})?/i;
    const componentMatch = href.match(componentRegex) || [];
    const [, pid2, stid, coid] = componentMatch;

    return getComponentProperties({ pid: pid2, stid, coid })
}

function getAppLinkProperties({ searchParams }) {
    const pid = searchParams.get("pid");
    const sid = searchParams.get("sid");
    const stid = searchParams.get("stid");
    const coid = searchParams.get("coid");

    if (pid && sid) {
        return {
            type: RESOURCE_TYPES.SCREEN,
            pid,
            sid
        };
    }

    return getComponentProperties({ pid, stid, coid })
}

/*async function getShortLinkProperties({ href }) {
    try {
        const response = await fetch(`/resolve-short-link?link=${encodeURIComponent(href)}`);
        const fullUrl = await response.text();
        const url = new URL(fullUrl);

        return getWebLinkProperties(url);
    } catch (_) {
        return { type: RESOURCE_TYPES.INVALID };
    }
}*/

/**
 * Returns properties of Zeplin link
 * @param {URL} url
 * @return {Object} {type, pid, stid, coid, sid} if link is valid. Otherwise, returns type with `INVALID`
 */
export default function getLinkProperties(link): LinkProperties {
    let url;
    try {
        url = new URL(link);
    } catch (err) {
        return { type: RESOURCE_TYPES.INVALID };
    }

    const linkType = getLinkType(url);

    switch (linkType) {
        case LINK_TYPES.WEB:
            return getWebLinkProperties(url);
        case LINK_TYPES.APP:
            return getAppLinkProperties(url);
        /*case LINK_TYPES.SHORT:
            return getShortLinkProperties(url);
        */
        default:
            return { type: RESOURCE_TYPES.INVALID };
    }
}

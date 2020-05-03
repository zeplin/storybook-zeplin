import { RESOURCE_TYPES, LINK_BASES, LINK_TYPES } from "../constants";

const webScreenRegex = /\/project\/([\da-f]{24})\/screen\/([\da-f]{24})?/i;
const webComponentRegex = /(?:\/project\/([\da-f]{24}))?\/styleguide(?:\/([\da-f]{24}))?\/components\?coid=([\da-f]{24})?/i;
const appScreenRegex = /zpl:\/\/screen\?pid=([\da-f]{24})&sid=([\da-f]{24})?/i;
const appComponentRegex = /zpl:\/\/components\?pid=([\da-f]{24})&coid=([\da-f]{24})?/i;

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

function getLinkPropertiesByType(link: string, type: string): LinkProperties {
    const screenRegex =
        type === LINK_TYPES.WEB ? webScreenRegex : appScreenRegex;
    const componentRegex =
        type === LINK_TYPES.WEB ? webComponentRegex : appComponentRegex;

    const screenMatch = link.match(screenRegex) || [];
    let pid = screenMatch[1];
    const sid = screenMatch[2];

    if (pid && sid) {
        return {
            type: RESOURCE_TYPES.SCREEN,
            pid,
            sid,
        };
    }

    const componentMatch = link.match(componentRegex) || [];

    pid = componentMatch[1];
    const stid = componentMatch[2];
    const coid = componentMatch[3];

    return getComponentProperties({ pid, stid, coid });
}

export default function getLinkProperties(link: string): LinkProperties {
    const linkType = getLinkType(link);

    if (linkType) {
        return getLinkPropertiesByType(link, linkType);
    }

    return { type: RESOURCE_TYPES.INVALID };
}

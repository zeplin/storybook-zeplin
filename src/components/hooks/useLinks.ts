import { useEffect, useReducer, useState } from "react";

import { ZeplinLink } from "../../types/ZeplinLink";
import { ZEPLIN_APP_BASE, ZEPLIN_WEB_BASE } from "../../constants";
import { useStorybookState } from "@storybook/api";
import { getZeplinLinksFromConnectedComponents } from "../../utils/api";

const getProjectIdFromProjectLink = (link: string): string | null => {
    if (link.startsWith(`${ZEPLIN_APP_BASE}//project?`)) {
        const [, searchParams] = link.split("?");
        const result = /^pid=([\da-f]{24})$/.exec(searchParams);
        return result?.[1];
    }
    if (link.startsWith(`${ZEPLIN_WEB_BASE}/project`)) {
        const result = /\/project\/([\da-f]{24})$/i.exec(link);
        return result?.[1];
    }
    return null;
}

const getStyleguideIdFromStyleguideLink = (link: string): string | null => {
    if (link.startsWith(`${ZEPLIN_APP_BASE}//styleguide?`)) {
        const [, searchParams] = link.split("?");
        const result = /^stid=([\da-f]{24})$/.exec(searchParams);
        return result?.[1];
    }
    if (link.startsWith(`${ZEPLIN_WEB_BASE}/styleguide`)) {
        const result = /\/styleguide\/([\da-f]{24})$/i.exec(link);
        return result?.[1];
    }
    return null;
}

interface State {
    links: ZeplinLink[];
    error: string | null;
    linksLoading: boolean;
}

const isZeplinLinkValid = (link: unknown): link is ZeplinLink => {
    return typeof (link as any)?.name === "string" && typeof (link as any)?.link === "string"

}

export const useLinks = (zeplinLink: unknown): State => {
    const [state, setState] = useReducer(
        (state: State, newState: State) => ({ ...state, ...newState }),
        {
            links: [],
            error: null,
            linksLoading: false,
        },
        undefined
    );
    const { storyId } = useStorybookState();

    useEffect(() => {
        if (!zeplinLink) {
            setState({ links: [], error: null, linksLoading: false });
        } else if (Array.isArray(zeplinLink) && zeplinLink.every(isZeplinLinkValid)) {
            setState({ links: zeplinLink, error: null, linksLoading: false });
        } else if(Array.isArray(zeplinLink) || typeof zeplinLink !== "string") {
            const formattedValue = JSON.stringify(zeplinLink, null, 2);
            setState({ links: [], error: `Zeplin link is malformed. Received: ${formattedValue}`, linksLoading: false });
        } else {
            const projectId = getProjectIdFromProjectLink(zeplinLink);
            const styleguideId = getStyleguideIdFromStyleguideLink(zeplinLink);
            if (projectId || styleguideId) {
                setState({ links: [], error: null, linksLoading: true });
                getZeplinLinksFromConnectedComponents(
                    storyId,
                    projectId ? { projectId } : { styleguideId }
                ).then(links => {
                    const mappedLinks = links.map((link, i) => ({
                        name: `Component ${i + 1}`,
                        link
                    }));

                    setState({ links: mappedLinks, error: null, linksLoading: false });
                }).catch(error => {
                    setState({ links: [], error: error?.message ?? String(error), linksLoading: false });
                });
            } else {
                setState({ links: [{ link: zeplinLink, name: "Component" }], error: null, linksLoading: false });
            }
        }
    }, [storyId]);
    return state;
}

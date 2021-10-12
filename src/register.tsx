import React from "react";
import lt from "semver/functions/lt";
import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";
import { useParameter } from "@storybook/api";
import { getStoryDetail, getStories, getGlobalContext } from "@zeplin/storybook-inspector";

import ZeplinPanel from "./components/ZeplinPanel";
import {
    TITLE,
    ADDON_ID,
    PARAM_KEY,
    PANEL_ID,
    PARENT_ORIGIN,
    ZEPLIN_WEB_BASE,
    ZEPLIN_APP_BASE,
} from "./constants";
import { postError, postMessage } from "./utils/postToParent";

function getParentOrigin(): string | undefined {
    const url = document.referrer || document.location.ancestorOrigins?.[0];
    return url && new URL(url).origin;
}

addons.register(ADDON_ID, async api => {
    const render = ({ active, key }) => {
        const zeplinLink = useParameter(PARAM_KEY, null);

        return (
            <AddonPanel active={active} key={key}>
                <ZeplinPanel zeplinLink={zeplinLink} />
            </AddonPanel>
        );
    }

    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: TITLE,
        paramKey: PARAM_KEY,
        render,
    });

    if (getParentOrigin() !== PARENT_ORIGIN) {
        // Bypass data extraction
        return;
    }

    const globalContext = await getGlobalContext(
        window,
        {
            web: ZEPLIN_WEB_BASE,
            app: ZEPLIN_APP_BASE
        }
    );

    if (lt(api.getCurrentVersion().version, "5.0.0")) {
        postError(
            "stories",
            {
                message: "version is less than 5.0.0",
                extra: api.getCurrentVersion()
            }
        );
        return;
    }

    try {
        const stories = getStories(globalContext);
        postMessage("stories", stories);
    } catch (e) {
        postError(
            "stories",
            {
                message: e?.message || e || "Unknown error"
            }
        );
    }

    const selection = api.getCurrentStoryData();

    if (!selection?.id) {
        return;
    }

    try {
        const story = getStoryDetail(selection.id, globalContext);
        if(story) {
            postMessage("story-detail", story);
        }
    } catch (e) {
        postError(
            "story-detail",
            {
                message: e?.message || e || "Unknown error"
            }
        );
    }


});

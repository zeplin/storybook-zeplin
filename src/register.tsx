import React from "react";
import lt from "semver/functions/lt";
import { addons, types, useParameter } from "@storybook/manager-api";
import { AddonPanel } from "@storybook/components";
import { getStoryDetail, getStories, getGlobalContext } from "@zeplin/storybook-inspector";

import {
    TITLE,
    ADDON_ID,
    PARAM_KEY,
    PANEL_ID,
    ZEPLIN_WEB_BASE,
    ZEPLIN_APP_BASE
} from "./constants";
import { messenger } from "./utils/messenger";
import { MainPanel } from "./components/MainPanel";

addons.register(ADDON_ID, async api => {
    const render = ({ active, key }) => {
        const zeplinLink = useParameter(PARAM_KEY, null);

        return (
            <AddonPanel active={active} key={key}>
                <MainPanel zeplinLink={zeplinLink} />
            </AddonPanel>
        );
    }

    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: TITLE,
        paramKey: PARAM_KEY,
        render,
    });

    const globalContextPromise = getGlobalContext(
        window,
        {
            web: ZEPLIN_WEB_BASE,
            app: ZEPLIN_APP_BASE
        },
        Infinity // We will get client API from window object eventually, No need to timeout.
    );

    if (lt(api.getCurrentVersion().version, "5.0.0")) {
        messenger.postError(
            "ready",
            {
                message: "version is less than 5.0.0",
                extra: api.getCurrentVersion()
            }
        );
        return;
    }

    messenger.respondOnMessage("stories", async () => getStories(await globalContextPromise));
    messenger.respondOnMessage("story-detail", async (data) => getStoryDetail(data.payload?.id, await globalContextPromise));

    messenger.postMessage("ready");
});

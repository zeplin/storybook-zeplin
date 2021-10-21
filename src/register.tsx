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
    ZEPLIN_WEB_BASE,
    ZEPLIN_APP_BASE
} from "./constants";
import { messenger } from "./utils/messenger";

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

    const globalContext = await getGlobalContext(
        window,
        {
            web: ZEPLIN_WEB_BASE,
            app: ZEPLIN_APP_BASE
        }
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

    messenger.respondOnMessage("stories", () => getStories(globalContext));
    messenger.respondOnMessage("story-detail", (data) => getStoryDetail(data.payload?.id, globalContext));

    messenger.postMessage("ready");
});

import React from "react";
// @ts-ignore
import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";

import ZeplinPanel from "./components/ZeplinPanel";
import {
    ZEPLIN_TOKEN,
    TITLE,
    ADDON_ID,
    PARAM_KEY,
    PANEL_ID,
} from "./constants";

if (ZEPLIN_TOKEN) {
    addons.register(ADDON_ID, (api) => {
        const render = ({ active, key }) => (
            <AddonPanel active={active} key={key}>
                <ZeplinPanel />
            </AddonPanel>
        );

        addons.add(PANEL_ID, {
            type: types.PANEL,
            title: TITLE,
            paramKey: PARAM_KEY,
            render,
        });
    });
}

import React from "react";
import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";
import { useParameter } from "@storybook/api";

import ZeplinPanel from "./components/ZeplinPanel";
import {
    TITLE,
    ADDON_ID,
    PARAM_KEY,
    PANEL_ID,
} from "./constants";

addons.register(ADDON_ID, () => {
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
});

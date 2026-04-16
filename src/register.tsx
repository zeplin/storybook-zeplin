import React from "react";
import { addons, types, useParameter } from "@storybook/manager-api";
import { AddonPanel } from "@storybook/components";

import { TITLE, ADDON_ID, PARAM_KEY, PANEL_ID } from "./constants";
import { MainPanel } from "./components/MainPanel";

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: TITLE,
        paramKey: PARAM_KEY,
        render: ({ active }) => {
            const zeplinLink = useParameter(PARAM_KEY, null);

            return (
                <AddonPanel active={active ?? false}>
                    <MainPanel zeplinLink={zeplinLink} />
                </AddonPanel>
            );
        },
    });
});

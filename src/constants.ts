export const TITLE = "Zeplin";
export const ADDON_ID = "zeplin";
export const PARAM_KEY = "zeplinLink";
export const PANEL_ID = `${ADDON_ID}/panel`;
// @ts-ignore
export const ZEPLIN_TOKEN = process.env.STORYBOOK_ZEPLIN_TOKEN;

export const RESOURCE_TYPES = {
    PROJECT_COMPONENT: "project-component",
    STYLEGUIDE_COMPONENT: "styleguide-component",
    SCREEN: "screen",
    INVALID: "invalid",
};

export const LINK_TYPES = {
    WEB: "web",
    APP: "app",
    SHORT: "short",
};

export const LINK_BASES = {
    WEB: "https://app.zeplin.io",
    APP: "zpl:",
    SHORT: "https://zpl.io"
}

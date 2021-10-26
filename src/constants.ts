export const TITLE = "Zeplin";
export const ADDON_ID = "zeplin";
export const PARAM_KEY = "zeplinLink";
export const PANEL_ID = `${ADDON_ID}/panel`;

export const {
    STORYBOOK_ZEPLIN_TOKEN: ZEPLIN_TOKEN,
    STORYBOOK_ZEPLIN_PARENT_ORIGIN: PARENT_ORIGIN = "https://app.zeplin.io",
    STORYBOOK_ZEPLIN_API_URL: ZEPLIN_API_URL = "https://api.zeplin.dev/v1",
    STORYBOOK_ZEPLIN_WEB_BASE: ZEPLIN_WEB_BASE = "https://app.zeplin.io",
    STORYBOOK_ZEPLIN_APP_BASE: ZEPLIN_APP_BASE = "zpl:"
} = process.env;

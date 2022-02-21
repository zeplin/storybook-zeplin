export const TITLE = "Zeplin";
export const ADDON_ID = "zeplin";
export const PARAM_KEY = "zeplinLink";
export const PANEL_ID = `${ADDON_ID}/panel`;

export const ZEPLIN_TOKEN = process.env.STORYBOOK_ZEPLIN_TOKEN;
export const PARENT_ORIGIN = process.env.STORYBOOK_ZEPLIN_PARENT_ORIGIN ?? "https://app.zeplin.io";
export const ZEPLIN_API_URL = process.env.STORYBOOK_ZEPLIN_API_URL ?? "https://api.zeplin.dev";
export const ZEPLIN_WEB_BASE = process.env.STORYBOOK_ZEPLIN_WEB_BASE ?? "https://app.zeplin.io";
export const ZEPLIN_APP_BASE = process.env.STORYBOOK_ZEPLIN_APP_BASE ?? "zpl:";

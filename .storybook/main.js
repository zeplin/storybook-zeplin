const IS_PRODUCTION = process.env.NODE_ENV === "production";

const stories = ["./**/*.stories.tsx"];

// Stories from src are for development purposes only.
if (!IS_PRODUCTION) {
    stories.push("../src/**/*.stories.tsx");
}

export default {
    stories,
    addons: ["../preset.js", "@storybook/addon-webpack5-compiler-swc"],
    framework: "@storybook/react-webpack5",
};

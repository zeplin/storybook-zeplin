const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const stories = ["./**/*.stories.jsx"]

// stories from src are for development purposes only
if(!IS_PRODUCTION) {
    stories.push("../src/**/*.stories.tsx")
}

module.exports = {
    stories,
    addons: ["../dist/register"],
};

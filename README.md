<div align="center">

  <img src="./logo.png" width="280" alt="Zeplin Storybook Addon"/>
  <br/>
  <br/>

[![npm version](https://badge.fury.io/js/storybook-zeplin.svg)](https://badge.fury.io/js/storybook-zeplin)
[![Monthly download](https://img.shields.io/npm/dm/storybook-zeplin.svg)](https://www.npmjs.com/package/storybook-zeplin)
[![GitHub license](https://img.shields.io/github/license/mertkahyaoglu/storybook-zeplin.svg)](https://github.com/mertkahyaoglu/storybook-zeplin/blob/master/LICENSE)

</div>

<hr/>

## storybook-zeplin

[Storybook](https://github.com/storybooks/storybook) addon that embeds Zeplin resources such as screens and components in the addon panel for better design-development workflow.

  <img src="./screenshot.png" width="100%" alt="Zeplin Storybook Addon"/>

## Requirements

-   Storybook@>=5.0.0

This addon should work with any framework. If you find a case that the addon does not work, please open an issue.

## Getting started

### 1. Install

```sh
npm install --save-dev storybook-zeplin
# yarn add -D storybook-zeplin
```

### 2. Add Zeplin access token to your environment variables

In order to access your Zeplin resources, you need to provide your access token. You can create one from https://app.zeplin.io/profile/developer.

```shell
# .env
STORYBOOK_ZEPLIN_TOKEN=<zeplin_token>
```

#### ⚠️ Disclaimer

Please note that this token can be accessed from client side. For security reasons, it would be safe to use this addon on localhost or internal network.

### 3. Register the addon in `main.js`

```js
// .storybook/main.js
module.exports = {
    addons: ["storybook-zeplin/register"],
};
```

If you're using Storybook@5.0.x;

```js
// .storybook/addons.js
import 'storybook-zeplin/register'
```

### 4. Add a Zeplin link to your story

You can use full web URL or app URI of Zeplin components/screens as `zeplinLink`.

```js
export default {
    title: "Button",
    component: Button,
};

export const Default = () => <Button>Click me</Button>;
export const Secondary = () => <Button secondary>Click me</Button>;

Default.story = {
    name: "Primary Button",
    parameters: {
        zeplinLink:
            "https://app.zeplin.io/project/5e7a6d478204d59183a1c76b/styleguide/components?coid=5eac833c5f1f2f1cb19f4f19",
    },
};

Secondary.story = {
    name: "Secondary Button",
    parameters: {
        zeplinLink:
            "zpl://components?pid=5e6a066950e2c2111c16a1d3&coid=5bb478ad26feb174f3ff89b5",
    },
};
```

## Development

Run following commands in separate tabs to start development

```shell
npm run watch
npm run storybook
```

## License

MIT © [Mert Kahyaoğlu](https://mert-kahyaoglu.com)

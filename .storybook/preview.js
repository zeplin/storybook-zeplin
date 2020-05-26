import React from "react";
import { addDecorator } from '@storybook/react';
import { ThemeProvider, themes, convert } from '@storybook/theming';

const withTheme = story => <ThemeProvider theme={convert(themes.normal)}>
  {story()}
</ThemeProvider>

addDecorator(withTheme)
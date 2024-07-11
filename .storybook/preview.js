import React from "react";
import { ThemeProvider, convert, themes } from '@storybook/theming';

const withTheme = (StoryFn) => {
    return (
      <ThemeProvider theme={convert(themes.light)}>
        <StoryFn />
      </ThemeProvider>
    )
  }
  
  export const decorators = [withTheme]

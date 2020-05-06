import React from "react";
import { storiesOf } from "@storybook/react";

const style = {
    width: 116,
    height: 36,
    background: "#009688",
    color: "white",
    border: "none",
    borderRadius: 2,
    fontSize: 14,
    letterSpacing: 1
};

const zeplinLink = process.env.STORYBOOK_ZEPLIN_LINK;

storiesOf("Button")
    .addParameters({
        zeplinLink,
    })
    .add("Default", () => <button style={style}>BUTTON</button>);

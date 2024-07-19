import React from "react";
import Button from "./Button";

export default {
    title: "Example/Button",
    component: Button,
};

export const ButtonNormal = () => <Button>Button</Button>;
export const ButtonPressed = () => <Button active>Button</Button>;
export const ButtonDisabled = () => <Button disabled>Button</Button>;
export const ButtonMultiple = () => (
    <>
        <ButtonNormal />
        <br />
        <br />
        <ButtonPressed />
        <br />
        <br />
        <ButtonDisabled />
    </>
);

ButtonNormal.parameters = {
    zeplinLink:
        "https://app.zeplin.io/project/62380c9fa84e9916db1710b0/styleguide/components?coid=63345e42ecd1379acf991123",
};

ButtonPressed.parameters = {
    zeplinLink:
        "https://app.zeplin.io/project/62380c9fa84e9916db1710b0/styleguide/components?coid=63345e4297f930b58e7a3a8d",
};

ButtonDisabled.parameters = {
    zeplinLink:
        "https://app.zeplin.io/project/62380c9fa84e9916db1710b0/styleguide/components?coid=63345e42ecd1379acf991123",
};

ButtonMultiple.parameters = {
    zeplinLink: [
        {
            name: "Default",
            link: ButtonNormal.parameters.zeplinLink,
        },
        {
            name: "Pressed",
            link: ButtonPressed.parameters.zeplinLink,
        },
        {
            name: "Disabled",
            link: ButtonDisabled.parameters.zeplinLink,
        },
    ],
};

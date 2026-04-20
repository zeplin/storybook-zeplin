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
        "https://app.zeplin.io/project/6995047f384a0a5f47dd054b/styleguide/components?coid=6500a3722eaa530d288fcb61",
};

ButtonPressed.parameters = {
    zeplinLink:
        "https://app.zeplin.io/project/6995047f384a0a5f47dd054b/styleguide/component/699f6c36f99cddc1d2ce9fe3",
};

ButtonDisabled.parameters = {
    zeplinLink:
        "https://app.zeplin.io/project/6995047f384a0a5f47dd054b/styleguide/component/699cd8a90de4b0c606368bf2",
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

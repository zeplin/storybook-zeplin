import React from "react";
import { Icons, IconButton } from "@storybook/components";
import { styled } from "@storybook/theming";

interface HeaderButtonsProps {
    onZoomIn(): void;
    onZoomOut(): void;
    onZoomReset(): void;
}

export default function HeaderButtons(props: HeaderButtonsProps) {
    const { onZoomIn, onZoomOut, onZoomReset } = props;
    return (
        <Container>
            <IconButton
                className="iconButton"
                onClick={onZoomIn}
                title="Zoom in"
            >
                <Icons icon="zoom" />
            </IconButton>
            <IconButton
                className="iconButton"
                onClick={onZoomOut}
                title="Zoom out"
            >
                <Icons icon="zoomout" />
            </IconButton>
            <IconButton
                className="iconButton"
                onClick={onZoomReset}
                title="Reset zoom"
            >
                <Icons icon="zoomreset" />
            </IconButton>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    button {
        margin-left: 15px;
        color: #999;
    }
`;

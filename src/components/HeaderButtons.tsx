import React, { FunctionComponent } from "react";
import { Icons, IconButton, TooltipMessage, WithTooltip, Link } from "@storybook/components";
import { styled } from "@storybook/theming";

interface HeaderButtonsProps {
    username?: string;
    onLogout(): void;
    onZoomIn(): void;
    onZoomOut(): void;
    onZoomReset(): void;
}

interface ProfileTooltipProps {
    username?: string;
    onLogout(): void;
}

const ProfileTooltip: FunctionComponent<ProfileTooltipProps> = ({ username, onLogout }) => (
    <TooltipWrapper>
        <TooltipMessage
            title={username && <TooltipTitle>{username}</TooltipTitle>}
            links={[{ onClick: onLogout, title: "logout" }]}
        />
    </TooltipWrapper>
);

export default function HeaderButtons({
    username,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onLogout
}: HeaderButtonsProps) {
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
            <WithTooltip
                placement="bottom"
                trigger="click"
                tooltip={<ProfileTooltip username={username} onLogout={onLogout} />}
            >
                <IconButton
                    className="iconButton"
                    title="Profile"
                >
                    <Icons icon="user" />
                </IconButton>
            </WithTooltip>
        </Container>
    );
}

const TooltipTitle = styled.div`
    text-align: center;
`

const Container = styled.div`
    display: flex;
    button {
        margin-left: 15px;
        color: #999;
    }
`;

const TooltipWrapper = styled.div`
& > div {
  width: auto;
}
`;

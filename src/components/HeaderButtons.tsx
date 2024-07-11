import React, { FunctionComponent } from "react";
import { IconButton, TooltipMessage, WithTooltip } from "@storybook/components";
import { UserIcon, ZoomIcon, ZoomOutIcon, ZoomResetIcon } from "@storybook/icons";
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
            links={[{ onClick: onLogout, title: "Log out" }]}
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
                <ZoomIcon/>
            </IconButton>
            <IconButton
                className="iconButton"
                onClick={onZoomOut}
                title="Zoom out"
            >
                <ZoomOutIcon/>
            </IconButton>
            <IconButton
                className="iconButton"
                onClick={onZoomReset}
                title="Reset zoom"
            >
                <ZoomResetIcon/>
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
                    <UserIcon/>
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

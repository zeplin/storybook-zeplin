import React, { FunctionComponent } from "react";
import {
    Button,
    TooltipMessage,
    WithTooltip,
} from "storybook/internal/components";
import {
    UserIcon,
    ZoomIcon,
    ZoomOutIcon,
    ZoomResetIcon,
} from "@storybook/icons";
import { styled } from "storybook/theming";

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

const ProfileTooltip: FunctionComponent<ProfileTooltipProps> = ({
    username,
    onLogout,
}) => (
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
    onLogout,
}: HeaderButtonsProps) {
    return (
        <Container>
            <Button onClick={onZoomIn} ariaLabel="Zoom in">
                <ZoomIcon />
            </Button>
            <Button onClick={onZoomOut} ariaLabel="Zoom out">
                <ZoomOutIcon />
            </Button>
            <Button onClick={onZoomReset} ariaLabel="Reset zoom">
                <ZoomResetIcon />
            </Button>
            <WithTooltip
                placement="bottom"
                trigger="click"
                tooltip={
                    <ProfileTooltip username={username} onLogout={onLogout} />
                }
            >
                <Button ariaLabel="Profile">
                    <UserIcon />
                </Button>
            </WithTooltip>
        </Container>
    );
}

const TooltipTitle = styled.div`
    text-align: center;
`;

const Container = styled.div`
    display: flex;
    gap: 6px;
    margin-left: 15px;
`;

const TooltipWrapper = styled.div`
    & > div {
        width: auto;
    }
`;

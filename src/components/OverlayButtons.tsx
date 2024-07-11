import React from "react";
import { IconButton } from "@storybook/components";
import { EyeCloseIcon, EyeIcon, LockIcon, MirrorIcon, UnlockIcon } from "@storybook/icons";
import { styled } from "@storybook/theming";

interface OverlayButtonsProps {
    overlayIsOpen: boolean;
    overlayIsLocked: boolean;
    showDifference: boolean;
    onToggleOverlay(): void;
    onToggleLock(): void;
    onToggleDifference(): void;
}

export default function OverlayButtons(props: OverlayButtonsProps) {
    const {
        onToggleOverlay,
        onToggleLock,
        onToggleDifference,
        overlayIsOpen,
        overlayIsLocked,
        showDifference,
    } = props;

    // Only show additional options when the overlay is visible
    const additionalOptions = overlayIsOpen && (
        <>
            <ToggleIconButton
                active={overlayIsLocked}
                className="iconButton"
                title={overlayIsLocked ? "Unlock overlay" : "Lock overlay"}
                onClick={onToggleLock}
            >
                {overlayIsLocked ? <LockIcon/> : <UnlockIcon/>}
            </ToggleIconButton>
            <ToggleIconButton
                active={showDifference}
                className="iconButton"
                title="Show difference"
                onClick={onToggleDifference}
            >
                <MirrorIcon/>
            </ToggleIconButton>
        </>
    );

    return (
        <Container>
            <ToggleIconButton
                active={overlayIsOpen}
                className="iconButton"
                title={overlayIsOpen ? "Hide overlay" : "Show overlay"}
                onClick={onToggleOverlay}
            >
                {overlayIsOpen ? <EyeCloseIcon/> : <EyeIcon/>}
            </ToggleIconButton>
            {additionalOptions}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    button {
        margin-right: 15px;
    }
`;

const ToggleIconButton = styled(IconButton)`
    color: ${props => props.active ? props.theme.barSelectedColor : props.theme.barTextColor}
`
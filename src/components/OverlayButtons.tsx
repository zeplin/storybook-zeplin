import React from "react";
import { Icons, IconButton } from "@storybook/components";
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
    } = props;

    // Only show additional options when the overlay is visible
    const additionalOptions = overlayIsOpen && (
        <>
            <IconButton
                className="iconButton"
                title={overlayIsLocked ? "Unlock overlay" : "Lock overlay"}
                onClick={onToggleLock}
            >
                <Icons icon={overlayIsLocked ? "lock" : "unlock"} />
            </IconButton>
            <IconButton
                className="iconButton"
                title="Show difference"
                onClick={onToggleDifference}
            >
                <Icons icon="mirror" />
            </IconButton>
        </>
    );

    return (
        <Container>
            <IconButton
                className="iconButton"
                title={overlayIsOpen ? "Hide overlay" : "Show overlay"}
                onClick={onToggleOverlay}
            >
                <Icons icon={overlayIsOpen ? "eyeclose" : "eye"} />
            </IconButton>
            {additionalOptions}
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

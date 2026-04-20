import { ToggleButton } from "storybook/internal/components";
import {
    EyeCloseIcon,
    EyeIcon,
    LockIcon,
    MirrorIcon,
    UnlockIcon,
} from "@storybook/icons";
import { styled } from "storybook/theming";

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

    const additionalOptions = overlayIsOpen && (
        <>
            <ToggleButton
                pressed={overlayIsLocked}
                ariaLabel={overlayIsLocked ? "Unlock overlay" : "Lock overlay"}
                onClick={onToggleLock}
            >
                {overlayIsLocked ? <LockIcon /> : <UnlockIcon />}
            </ToggleButton>
            <ToggleButton
                pressed={showDifference}
                ariaLabel="Show difference"
                onClick={onToggleDifference}
            >
                <MirrorIcon />
            </ToggleButton>
        </>
    );

    return (
        <Container>
            <ToggleButton
                pressed={overlayIsOpen}
                ariaLabel={overlayIsOpen ? "Hide overlay" : "Show overlay"}
                onClick={onToggleOverlay}
            >
                {overlayIsOpen ? <EyeCloseIcon /> : <EyeIcon />}
            </ToggleButton>
            {additionalOptions}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    gap: 15px;
`;

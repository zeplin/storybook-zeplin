import React, { useCallback, useReducer } from "react";
import { styled } from "@storybook/theming";

import OverlayPortal from "./OverlayPortal";
import OverlayButtons from "./OverlayButtons";
import OverlayImage from "./OverlayImage";

interface OverlayPanelProps {
    imageUrl: string;
}

interface OverlayState {
    showOverlay: boolean;
    lockOverlay: boolean;
    showDifference: boolean;
    overlayScaling: number;
    opacity: number;
}

const initialState: OverlayState = {
    showOverlay: false,
    lockOverlay: false,
    showDifference: false,
    overlayScaling: 0.5,
    opacity: 1,
};

const OverlayPanel: React.FC<OverlayPanelProps> = ({ imageUrl }) => {
    const [state, setState] = useReducer(
        (state: OverlayState, newState: Partial<OverlayState>) => ({
            ...state,
            ...newState,
        }),
        initialState
    );

    const {
        showOverlay,
        lockOverlay,
        showDifference,
        overlayScaling,
        opacity,
    } = state;

    const selectScaling = useCallback((event) => {
        setState({ overlayScaling: event.target.value });
    }, []);

    const toggleOverlay = () => {
        setState({ showOverlay: !showOverlay });
    };

    const toggleLock = () => {
        setState({ lockOverlay: !lockOverlay });
    };

    const toggleDifference = () => {
        setState({ showDifference: !showDifference });
    };

    const updateOpacity = (event) => {
        setState({ opacity: event.currentTarget.value });
    };

    return (
        <>
            <OverlayButtons
                overlayIsOpen={showOverlay}
                overlayIsLocked={lockOverlay}
                showDifference={showDifference}
                onToggleOverlay={toggleOverlay}
                onToggleLock={toggleLock}
                onToggleDifference={toggleDifference}
            />
            {showOverlay && (
                <OverlayOptions>
                    Opacity
                    <Input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={opacity}
                        onChange={updateOpacity}
                    />
                    Scaling
                    <Select onChange={selectScaling} value={overlayScaling}>
                        <option value={0.5}>x0.5</option>
                        <option value={1}>x1</option>
                        <option value={2}>x2</option>
                    </Select>
                </OverlayOptions>
            )}
            {showOverlay && (
                <OverlayPortal>
                    <OverlayImage
                        url={imageUrl}
                        opacity={opacity}
                        isLocked={lockOverlay}
                        scaling={overlayScaling}
                        showDifference={showDifference}
                    />
                </OverlayPortal>
            )}
        </>
    );
};

export default OverlayPanel;

const Select = styled.select`
    margin-left: 15px;
`;

const Input = styled.input`
  margin-right: 30px;
  margin-left: 15px;
`

const OverlayOptions = styled.div`
    margin-left: 15px;
    display: flex;
    align-items: center;
`;

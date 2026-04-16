import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { getOverlay } from "../utils/overlay";

interface OverlayPortalProps {
    children: ReactNode;
}

const OverlayPortal = ({ children }: OverlayPortalProps) => {
    const overlay = getOverlay();

    return createPortal(children, overlay);
};

export default OverlayPortal;

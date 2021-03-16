import { createPortal } from 'react-dom';
import { getOverlay } from '../utils/overlay';

const OverlayPortal = ({ children }) => {
  const overlay = getOverlay();

  return createPortal(children, overlay);
}

export default OverlayPortal;
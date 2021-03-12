import React, { useState, useEffect, useReducer } from "react"
import { styled } from "@storybook/theming";

const movementReducer = (state, offset) => {
  return {
    x: state.x + offset.x,
    y: state.y + offset.y,
  }
}

interface OverlayImageProps {
  url: string;
  opacity: number;
  scaling: number;
  isLocked: boolean;
  showDifference: boolean;
}

const OverlayImage = ({ url, opacity, scaling, isLocked, showDifference }: OverlayImageProps) => {
  const [position, updatePosition] = useReducer(movementReducer, {x: 0, y: 0});
  const [mouseDown, setMouseDown] = useState(false);


  useEffect(() => {
    const handleMouseUp = () => setMouseDown(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      updatePosition({x: e.movementX, y: e.movementY});
    };

    if (mouseDown) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseDown]);

  const handleMouseDown = () => setMouseDown(true);

  return <OverlayElement
    src={url}
    draggable={false}
    onMouseDown={handleMouseDown}
    style={{
      transform: `translate(${position.x}px, ${position.y}px) scale(${scaling})`,
      // For the difference filter to work correctly, opacity needs to be locked to 1
      opacity: showDifference ? 1 : opacity,
      pointerEvents: isLocked ? 'none' : 'all',
      mixBlendMode: showDifference ? 'difference' : 'normal'
    }}
  />
}

const OverlayElement = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  cursor: move;
  transform-origin: top left;
`

export default OverlayImage;
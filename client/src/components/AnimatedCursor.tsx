import React, { useEffect, useRef } from 'react';

interface AnimatedCursorProps {
  src: string;
  size?: number;
}

const AnimatedCursor: React.FC<AnimatedCursorProps> = ({ src, size = 32 }) => {
  const cursorRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX - size / 2}px`;
        cursorRef.current.style.top = `${e.clientY - size / 2}px`;
      }
    };
    document.addEventListener('mousemove', moveCursor);
    // Hide the default cursor
    document.body.style.cursor = 'none';
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.body.style.cursor = '';
    };
  }, [size]);

  return (
    <img
      ref={cursorRef}
      src={src}
      alt="custom cursor"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 9999,
        userSelect: 'none',
      }}
      draggable={false}
    />
  );
};

export default AnimatedCursor;
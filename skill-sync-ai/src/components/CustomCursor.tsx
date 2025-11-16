/**
 * Custom Cursor with Trailing Effect
 * Premium cursor interaction that follows mouse movement
 */

import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

export const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring animation for cursor
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trail cursors
  const [trails, setTrails] = useState<CursorPosition[]>([]);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Add trail position
      setTrails((prev) => [
        { x: e.clientX, y: e.clientY },
        ...prev.slice(0, 5),
      ]);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block">
      {/* Main cursor */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
          {/* Outer ring */}
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-primary"
            animate={{
              opacity: isHovering ? 0.3 : 0.5,
              scale: isHovering ? 1.2 : 1,
            }}
          />
          
          {/* Inner dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"
            animate={{
              scale: isClicking ? 0.5 : 1,
            }}
          />

          {/* Glow effect */}
          {isHovering && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 2, opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Trail cursors */}
      <AnimatePresence>
        {trails.map((trail, index) => (
          <motion.div
            key={index}
            className="absolute w-2 h-2 rounded-full bg-primary/30 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: 0,
              opacity: 0,
              x: trail.x,
              y: trail.y,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hide default cursor in CSS
export const hideCursorStyles = `
  @media (min-width: 768px) {
    * {
      cursor: none !important;
    }
  }
`;

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorFX() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for the outer ring (lagging effect)
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Ghost trailing dot (extra lag)
  const ghostX = useSpring(mouseX, { damping: 40, stiffness: 150 });
  const ghostY = useSpring(mouseY, { damping: 40, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') ||
        target.closest('.mapboxgl-ctrl-group') ||
        target.style.cursor === 'pointer';
      
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Ghost Trailing Dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ghostX,
          y: ghostY,
          translateX: '-50%',
          translateY: '-50%',
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'rgba(99, 102, 241, 0.3)',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />

      {/* Outer Ring with Backdrop Blur */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 64 : 36,
          height: isHovering ? 64 : 36,
          borderRadius: '50%',
          border: '1px solid rgba(129, 140, 248, 0.4)',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: isHovering ? 'blur(2px)' : 'none',
        }}
        animate={{
          scale: isClicking ? 0.9 : 1,
          borderColor: isHovering ? 'rgba(129, 140, 248, 0.9)' : 'rgba(129, 140, 248, 0.4)',
          backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Glow effect for outer ring */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: '110%',
            height: '110%',
            borderRadius: '50%',
            border: '1px dashed rgba(129, 140, 248, 0.2)',
            opacity: isHovering ? 1 : 0,
          }}
        />
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isHovering ? '#fff' : '#818cf8',
          pointerEvents: 'none',
          zIndex: 10000,
          boxShadow: isHovering 
            ? '0 0 15px rgba(255, 255, 255, 0.8)' 
            : '0 0 10px rgba(129, 140, 248, 0.6)',
        }}
        animate={{
          scale: isClicking ? 1.4 : isHovering ? 0.6 : 1,
        }}
      >
        {/* Rapid Pulse effect for the dot */}
        <motion.div
          animate={{
            scale: [1, 2.2, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            backgroundColor: isHovering ? '#fff' : '#818cf8',
          }}
        />
      </motion.div>
    </>
  );
}

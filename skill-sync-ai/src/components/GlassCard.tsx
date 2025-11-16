/**
 * Glassmorphic Card Component
 * Premium glass-effect cards with 3D hover effects
 */

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover3D?: boolean;
  glowColor?: string;
  onClick?: () => void;
}

export const GlassCard = ({ 
  children, 
  className = '', 
  hover3D = true,
  glowColor = 'purple',
  onClick
}: GlassCardProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const glowColors = {
    purple: 'shadow-purple-500/50',
    blue: 'shadow-blue-500/50',
    pink: 'shadow-pink-500/50',
    green: 'shadow-green-500/50',
    orange: 'shadow-orange-500/50',
  };

  return (
    <motion.div
      className={`
        relative
        backdrop-blur-xl
        bg-white/10
        dark:bg-black/20
        border border-white/20
        rounded-3xl
        p-6
        shadow-2xl
        ${glowColors[glowColor as keyof typeof glowColors] || glowColors.purple}
        transition-all duration-300
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        transform: hover3D 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: hover3D ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <motion.div
          className="absolute -inset-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
      
      {/* Glow effect on hover */}
      <motion.div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-${glowColor}-500/20 to-transparent`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

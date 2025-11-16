/**
 * Custom Loading Animations
 * Branded loading states with creative animations
 */

import { motion } from 'framer-motion';

export const SkillSyncLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated logo */}
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-secondary/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner circle with SS */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          SS
        </motion.div>
        
        {/* Orbiting dots */}
        {[0, 120, 240].map((angle, i) => {
          const x = Math.cos((angle * Math.PI) / 180) * 40;
          const y = Math.sin((angle * Math.PI) / 180) * 40;
          
          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-accent"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, x],
                y: [0, y],
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          );
        })}
      </div>
      
      {/* Loading text */}
      <motion.div
        className="text-lg font-semibold text-primary"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span>Loading</span>
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
        >
          ...
        </motion.span>
      </motion.div>
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard = () => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 space-y-4">
      <motion.div
        className="h-4 bg-white/20 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="h-4 bg-white/20 rounded w-1/2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="h-20 bg-white/20 rounded w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

// Minimal dot loader
export const DotLoader = () => {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-primary"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
};

// Progress bar loader
export const ProgressLoader = ({ progress = 0 }: { progress?: number }) => {
  return (
    <div className="w-full">
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <motion.p
        className="text-sm text-center mt-2 text-muted-foreground"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {progress}%
      </motion.p>
    </div>
  );
};

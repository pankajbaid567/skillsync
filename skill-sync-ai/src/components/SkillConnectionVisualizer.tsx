/**
 * Skill Connection Visualizer
 * Animated visualization showing skill exchange between users
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface SkillConnection {
  from: { name: string; skill: string };
  to: { name: string; skill: string };
  progress: number;
}

export const SkillConnectionVisualizer = () => {
  const [connections, setConnections] = useState<SkillConnection[]>([
    {
      from: { name: 'You', skill: 'React' },
      to: { name: 'Sarah', skill: 'Python' },
      progress: 0,
    },
    {
      from: { name: 'Alex', skill: 'Design' },
      to: { name: 'You', skill: 'Development' },
      progress: 0,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnections(prev =>
        prev.map(conn => ({
          ...conn,
          progress: (conn.progress + 2) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Center hub */}
      <motion.div
        className="absolute z-20 w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-2xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        <Sparkles className="w-12 h-12 text-white" />
      </motion.div>

      {/* Orbiting users */}
      {[0, 120, 240].map((angle, index) => {
        const radius = 150;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [x, x * 1.1, x],
              y: [y, y * 1.1, y],
            }}
            transition={{
              duration: 3 + index,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-xl"
                whileHover={{ scale: 1.2 }}
              >
                U{index + 1}
              </motion.div>
              
              {/* Connecting line */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  width: radius * 2,
                  height: radius * 2,
                          }}
              >
                <motion.line
                  x1={radius}
                  y1={radius}
                  x2={radius - x}
                  y2={radius - y}
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  animate={{
                    strokeDashoffset: [0, -10],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.5)" />
                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0.5)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Skill badge */}
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg text-xs font-semibold whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {['React', 'Python', 'Design'][index]}
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* Energy particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Glow rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border-2 border-primary/20"
          style={{
            width: 100 * ring,
            height: 100 * ring,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: ring * 0.5,
          }}
        />
      ))}
    </div>
  );
};

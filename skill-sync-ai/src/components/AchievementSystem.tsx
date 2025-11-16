/**
 * Achievement Badge System
 * Gamification elements with celebration animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Award, Target, Heart, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress?: number;
}

const achievements: Achievement[] = [
  {
    id: 'first-swap',
    title: 'First Swap',
    description: 'Complete your first skill swap',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-yellow-400 to-orange-500',
    unlocked: true,
  },
  {
    id: 'mentor',
    title: 'Mentor',
    description: 'Help 5 people learn new skills',
    icon: <Award className="w-6 h-6" />,
    color: 'from-blue-400 to-purple-500',
    unlocked: true,
    progress: 80,
  },
  {
    id: 'popular',
    title: 'Popular',
    description: 'Get 10 5-star reviews',
    icon: <Star className="w-6 h-6" />,
    color: 'from-pink-400 to-red-500',
    unlocked: false,
    progress: 60,
  },
  {
    id: 'master',
    title: 'Skill Master',
    description: 'Complete 20 swaps',
    icon: <Trophy className="w-6 h-6" />,
    color: 'from-green-400 to-teal-500',
    unlocked: false,
    progress: 45,
  },
];

export const AchievementBadge = ({ achievement }: { achievement: Achievement }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className={`
          relative w-24 h-24 rounded-2xl
          bg-gradient-to-br ${achievement.color}
          ${achievement.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}
          flex items-center justify-center
          text-white shadow-xl
          border-2 border-white/30
          cursor-pointer
        `}
        animate={achievement.unlocked ? {
          boxShadow: [
            '0 10px 30px rgba(0,0,0,0.3)',
            '0 10px 40px rgba(255,255,255,0.3)',
            '0 10px 30px rgba(0,0,0,0.3)',
          ],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {achievement.icon}
        
        {/* Progress ring */}
        {!achievement.unlocked && achievement.progress && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="44"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={276}
              initial={{ strokeDashoffset: 276 }}
              animate={{ strokeDashoffset: 276 - (276 * achievement.progress) / 100 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </svg>
        )}
        
        {/* Sparkle effect on hover */}
        {achievement.unlocked && isHovered && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.cos((i * Math.PI) / 2) * 30],
                  y: [0, Math.sin((i * Math.PI) / 2) * 30],
                }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black/90 text-white rounded-xl shadow-xl z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="font-semibold text-sm">{achievement.title}</p>
            <p className="text-xs text-gray-300 mt-1">{achievement.description}</p>
            {achievement.progress && !achievement.unlocked && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const AchievementShowcase = () => {
  return (
    <div className="space-y-6">
      <motion.h3
        className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Achievements
      </motion.h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
          >
            <AchievementBadge achievement={achievement} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Celebration animation when achievement is unlocked
export const AchievementUnlockAnimation = ({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative p-8 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl max-w-md"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        {/* Confetti */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i % 5],
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 300],
              y: [0, (Math.random() - 0.5) * 300],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
            }}
          />
        ))}

        <div className="relative text-center text-white space-y-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          >
            {achievement.icon}
          </motion.div>
          
          <h2 className="text-3xl font-bold">Achievement Unlocked!</h2>
          <p className="text-xl font-semibold">{achievement.title}</p>
          <p className="text-sm opacity-90">{achievement.description}</p>
          
          <motion.button
            className="mt-4 px-6 py-2 bg-white text-primary rounded-xl font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Awesome!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

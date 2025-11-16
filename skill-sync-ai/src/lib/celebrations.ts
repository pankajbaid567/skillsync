/**
 * Celebration System
 * Creates memorable moments with confetti, sounds, and haptic feedback
 */

import confetti from 'canvas-confetti';
import { toast } from 'sonner';

type CelebrationType = 
  | 'match'           // Found a perfect match
  | 'swap_created'    // Swap request sent
  | 'swap_accepted'   // Your swap was accepted
  | 'swap_completed'  // Completed a skill swap
  | 'review_received' // Got a 5-star review
  | 'level_up'        // Leveled up
  | 'streak'          // Hit a streak milestone
  | 'achievement'     // Unlocked achievement
  | 'first_swap'      // First ever swap
  | 'milestone';      // Hit a milestone (10, 50, 100 swaps)

interface CelebrationConfig {
  confetti?: boolean;
  sound?: boolean;
  haptic?: boolean;
  toast?: boolean;
  message?: string;
  icon?: string;
}

// Sound management
const sounds = {
  celebrate: '/sounds/celebrate.mp3',
  levelUp: '/sounds/level-up.mp3',
  achievement: '/sounds/achievement.mp3',
  match: '/sounds/match.mp3',
};

let soundEnabled = true;
let hapticEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  localStorage.setItem('skillsync_sound_enabled', String(enabled));
};

export const setHapticEnabled = (enabled: boolean) => {
  hapticEnabled = enabled;
  localStorage.setItem('skillsync_haptic_enabled', String(enabled));
};

// Initialize from localStorage
if (typeof window !== 'undefined') {
  soundEnabled = localStorage.getItem('skillsync_sound_enabled') !== 'false';
  hapticEnabled = localStorage.getItem('skillsync_haptic_enabled') !== 'false';
}

// Play sound effect
const playSound = (type: keyof typeof sounds) => {
  if (!soundEnabled) return;
  
  try {
    const audio = new Audio(sounds[type] || sounds.celebrate);
    audio.volume = 0.3;
    audio.play().catch(err => console.log('Sound play failed:', err));
  } catch (err) {
    console.log('Sound error:', err);
  }
};

// Trigger haptic feedback
const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy' = 'medium') => {
  if (!hapticEnabled || !('vibrate' in navigator)) return;
  
  const patterns = {
    light: [50],
    medium: [100, 50, 100],
    heavy: [200, 100, 200],
  };
  
  navigator.vibrate(patterns[pattern]);
};

// Confetti patterns
const confettiPatterns = {
  default: () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
    });
  },
  
  fireworks: () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#3B82F6', '#10B981', '#8B5CF6'],
      });
    }, 250);
  },
  
  rain: () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0 },
        colors: ['#3B82F6', '#10B981', '#8B5CF6'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0 },
        colors: ['#3B82F6', '#10B981', '#8B5CF6'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  },
  
  burst: () => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.5 },
      colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
      ticks: 200,
      gravity: 0.8,
      decay: 0.9,
      startVelocity: 45,
    });
  },
  
  stars: () => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
    };

    confetti({
      ...defaults,
      particleCount: 50,
      scalar: 1.2,
      shapes: ['star'],
      colors: ['#FFD700', '#FFA500', '#FFE135'],
    });

    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 2,
      shapes: ['circle'],
      colors: ['#3B82F6', '#8B5CF6'],
    });
  },
  
  hearts: () => {
    // Hearts confetti with circles (heart shape not available in canvas-confetti by default)
    confetti({
      particleCount: 50,
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: ['circle'],
      colors: ['#EF4444', '#F43F5E', '#FB7185'],
      scalar: 2,
    });

    confetti({
      particleCount: 25,
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: ['circle'],
      colors: ['#EF4444', '#F43F5E', '#FB7185'],
      scalar: 3,
    });
  },
};

// Celebration messages
const celebrationMessages = {
  match: {
    message: "🎉 You've got a match!",
    description: "Someone perfect just appeared!",
    icon: '🤝',
  },
  swap_created: {
    message: "📨 Swap request sent!",
    description: "They'll be excited to hear from you!",
    icon: '🚀',
  },
  swap_accepted: {
    message: "🎊 Swap accepted!",
    description: "Your learning journey begins!",
    icon: '✅',
  },
  swap_completed: {
    message: "🏆 Swap completed!",
    description: "You're growing every day!",
    icon: '⭐',
  },
  review_received: {
    message: "⭐ 5-star review!",
    description: "You're making a real impact!",
    icon: '🌟',
  },
  level_up: {
    message: "🎮 Level Up!",
    description: "You're becoming a master!",
    icon: '🆙',
  },
  streak: {
    message: "🔥 Streak milestone!",
    description: "Your dedication is inspiring!",
    icon: '💪',
  },
  achievement: {
    message: "🏅 Achievement unlocked!",
    description: "You're on fire!",
    icon: '🎯',
  },
  first_swap: {
    message: "🎓 First swap completed!",
    description: "This is just the beginning!",
    icon: '🌟',
  },
  milestone: {
    message: "💎 Milestone reached!",
    description: "You're truly exceptional!",
    icon: '🏆',
  },
};

// Main celebration function
export const celebrate = (
  type: CelebrationType,
  config: CelebrationConfig = {}
) => {
  const {
    confetti: showConfetti = true,
    sound: playAudio = true,
    haptic: useHaptic = true,
    toast: showToast = true,
    message: customMessage,
    icon: customIcon,
  } = config;

  const celebrationData = celebrationMessages[type];

  // Confetti based on type
  if (showConfetti) {
    switch (type) {
      case 'match':
        confettiPatterns.hearts();
        break;
      case 'swap_completed':
      case 'first_swap':
        confettiPatterns.fireworks();
        break;
      case 'level_up':
        confettiPatterns.burst();
        break;
      case 'review_received':
        confettiPatterns.stars();
        break;
      case 'streak':
      case 'milestone':
        confettiPatterns.rain();
        break;
      default:
        confettiPatterns.default();
    }
  }

  // Sound based on type
  if (playAudio) {
    switch (type) {
      case 'level_up':
        playSound('levelUp');
        break;
      case 'match':
        playSound('match');
        break;
      case 'achievement':
      case 'milestone':
      case 'streak':
        playSound('achievement');
        break;
      default:
        playSound('celebrate');
    }
  }

  // Haptic feedback
  if (useHaptic) {
    const hapticType = 
      type === 'level_up' || type === 'milestone' ? 'heavy' :
      type === 'match' || type === 'swap_accepted' ? 'medium' :
      'light';
    
    triggerHaptic(hapticType);
  }

  // Toast notification
  if (showToast) {
    toast.success(customMessage || celebrationData.message, {
      description: celebrationData.description,
      icon: customIcon || celebrationData.icon,
      duration: 5000,
      className: 'celebration-toast',
    });
  }
};

// Quick celebration helpers
export const quickCelebrate = {
  match: () => celebrate('match'),
  swapCreated: () => celebrate('swap_created'),
  swapAccepted: () => celebrate('swap_accepted'),
  swapCompleted: () => celebrate('swap_completed'),
  reviewReceived: () => celebrate('review_received'),
  levelUp: (level: number) => celebrate('level_up', { 
    message: `🎮 Level ${level} reached!`,
  }),
  streak: (days: number) => celebrate('streak', { 
    message: `🔥 ${days} day streak!`,
  }),
  achievement: (name: string) => celebrate('achievement', { 
    message: `🏅 ${name}`,
  }),
  firstSwap: () => celebrate('first_swap'),
  milestone: (count: number) => celebrate('milestone', { 
    message: `💎 ${count} swaps completed!`,
  }),
};

// Export settings getters
export const isSoundEnabled = () => soundEnabled;
export const isHapticEnabled = () => hapticEnabled;

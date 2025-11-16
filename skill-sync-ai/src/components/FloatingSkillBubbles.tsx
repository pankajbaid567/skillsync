/**
 * Floating Skill Bubbles Component
 * Interactive skill tags that float with physics-based movement
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Skill {
  id: number;
  name: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

const skillsList = [
  'React', 'Python', 'TypeScript', 'Node.js', 'AI/ML',
  'Design', 'Marketing', 'Photography', 'Writing', 'Music',
  'Cooking', 'Yoga', 'Guitar', 'Spanish', 'Drawing',
  'Video Editing', 'Public Speaking', 'Chess', 'Dancing', 'Coding'
];

// Soft, pastel colors for realistic bubble effect
const colors = [
  'from-blue-100/30 via-blue-200/20 to-transparent',
  'from-purple-100/30 via-purple-200/20 to-transparent',
  'from-pink-100/30 via-pink-200/20 to-transparent',
  'from-orange-100/30 via-orange-200/20 to-transparent',
  'from-green-100/30 via-green-200/20 to-transparent',
  'from-cyan-100/30 via-cyan-200/20 to-transparent',
  'from-indigo-100/30 via-indigo-200/20 to-transparent',
  'from-rose-100/30 via-rose-200/20 to-transparent',
];

interface FloatingSkillBubblesProps {
  skills?: string[];
}

export const FloatingSkillBubbles = ({ skills: providedSkills }: FloatingSkillBubblesProps = {}) => {
  const skillsList = providedSkills || [
    'React', 'Python', 'TypeScript', 'Node.js', 'AI/ML',
    'Design', 'Marketing', 'Photography', 'Writing', 'Music',
    'Cooking', 'Yoga', 'Guitar', 'Spanish', 'Drawing',
    'Video Editing', 'Public Speaking', 'Chess', 'Dancing', 'Coding'
  ];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Initialize skills with positions that avoid the center (text area)
    // Bubbles will spawn in edges and corners only
    const initialSkills = skillsList.map((skill, index) => {
      let x, y;
      
      // Define safe zones (edges and corners, avoiding center)
      const zone = Math.floor(Math.random() * 4);
      
      switch(zone) {
        case 0: // Top edge
          x = 10 + Math.random() * 80;
          y = 5 + Math.random() * 20;
          break;
        case 1: // Bottom edge
          x = 10 + Math.random() * 80;
          y = 75 + Math.random() * 20;
          break;
        case 2: // Left edge
          x = 0 + Math.random() * 20;
          y = 10 + Math.random() * 80;
          break;
        case 3: // Right edge
          x = 80 + Math.random() * 20;
          y = 10 + Math.random() * 80;
          break;
        default:
          x = 5;
          y = 5;
      }
      
      return {
        id: index,
        name: skill,
        x,
        y,
        size: 60 + Math.random() * 80,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
    setSkills(initialSkills);
  }, [skillsList]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {skills.map((skill, index) => {
        // Calculate constrained movement based on initial position
        // Keep bubbles in their zones (edges/corners)
        const isTopZone = skill.y < 30;
        const isBottomZone = skill.y > 70;
        const isLeftZone = skill.x < 25;
        const isRightZone = skill.x > 75;
        
        // Small movement ranges to keep bubbles in their zones
        const xRange = isLeftZone || isRightZone ? 10 : 15;
        const yRange = isTopZone || isBottomZone ? 10 : 15;
        
        return (
          <motion.div
            key={skill.id}
            className={`absolute cursor-pointer select-none`}
            style={{
              left: `${skill.x}%`,
              top: `${skill.y}%`,
              width: skill.size,
              height: skill.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 0.7,
              // Constrained movement - stay in zone
              x: [-xRange, xRange, -xRange],
              y: [-yRange, yRange, -yRange],
            }}
            transition={{
              scale: { delay: index * 0.1, duration: 0.5 },
              x: { 
                duration: 6 + Math.random() * 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatType: "mirror",
              },
              y: { 
                duration: 5 + Math.random() * 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: Math.random() * 2,
                repeatType: "mirror",
              },
            }}
            whileHover={{ 
              scale: 1.2, 
              opacity: 0.9,
              zIndex: 50,
              transition: { duration: 0.2 }
            }}
          >
            {/* Main bubble with realistic gradient */}
            <div className={`
              relative w-full h-full rounded-full 
              bg-gradient-to-br ${skill.color}
              backdrop-blur-md
              border border-white/40
              overflow-hidden
              shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]
              transition-all duration-300
            `}>
              {/* Shine effect on top-left */}
              <div className="absolute top-[15%] left-[20%] w-[40%] h-[40%] rounded-full bg-white/40 blur-xl" />
              
              {/* Secondary shine */}
              <div className="absolute top-[10%] left-[15%] w-[25%] h-[25%] rounded-full bg-white/60 blur-md" />
              
              {/* Bottom shadow/depth */}
              <div className="absolute bottom-[10%] right-[15%] w-[35%] h-[35%] rounded-full bg-black/5 blur-lg" />
              
              {/* Text container with better contrast */}
              <div className="relative w-full h-full flex items-center justify-center">
                <span className="px-2 text-center text-xs md:text-sm font-semibold text-gray-700/90 drop-shadow-sm">
                  {skill.name}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {/* Glowing cursor follower - softer glow */}
      <motion.div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.08) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

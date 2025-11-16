/**
 * Animated Section Divider Component
 * SVG wave/curve dividers with morphing animations
 */

import { motion } from 'framer-motion';

type DividerVariant = 'wave' | 'curve' | 'diagonal' | 'zigzag';
type DividerPosition = 'top' | 'bottom';

interface SectionDividerProps {
  variant?: DividerVariant;
  position?: DividerPosition;
  className?: string;
  animate?: boolean;
}

export const SectionDivider = ({
  variant = 'wave',
  position = 'bottom',
  className = '',
  animate = true,
}: SectionDividerProps) => {
  const paths = {
    wave: 'M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
    curve: 'M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
    diagonal: 'M0,0L1440,160L1440,320L0,320Z',
    zigzag: 'M0,96L80,112L160,96L240,112L320,96L400,112L480,96L560,112L640,96L720,112L800,96L880,112L960,96L1040,112L1120,96L1200,112L1280,96L1360,112L1440,96L1440,320L0,320Z',
  };

  const svgClasses = position === 'top' 
    ? 'absolute top-0 left-0 w-full rotate-180' 
    : 'absolute bottom-0 left-0 w-full';

  return (
    <div className={`pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 320"
        className={svgClasses}
        preserveAspectRatio="none"
      >
        <motion.path
          d={paths[variant]}
          fill="currentColor"
          opacity="0.1"
          animate={
            animate
              ? {
                  d: [
                    paths[variant],
                    variant === 'wave'
                      ? 'M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
                      : paths[variant],
                    paths[variant],
                  ],
                }
              : undefined
          }
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d={paths[variant]}
          fill="currentColor"
          opacity="0.05"
          animate={
            animate
              ? {
                  d: [
                    paths[variant],
                    variant === 'wave'
                      ? 'M0,96L48,101.3C96,107,192,117,288,122.7C384,128,480,128,576,117.3C672,107,768,85,864,90.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
                      : paths[variant],
                    paths[variant],
                  ],
                }
              : undefined
          }
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </svg>
    </div>
  );
};

// Preset dividers for common use cases
export const WaveDivider = ({ position = 'bottom' }: { position?: DividerPosition }) => (
  <SectionDivider variant="wave" position={position} />
);

export const CurveDivider = ({ position = 'bottom' }: { position?: DividerPosition }) => (
  <SectionDivider variant="curve" position={position} />
);

export const DiagonalDivider = ({ position = 'bottom' }: { position?: DividerPosition }) => (
  <SectionDivider variant="diagonal" position={position} animate={false} />
);

export const ZigzagDivider = ({ position = 'bottom' }: { position?: DividerPosition }) => (
  <SectionDivider variant="zigzag" position={position} />
);

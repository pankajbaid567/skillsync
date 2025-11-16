/**
 * Morphing Navigation
 * Adaptive navigation that changes based on scroll and context
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { Home, Search, Users, MessageSquare, User, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Discover', path: '/discover' },
  { icon: Users, label: 'Matches', path: '/matches' },
  { icon: MessageSquare, label: 'Chat', path: '/chat' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const MorphingNav = () => {
  const { scrollY } = useScroll();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  // Transform properties based on scroll
  const navHeight = useTransform(scrollY, [0, 100], [80, 60]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.8]);
  const navOpacity = useTransform(scrollY, [0, 50], [0.95, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [8, 16]);

  useEffect(() => {
    const index = navItems.findIndex((item) => item.path === location.pathname);
    setActiveIndex(index >= 0 ? index : 0);
  }, [location.pathname]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-4 py-3"
      style={{
        height: navHeight,
      }}
    >
      <motion.div
        className="max-w-7xl mx-auto h-full rounded-2xl border border-white/20 shadow-2xl"
        style={{
          opacity: navOpacity,
          backdropFilter: useTransform(navBlur, (blur) => `blur(${blur}px)`),
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(219, 39, 119, 0.1))',
        }}
      >
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            style={{ scale: logoScale }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                SS
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkillSync
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 backdrop-blur-sm">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.button
                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    onHoverStart={() => setActiveIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}

                    <span className="relative flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      <span className={isActive ? 'text-white' : 'text-gray-600'}>
                        {item.label}
                      </span>
                    </span>

                    {/* Sparkle on hover */}
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: [0, 1, 0], rotate: 180 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                      </motion.div>
                    )}
                  </motion.button>
                </Link>
              );
            })}
          </div>

          {/* Profile Avatar */}
          <motion.button
            className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 2, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </motion.div>
    </motion.nav>
  );
};

// Mobile Bottom Navigation
export const MobileBottomNav = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = navItems.findIndex((item) => item.path === location.pathname);
    setActiveIndex(index >= 0 ? index : 0);
  }, [location.pathname]);

  return (
    <motion.nav
      className="fixed bottom-4 left-4 right-4 md:hidden z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-2">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;

            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <motion.button
                  className="relative w-full py-3 flex flex-col items-center gap-1"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl"
                      layoutId="mobileActiveNav"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  <motion.div
                    animate={isActive ? { y: -2 } : { y: 0 }}
                    className="relative"
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    
                    {/* Notification dot */}
                    {item.label === 'Chat' && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  <span className={`text-xs relative ${isActive ? 'text-white font-semibold' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

/**
 * Advanced Skeleton Loaders
 * Production-ready skeleton screens for all page types
 */

import { motion, type Transition } from 'framer-motion';

const shimmer = {
  opacity: [0.5, 1, 0.5],
};

const shimmerTransition: Transition = {
  duration: 1.5,
  repeat: Infinity,
  ease: 'easeInOut',
};

// User Card Skeleton
export const UserCardSkeleton = () => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 space-y-4">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-full bg-white/20"
          animate={shimmer}
          transition={shimmerTransition}
        />
        <div className="flex-1 space-y-2">
          <motion.div
            className="h-5 bg-white/20 rounded w-3/4"
            animate={shimmer}
            transition={{ ...shimmerTransition, delay: 0.1 }}
          />
          <motion.div
            className="h-4 bg-white/20 rounded w-1/2"
            animate={shimmer}
            transition={{ ...shimmerTransition, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-6 bg-white/20 rounded-full px-3 w-20"
            animate={shimmer}
            transition={{ ...shimmerTransition, delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <motion.div
          className="h-4 bg-white/20 rounded w-full"
          animate={shimmer}
          transition={{ ...shimmerTransition, delay: 0.3 }}
        />
        <motion.div
          className="h-4 bg-white/20 rounded w-5/6"
          animate={shimmer}
          transition={{ ...shimmerTransition, delay: 0.4 }}
        />
      </div>

      {/* Action Button */}
      <motion.div
        className="h-10 bg-white/20 rounded-lg w-full"
        animate={shimmer}
        transition={{ ...shimmerTransition, delay: 0.5 }}
      />
    </div>
  );
};

// Grid of User Cards
export const UserGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Chat Message Skeleton
export const ChatMessageSkeleton = () => {
  return (
    <div className="flex gap-3 p-4">
      <motion.div
        className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0"
        animate={shimmer}
        transition={shimmerTransition}
      />
      <div className="flex-1 space-y-2">
        <motion.div
          className="h-4 bg-white/20 rounded w-1/4"
          animate={shimmer}
          transition={{ ...shimmerTransition, delay: 0.1 }}
        />
        <motion.div
          className="h-16 bg-white/20 rounded-lg w-full"
          animate={shimmer}
          transition={{ ...shimmerTransition, delay: 0.2 }}
        />
      </div>
    </div>
  );
};

// Chat List Skeleton
export const ChatListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ChatMessageSkeleton key={i} />
      ))}
    </div>
  );
};

// Profile Page Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <motion.div
            className="w-32 h-32 rounded-full bg-white/20"
            animate={shimmer}
            transition={shimmerTransition}
          />
          <div className="flex-1 space-y-4 w-full">
            <motion.div
              className="h-8 bg-white/20 rounded w-1/3"
              animate={shimmer}
              transition={{ ...shimmerTransition, delay: 0.1 }}
            />
            <motion.div
              className="h-5 bg-white/20 rounded w-1/2"
              animate={shimmer}
              transition={{ ...shimmerTransition, delay: 0.2 }}
            />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-10 bg-white/20 rounded-lg w-24"
                  animate={shimmer}
                  transition={{ ...shimmerTransition, delay: 0.3 + i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((section) => (
          <div
            key={section}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 space-y-4"
          >
            <motion.div
              className="h-6 bg-white/20 rounded w-1/3"
              animate={shimmer}
              transition={{ ...shimmerTransition, delay: 0.1 }}
            />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="h-4 bg-white/20 rounded w-full"
                  animate={shimmer}
                  transition={{ ...shimmerTransition, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/10">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="h-4 bg-white/20 rounded flex-1"
          animate={shimmer}
          transition={{ ...shimmerTransition, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white/5 border-b border-white/10">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-5 bg-white/30 rounded flex-1"
            animate={shimmer}
            transition={shimmerTransition}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
};

// Generic Page Skeleton
export const PageSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        className="h-10 bg-white/20 rounded w-1/4"
        animate={shimmer}
        transition={shimmerTransition}
      />
      
      {/* Stats Bar */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 space-y-2"
          >
            <motion.div
              className="h-8 bg-white/20 rounded w-1/2"
              animate={shimmer}
              transition={{ ...shimmerTransition, delay: i * 0.1 }}
            />
            <motion.div
              className="h-4 bg-white/20 rounded w-3/4"
              animate={shimmer}
              transition={{ ...shimmerTransition, delay: 0.3 + i * 0.1 }}
            />
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="h-4 bg-white/20 rounded w-full"
            animate={shimmer}
            transition={{ ...shimmerTransition, delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

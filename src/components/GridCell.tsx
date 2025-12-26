'use client';

import { motion } from 'framer-motion';

interface GridCellProps {
  content: string;
  isCenter?: boolean;
  opacityLevel?: number;
  onClick?: () => void;
}

export function GridCell({
  content,
  isCenter = false,
  opacityLevel = 1,
  onClick,
}: GridCellProps) {
  return (
    <motion.div
      whileHover={{ scale: isCenter ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        aspect-square flex items-center justify-center p-2 text-center text-sm cursor-pointer transition-all
        ${isCenter ? 'bg-black text-white font-medium' : `grid-bg-${opacityLevel} hover:shadow-md`}
      `}
    >
      <span className="line-clamp-3">{content}</span>
    </motion.div>
  );
}

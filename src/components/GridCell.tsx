'use client';

import { motion } from 'framer-motion';

interface GridCellProps {
  content: string;
  isCenter?: boolean;
  onClick?: () => void;
}

export function GridCell({
  content,
  isCenter = false,
  onClick,
}: GridCellProps) {
  return (
    <motion.div
      whileHover={{ scale: isCenter ? 1 : 1.02, backgroundColor: isCenter ? undefined : 'rgba(0,0,0,0.04)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        aspect-square flex items-center justify-center p-1 md:p-1.5 text-center cursor-pointer transition-all
        ${isCenter ? 'bg-black text-white font-medium' : 'bg-white hover:shadow-sm text-black/80'}
      `}
    >
      <span className="line-clamp-3 text-[5px] md:text-[7px] leading-tight font-normal">{content}</span>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { SubGrid as SubGridType } from '@/types/mandalart';
import { GridCell } from './GridCell';

interface SubGridProps {
  data: SubGridType;
  isActive: boolean;
  onActivate: () => void;
}

export function SubGrid({ data, isActive, onActivate }: SubGridProps) {
  return (
    <motion.div
      layout
      whileHover={{ scale: isActive ? 1 : 1.01 }}
      onClick={onActivate}
      className={`
        aspect-square grid grid-cols-3 gap-[1px] p-[2px] cursor-pointer transition-all duration-300 rounded-sm overflow-hidden
        bg-white border
        ${isActive
          ? 'border-[#E53935] ring-2 ring-[#E53935]/20 shadow-xl'
          : 'border-black/8 hover:border-black/20 hover:shadow-lg'
        }
      `}
    >
      {/* Position 0-3: top row and first cell of middle row */}
      {data.actions.slice(0, 4).map((action, index) => (
        <GridCell
          key={index}
          content={action}
        />
      ))}

      {/* Position 4: Center cell (title) - white bg + red border (medium hierarchy) */}
      <div className="aspect-square flex items-center justify-center p-1 md:p-1.5 text-center bg-white border-2 border-[#E53935]">
        <span className="text-[7px] md:text-[10px] font-bold leading-tight line-clamp-2 text-black">
          {data.title}
        </span>
      </div>

      {/* Position 5-7: rest of middle row and bottom row */}
      {data.actions.slice(4, 8).map((action, index) => (
        <GridCell
          key={index + 4}
          content={action}
        />
      ))}
    </motion.div>
  );
}

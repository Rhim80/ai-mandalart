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
        ${isActive
          ? 'ring-2 ring-black ring-offset-1 shadow-xl'
          : 'hover:shadow-lg'
        }
        grid-bg-${data.opacityLevel}
      `}
    >
      {/* Position 0-3: top row and first cell of middle row */}
      {data.actions.slice(0, 4).map((action, index) => (
        <GridCell
          key={index}
          content={action}
          opacityLevel={data.opacityLevel}
        />
      ))}

      {/* Position 4: Center cell (title) */}
      <div className="aspect-square flex items-center justify-center p-1.5 md:p-2 bg-black/[0.06] text-center group relative overflow-hidden">
        <span className="text-[8px] md:text-xs font-medium leading-tight line-clamp-2 relative z-10">
          {data.title}
        </span>
      </div>

      {/* Position 5-7: rest of middle row and bottom row */}
      {data.actions.slice(4, 8).map((action, index) => (
        <GridCell
          key={index + 4}
          content={action}
          opacityLevel={data.opacityLevel}
        />
      ))}
    </motion.div>
  );
}

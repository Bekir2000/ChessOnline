import { ReactNode } from 'react';
import clsx from 'clsx';

interface SquareProps {
  children?: ReactNode;
  isLight: boolean;
  isSelected?: boolean;
  isValidMove?: boolean;
  position: string;
  lightSquareColor?: string;
  darkSquareColor?: string;
  index: number;
  onDragStart?: () => boolean;
  onDragEnd?: () => void;
}

export default function Square({
  children,
  isLight,
  isSelected = false,
  position,
  lightSquareColor = 'var(--light-square)',
  darkSquareColor = 'var(--dark-square)',
  index,
  onDragStart,
  onDragEnd,
  isValidMove = false
}: SquareProps) {
  const style = {
    backgroundColor: isLight ? lightSquareColor : darkSquareColor,
    aspectRatio: '1/1'
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart && onDragStart()) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', position);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isValidMove) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isValidMove && onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <div
      style={style}
      draggable={!!onDragStart}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={clsx(
        'w-full h-full flex items-center justify-center text-xl font-bold cursor-pointer relative',
        isSelected && 'border-2 border-yellow-400',
        isValidMove && 'after:absolute after:inset-0 after:bg-green-500 after:opacity-30',
        index === 0 && 'rounded-tl-[12px]',
        index === 7 && 'rounded-tr-[12px]',
        index === 56 && 'rounded-bl-[12px]',
        index === 63 && 'rounded-br-[12px]'
      )}
    >
      {children}
    </div>
  );
}
import { ReactNode } from 'react';
import clsx from 'clsx';

interface SquareProps {
  children?: ReactNode;
  isLight: boolean;
  isSelected?: boolean;
  position: string;
  lightSquareColor?: string;
  darkSquareColor?: string;
  index: number;
}

export default function Square({
  children,
  isLight,
  isSelected = false,
  position,
  lightSquareColor = 'var(--light-square)',
  darkSquareColor = 'var(--dark-square)',
  index
}: SquareProps) {
  const style = {
    backgroundColor: isLight ? lightSquareColor : darkSquareColor,
    aspectRatio: '1/1'
  };

  return (
    <div
      style={style}
      className={clsx(
        'w-full h-full flex items-center justify-center text-xl font-bold cursor-pointer relative',
        isSelected && 'border-2 border-yellow-400',
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
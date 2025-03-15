'use client';

import { useState } from 'react';

interface Square {
  row: number;
  col: number;
  piece?: string;
  color: 'white' | 'black';
}

export default function Chessboard() {
  const [squares, setSquares] = useState<Square[][]>(() => {
    const board: Square[][] = [];
    for (let row = 0; row < 8; row++) {
      const currentRow: Square[] = [];
      for (let col = 0; col < 8; col++) {
        currentRow.push({
          row,
          col,
          color: (row + col) % 2 === 0 ? 'white' : 'black'
        });
      }
      board.push(currentRow);
    }
    return board;
  });

  return (
    <div className="w-full h-full p-4">
      <div className="aspect-square w-full max-w-2xl mx-auto grid grid-cols-8 grid-rows-8 border-2 border-gray-600 rounded-lg overflow-hidden">
        {squares.map((row, rowIndex) =>
          row.map((square, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-full h-full flex items-center justify-center
                ${square.color === 'white' ? 'bg-[#E8EDF9]' : 'bg-[#B7C0D8]'}
                hover:opacity-90 transition-opacity cursor-pointer
              `}
            >
              {square.piece && (
                <img
                  src={`/pieces/${square.piece}.svg`}
                  alt={square.piece}
                  className="w-4/5 h-4/5 object-contain"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
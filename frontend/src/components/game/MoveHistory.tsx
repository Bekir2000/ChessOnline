'use client';

import { addPieceSymbolToMove } from '@/utils/chessNotation';

interface MoveHistoryProps {
  moves?: string[];
  onMoveClick?: (index: number) => void;
  selectedMoveIndex?: number;
  isReviewMode?: boolean;
}

interface MoveItemProps {
  move: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

function MoveItem({ move, index, isSelected, onClick }: MoveItemProps) {
  const { imagePath, move: moveText } = addPieceSymbolToMove(move);
  const moveNumber = index % 2 === 0 ? `${Math.floor(index/2) + 1}.` : '';

  return (
    <div 
      className={`text-sm p-2 ${isSelected ? 'bg-blue-600' : 'bg-gray-700'} rounded cursor-pointer hover:bg-gray-600 transition-colors`}
      onClick={onClick}
    >
      {moveNumber}
      <img src={imagePath} alt="piece" className="w-5 h-5 inline-block align-middle mr-1" />
      {moveText}
    </div>
  );
}

export default function MoveHistory({ moves = [], onMoveClick, selectedMoveIndex = -1, isReviewMode = false }: MoveHistoryProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Move History</h2>
      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {moves.length === 0 ? (
          <div className="text-sm text-gray-400">No moves yet</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {moves.map((move, index) => (
              <MoveItem
                key={index}
                move={move}
                index={index}
                isSelected={selectedMoveIndex === index}
                onClick={() => isReviewMode && onMoveClick?.(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
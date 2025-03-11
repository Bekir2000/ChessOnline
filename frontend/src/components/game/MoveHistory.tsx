'use client';

interface MoveHistoryProps {
  moves?: string[];
}

export default function MoveHistory({ moves = [] }: MoveHistoryProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Move History</h2>
      <div className="space-y-2">
        {moves.length === 0 ? (
          <div className="text-sm text-gray-400">
            No moves yet
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {moves.map((move, index) => (
              <div 
                key={index} 
                className="text-sm p-2 bg-gray-700 rounded"
              >
                {index % 2 === 0 ? `${Math.floor(index/2) + 1}.` : ''} {move}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import CountDown from './CountDown';

interface GameControlsProps {
  onResign?: () => void;
  onDrawOffer?: () => void;
  timeControl?: number;
  onTimeUp?: () => void;
}

export default function GameControls({ 
  onResign, 
  onDrawOffer, 
  timeControl = 10 * 60,
  onTimeUp
}: GameControlsProps) {
  return (
    <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-semibold">Game Controls</h2>
          <div className="flex gap-2 sm:gap-4">
            <button 
              onClick={onResign}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Resign
            </button>
            <button 
              onClick={onDrawOffer}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition text-sm sm:text-base"
            >
              Offer Draw
            </button>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <div className="text-xs sm:text-sm text-gray-400">Time Control</div>
          <CountDown initialTime={timeControl} onTimeUp={onTimeUp} />
        </div>
      </div>
    </div>
  );
}
'use client';

import Confetti from "@/components/game/Confetti";

interface GameOverModalProps {
  winner: string;
  reason?: string;
  onPlayAgain: () => void;
  onViewGame: () => void;
}

export default function GameOverModal({ winner, reason, onPlayAgain, onViewGame }: GameOverModalProps) {
  return (
    <>
      <Confetti isActive={true} />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-xl text-center shadow-2xl transform transition-all duration-300 hover:scale-105">
          <h2 className="text-4xl font-bold mb-4 text-white animate-bounce">
            {winner === 'draw' ? "It's a Draw!" : `${winner} Triumphs!`}
          </h2>
          {reason && (
            <p className="text-xl text-white/90 italic mb-6">
              {reason === 'checkmate' ? '🏆 Checkmate!' :
                reason === 'timeout' ? '⏰ Time\'s Up!' :
                reason === 'resignation' ? '👋 By Resignation' :
                reason === 'agreement' ? '🤝 By Agreement' :
                reason || 'Unknown Reason'}
            </p>
          )}
          <div className="space-x-4">
            <button
              onClick={onViewGame}
              className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition-colors duration-300"
            >
              View Game
            </button>
            <button
              onClick={onPlayAgain}
              className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition-colors duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
import { Metadata } from "next";
import Chessboard from "@/components/Chessboard/ChessBoard";
import GameControls from "@/components/game/GameControls";
import MoveHistory from "@/components/game/MoveHistory";

export const metadata: Metadata = {
  title: "Chess Online - Game",
  description: "Play chess online with friends or against the computer",
};

export default function GamePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Chessboard container - controls the size */}
        <div className="w-full lg:w-[800px] aspect-square">
          <Chessboard />
        </div>

        {/* Game info and controls */}
        <div className="flex-1 space-y-8">
          <GameControls />
          <MoveHistory />
        </div>
      </div>
    </main>
  );
}
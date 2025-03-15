import { Metadata } from "next";
import { Suspense } from "react";
import Chessboard from "@/components/Chessboard/ChessBoard";
import GameControls from "@/components/game/GameControls";
import MoveHistory from "@/components/game/MoveHistory";
import PlayerInfo from "@/components/game/PlayerInfo";
import Game from "@/components/game/Game";

export const metadata: Metadata = {
  title: "Chess Online - Game",
  description: "Play chess online with friends or against the computer",
};

export default async function GamePage() {
  //await new Promise((resolve) => setTimeout(resolve, 5000));
  return (
    <main className="container mx-auto px-4 py-8">
      <Game />
    </main>
  );
}
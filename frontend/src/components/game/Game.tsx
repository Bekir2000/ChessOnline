"use client";

import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { io, Socket } from "socket.io-client";
import Chessboard from "@/components/Chessboard/ChessBoard";
import GameControls from "@/components/game/GameControls";
import MoveHistory from "@/components/game/MoveHistory";
import PlayerInfo from "@/components/game/PlayerInfo";
import Loading from "@/app/game/loading";

export default function Game() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [game, setGame] = useState(new Chess());
  const [countdown, setCountdown] = useState(10 * 60);
  const [moves, setMoves] = useState<string[]>([]);
  const [gameState, setGameState] = useState<{
    gameId?: string;
    color?: "white" | "black";
    opponent?: {
      name: string;
      imageUrl?: string;
    };
    winner?: string;
    reason?: string;
  }>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("joinQueue", "Player " + Math.floor(Math.random() * 1000));
    });

    socket.on("gameStart", (data) => {
      setGameState(data);
      setIsReady(true);
      setCountdown(10 * 60); // Reset countdown when game starts
    });

  
    socket.on("moveMade", ({ from, to, fen }) => {
      console.log("Move Made:", from, to, fen);
      const newGame = new Chess(fen);
      setGame(newGame);
      setMoves(prev => [...prev, `${from}-${to}`]);
    });

    socket.on("gameOver", (result) => {
      setGameState(prev => ({ ...prev, winner: result.winner, reason: result.reason }));
    });

    // Cleanup when unmounting
    return () => {
      socket.close();
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!isReady || gameState.winner) return;

    const isMyTurn = (
      (gameState.color === "white" && game.turn() === 'w') ||
      (gameState.color === "black" && game.turn() === 'b')
    );

    let timer: NodeJS.Timeout;
    if (isMyTurn && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Time's up
            if (socket && gameState.gameId) {
              socket.emit('timeOut', { gameId: gameState.gameId });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isReady, gameState.color, game.turn(), countdown, socket, gameState.gameId, gameState.winner]);

  if (!isReady) {
    return <Loading />;
  }

  const isWhiteTurn = game.turn() === 'w';
  const isBlackTurn = game.turn() === 'b';


 
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Chessboard container - controls the size */}
      <div className="w-full lg:w-[800px] aspect-square">
        {socket && <Chessboard game={game} socket={socket} gameState={gameState} />}
      </div>

      {/* Game info and controls */}
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <PlayerInfo name={gameState.opponent?.name ?? "Player 1"} color="white" isActive={isWhiteTurn} />
          <PlayerInfo name="Player 2" color="black" isActive={isBlackTurn}/>
        </div>
        <GameControls
          onResign={() => {
            if (socket && gameState.gameId) {
              socket.emit('resign', { gameId: gameState.gameId });
            }
          }}
          onDrawOffer={() => {
            if (socket && gameState.gameId) {
              socket.emit('offerDraw', { gameId: gameState.gameId });
            }
            
          }}
          timeControl={countdown}
        />
        {gameState.winner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-4">{gameState.winner} wins!</h2>
              <p className="text-gray-300 mb-6">Game ended by {gameState.reason}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
        <MoveHistory moves={moves} />
      </div>
    </div>
  );
}

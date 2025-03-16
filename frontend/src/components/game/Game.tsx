"use client";

import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { io, Socket } from "socket.io-client";
import Chessboard from "@/components/Chessboard/ChessBoard";
import GameControls from "@/components/game/GameControls";
import MoveHistory from "@/components/game/MoveHistory";
import PlayerInfo from "@/components/game/PlayerInfo";
import Loading from "@/app/game/loading";
import GameOverModal from "@/components/game/GameOverModal";

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
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [gameHistory, setGameHistory] = useState<Chess[]>([new Chess()]);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(-1);

  const isWhiteTurn = game.turn() === 'w';
  const isBlackTurn = game.turn() === 'b';

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

  
    socket.on("moveMade", ({ from, to, fen, remainingTime }) => {
      console.log("Move Made:", from, to, fen);
      const newGame = new Chess(fen);
      const pieceName = newGame.get(to)?.type;
      //const pieceName = piece ? piece.type.toUpperCase() : '';
      setGame(newGame);
      setCountdown(remainingTime);
      console.log(`is white turn: ${isWhiteTurn}`);
      console.log(`piece name: ${isWhiteTurn ? pieceName?.toUpperCase() : pieceName?.toLowerCase()}`);
      setMoves(prev => [...prev, `${from}-${to}-${(newGame.get(to)?.color === 'w' ? pieceName?.toUpperCase() : pieceName?.toLowerCase())}`]);
      setGameHistory(prev => [...prev, newGame]);
    });

    socket.on("gameOver", (result) => {
      console.log("Game Over:", result);
      setGameState(prev => ({ ...prev, winner: result.winner, reason: result.reason }));
    });

    // Cleanup when unmounting
    return () => {
      socket.close();
    };
  }, []);

  const isMyTurn = (
    (gameState.color === "white" && game.turn() === 'w') ||
    (gameState.color === "black" && game.turn() === 'b')
  );

  if (!isReady) {
    return <Loading />;
  }

  


 
  const handleViewGame = () => {
    setIsReviewMode(true);
    setSelectedMoveIndex(gameHistory.length - 1);
  };

  const handleMoveClick = (index: number) => {
    setSelectedMoveIndex(index);
    setGame(new Chess(gameHistory[index].fen()));
  };

  const handlePlayAgain = () => {
    if (socket) {
      setGame(new Chess());
      setMoves([]);
      setGameState({});
      setIsReady(false);
      socket.emit('joinQueue', 'Player ' + Math.floor(Math.random() * 1000));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      {gameState.winner && !isReviewMode &&(
        <GameOverModal 
          winner={gameState.winner} 
          reason={gameState.reason} 
          onPlayAgain={handlePlayAgain}
          onViewGame={handleViewGame}
        />
      )}
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
            // handle resignation
            console.log("Resigning");
            if (socket && gameState.gameId) {
              socket.emit('resign', { gameId: gameState.gameId });
            }
          }}
          onDrawOffer={() => {
            // handle draw offer
            if (socket && gameState.gameId) {
              socket.emit('offerDraw', { gameId: gameState.gameId });
            }
            
          }}
          timeControl={countdown}
          isTimerRunning={isMyTurn && !gameState.winner}
          onTimeUp={() => {
            // handle timeout
            if (socket && gameState.gameId) {
              socket.emit('timeOut', { gameId: gameState.gameId });
            }
          }}
        />
        
        <MoveHistory 
          moves={moves} 
          onMoveClick={handleMoveClick}
          selectedMoveIndex={selectedMoveIndex}
          isReviewMode={isReviewMode}
        />
      </div>
    </div>
  );
}

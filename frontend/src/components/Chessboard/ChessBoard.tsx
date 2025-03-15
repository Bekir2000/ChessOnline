'use client'

import { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import { Chess} from 'chess.js';
import './ChessBoard.css';
import Square from './Square';
import BoardLabels from './BoardLabels';

interface DragState {
  isDragging: boolean;
  piece: string;
  startSquare: string;
  validMoves: string[];
}

// Function to get piece position from FEN
const fenToBoard = (fen: string): string[] => {
  const [position] = fen.split(' ');
  const rows = position.split('/');
  const board: string[] = [];
  
  for (const row of rows) {
    for (const char of row) {
      if (isNaN(parseInt(char))) {
        board.push(char);
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          board.push('');
        }
      }
    }
  }
  
  return board;
};

// Function to get piece image path
const getPieceImage = (piece: string): string => {
  if (!piece) return '';
  const color = piece === piece.toUpperCase() ? 'w' : 'b';
  const pieceType = piece.toLowerCase();
  return `/pieces/${color}${pieceType.toUpperCase()}.svg`;
};

interface ChessBoardProps {
  lightSquareColor?: string;
  darkSquareColor?: string;
  game: Chess;
  socket: Socket;
  gameState: any;
}

export default function Chessboard({
  lightSquareColor = 'var(--light-square)',
  darkSquareColor = 'var(--dark-square)',
  game,
  socket,
  gameState
}: ChessBoardProps) {
  const [fen, setFen] = useState(game.fen());
  const [dragState, setDragState] = useState<DragState | null>(null);
  
  // Update FEN when game changes
  useEffect(() => {
    setFen(game.fen());
  }, [game]);
  

  let board = fenToBoard(fen);
  
  // Reverse the board array if player is black
  if (gameState.color === 'black') {
    board = board.reverse();
  }

  const handleDragStart = (piece: string, position: string) => {
    if (!gameState.gameId || !socket) return false;
    const isPlayersTurn = (gameState.color === 'white' && game.turn() === 'w') ||
                         (gameState.color === 'black' && game.turn() === 'b');
    if (!isPlayersTurn) return false;

    const moves = game.moves({ square: position as any, verbose: true });
    const validMoves = moves.map(move => move.to);

    setDragState({
      isDragging: true,
      piece,
      startSquare: position,
      validMoves
    });
    return true;
  };

  const handleDragEnd = (endSquare: string) => {
    if (!dragState || !gameState.gameId || !socket) return;

    if (dragState.validMoves.includes(endSquare)) {
      socket.emit('move', {
        gameId: gameState.gameId,
        from: dragState.startSquare,
        to: endSquare
      });
    }
    setDragState(null);
  };



  return (
    <div className="flex flex-col items-center w-full h-full p-2 sm:p-4">

      <div className="flex bg-[var(--bg-color)] p-2 sm:p-4 rounded-lg">
        <BoardLabels squareSize={12.5} type="ranks" isBlack={gameState.color === 'black'} />
        <div className="flex-1 aspect-square">
          <div className="grid grid-cols-8 grid-rows-8 border-2 border-black rounded-[12px] overflow-hidden w-full h-full">
            {board.map((piece, i) => {
              let file = i % 8;
              let rank = Math.floor(i / 8);
              
              // Adjust coordinates for black's perspective
              if (gameState.color === 'black') {
                file = 7 - file;
                rank = 7 - rank;
              }
              
              const square = `${String.fromCharCode(97 + file)}${8 - rank}`;
              
              return (
                <Square
                  key={i}
                  isLight={Math.floor(i / 8) % 2 !== i % 2}
                  isSelected={dragState?.startSquare === square}
                  isValidMove={dragState?.validMoves.includes(square) || false}
                  position={square}
                  lightSquareColor={lightSquareColor}
                  darkSquareColor={darkSquareColor}
                  index={i}
                  onDragStart={() => piece ? handleDragStart(piece, square) : false}
                  onDragEnd={() => handleDragEnd(square)}
                >
                  {piece && (
                    <img 
                      src={getPieceImage(piece)} 
                      alt={piece} 
                      className="w-[85%] h-[85%] select-none"
                    />
                  )}
                </Square>
              );
            })}
          </div>
          <BoardLabels squareSize={12.5} type="files" isBlack={gameState.color === 'black'} />
        </div>
      </div>
    </div>
  );
}
  
  
  

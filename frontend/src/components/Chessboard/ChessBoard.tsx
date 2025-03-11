'use client'

import { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Chess } from 'chess.js';
import './ChessBoard.css';
import Square from './Square';
import BoardLabels from './BoardLabels';

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
}

export default function Chessboard({
  lightSquareColor = 'var(--light-square)',
  darkSquareColor = 'var(--dark-square)'
}: ChessBoardProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [gameState, setGameState] = useState<{
    gameId?: string;
    color?: 'white' | 'black';
    opponent?: string;
  }>({});
  const [isWaiting, setIsWaiting] = useState(false);
  const board = fenToBoard(fen);

  return (
    <div className="flex flex-col items-center w-full h-full p-2 sm:p-4">
      <div className="flex bg-[var(--bg-color)] p-2 sm:p-4 rounded-lg">
        {/* Rank Labels */}
        <BoardLabels squareSize={12.5} type="ranks" />
        
        {/* Chessboard with File Labels */}
        <div className="flex-1 aspect-square">
          <div className="grid grid-cols-8 grid-rows-8 border-2 border-black rounded-[12px] overflow-hidden w-full h-full">
            {board.map((piece, i) => {
              const file = i % 8;
              const rank = Math.floor(i / 8);
              const square = `${String.fromCharCode(97 + file)}${8 - rank}`;
              
              return (
                <Square
                  key={i}
                  isLight={Math.floor(i / 8) % 2 !== i % 2}
                  isSelected={selectedSquare === square}
                  position={square}
                  lightSquareColor={lightSquareColor}
                  darkSquareColor={darkSquareColor}
                  index={i}
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
          
          {/* File Labels */}
          <BoardLabels squareSize={12.5} type="files" />
        </div>
      </div>
    </div>
  );
}
  
  
  

const chessPieceSymbols = {
    K: '/pieces/wK.svg',  // White King
    Q: '/pieces/wQ.svg',  // White Queen
    R: '/pieces/wR.svg',  // White Rook
    B: '/pieces/wB.svg',  // White Bishop
    N: '/pieces/wN.svg',  // White Knight
    P: '/pieces/wP.svg',  // White Pawn
    k: '/pieces/bK.svg',  // Black King
    q: '/pieces/bQ.svg',  // Black Queen
    r: '/pieces/bR.svg',  // Black Rook
    b: '/pieces/bB.svg',  // Black Bishop
    n: '/pieces/bN.svg',  // Black Knight
    p: '/pieces/bP.svg',  // Black Pawn
  } as const;
  
  type PieceKey = keyof typeof chessPieceSymbols;
  
  export function addPieceSymbolToMove(move: string): { imagePath: string; move: string } {
    const pieceKey = move.substring(move.lastIndexOf('-') + 1) as PieceKey;
    
    // Remove the piece key from the move string
    const moveEndIndex = move.lastIndexOf('-');
    move = move.substring(0, moveEndIndex);
    const imagePath = chessPieceSymbols[pieceKey];
    return { imagePath, move };
  }
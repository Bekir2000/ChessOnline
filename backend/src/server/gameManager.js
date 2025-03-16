const { Chess } = require('chess.js');

class GameManager {
  constructor() {
    this.waitingPlayers = [];
    this.activeGames = new Map();
    this.TIME_LIMIT = 10 * 60; // 10 minutes in seconds
    this.gameTimers = new Map(); // Store interval timers for each game
  }

  addToWaitingQueue(socket, playerName) {
    if (this.waitingPlayers.length > 0) {
      const opponent = this.waitingPlayers.shift();
      const gameId = Math.random().toString(36).substring(2, 15);
      const game = new Chess();

      // Randomly assign colors
      const isWhite = Math.random() < 0.5;
      const [whitePlayer, blackPlayer] = isWhite 
        ? [{ socket, name: playerName }, { socket: opponent.socket, name: opponent.name }]
        : [{ socket: opponent.socket, name: opponent.name }, { socket, name: playerName }];

      const gameState = {
        game,
        white: whitePlayer,
        black: blackPlayer,
        timeRemaining: {
          white: this.TIME_LIMIT,
          black: this.TIME_LIMIT
        },
        lastMoveTime: Date.now(),
        drawOffers: new Set(),
        currentPlayer: 'white' // Start with white's turn
      };

      this.activeGames.set(gameId, gameState);

      // Start the game timer
      this.startGameTimer(gameId, gameState);


      // Game state is already set above

      // Notify players of game start
      whitePlayer.socket.emit('gameStart', {
        gameId,
        color: 'white',
        opponent: { name: blackPlayer.name }
      });

      blackPlayer.socket.emit('gameStart', {
        gameId,
        color: 'black',
        opponent: { name: whitePlayer.name }
      });

      return true;
    } else {
      this.waitingPlayers.push({ socket, name: playerName });
      return false;
    }
  }

  startGameTimer(gameId, gameState) {
    // Clear existing timer if any
    if (this.gameTimers.has(gameId)) {
      clearInterval(this.gameTimers.get(gameId));
    }

    // Start new timer
    this.gameTimers.set(gameId, setInterval(() => {
      const activePlayer = gameState.currentPlayer;
      gameState.timeRemaining[activePlayer] -= 1;

      if (gameState.timeRemaining[activePlayer] <= 0) {
        const timeoutResult = this.handleTimeOut(gameId, gameState[activePlayer].socket.id);
        if (timeoutResult) {
          clearInterval(this.gameTimers.get(gameId));
          this.gameTimers.delete(gameId);
        }
      }
    }, 1000));
  }

  handleMove(gameId, socket, from, to) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return false;

    const { game, white, black } = gameState;
    const isWhiteMove = game.turn() === 'w';
    const isPlayersTurn = 
      (isWhiteMove && socket.id === white.socket.id) ||
      (!isWhiteMove && socket.id === black.socket.id);

    if (!isPlayersTurn) return false;

    try {
      const move = game.move({ from, to });
      if (!move) return false;

      // Update current player and restart timer
      const currentPlayer = isWhiteMove ? 'white' : 'black';
      gameState.currentPlayer = isWhiteMove ? 'black' : 'white';
      this.startGameTimer(gameId, gameState);


      const result = {
        success: true,
        fen: game.fen(),
        isGameOver: game.isGameOver(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
        winningColor: game.isCheckmate() ? (isWhiteMove ? 'white' : 'black') : null,
        remainingTime: gameState.timeRemaining[currentPlayer]
      };

      return result;
    } catch (error) {
      return false;
    }
  }

  handleDisconnection(socketId) {
    // Remove from waiting queue if player was waiting
    this.waitingPlayers = this.waitingPlayers.filter(player => player.socket.id !== socketId);

    // Check active games for the disconnected player
    for (const [gameId, gameState] of this.activeGames) {
      if (gameState.white.socket.id === socketId || gameState.black.socket.id === socketId) {
        // Notify the remaining player
        const remainingPlayer = gameState.white.socket.id === socketId ? gameState.black : gameState.white;
        remainingPlayer.socket.emit('opponentDisconnected');

        // Remove the game
        this.activeGames.delete(gameId);
        break;
      }
    }
  }

  getGame(gameId) {
    return this.activeGames.get(gameId);
  }

  removeGame(gameId) {
    if (this.gameTimers.has(gameId)) {
      clearInterval(this.gameTimers.get(gameId));
      this.gameTimers.delete(gameId);
    }
    this.activeGames.delete(gameId);
  }

  handleResignation(gameId, socketId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return false;

    const resigningPlayer = gameState.white.socket.id === socketId ? 'white' : 'black';
    const winner = resigningPlayer === 'white' ? 'black' : 'white';

    return { winner, reason: 'resignation' };
  }

  handleDrawOffer(gameId, socketId) {
  
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return false;

    const offeringPlayer = gameState.white.socket.id === socketId ? 'white' : 'black';
    
    if (gameState.drawOffers.has(offeringPlayer)) {
      return false; // Player already offered draw
    }

    if (gameState.drawOffers.has(offeringPlayer === 'white' ? 'black' : 'white')) {
      // Other player already offered draw, accept it
      return { winner: 'draw', reason: 'agreement' };
    }

    gameState.drawOffers.add(offeringPlayer);
    return true;
  }

  handleTimeOut(gameId, socketId) {
    const gameState = this.activeGames.get(gameId);
    if (!gameState) return false;

    const timeoutPlayer = gameState.white.socket.id === socketId ? 'white' : 'black';
    const opponent = timeoutPlayer === 'white' ? 'black' : 'white';

    // Check if time has actually run out
    if (gameState.timeRemaining[timeoutPlayer] <= 0) {
      const { game } = gameState;
      
      // Check if opponent has sufficient material for checkmate
      const hasSufficientMaterial = this.hasSufficientMaterial(game, opponent === 'white' ? 'w' : 'b');
      
      // If opponent doesn't have sufficient material, it's a draw
      const result = hasSufficientMaterial 
        ? { winner: opponent, reason: 'timeout' }
        : { winner: 'draw', reason: 'insufficient material' };

      // Notify both players
      gameState.white.socket.emit('gameOver', result);
      gameState.black.socket.emit('gameOver', result);
      
      // Remove the game
      this.removeGame(gameId);
      return result;
    }

    return false;
  }

  hasSufficientMaterial(game, color) {
    const pieces = game.board().flat().filter(piece => piece && piece.color === color);
    
    // King only - insufficient material
    if (pieces.length === 1) return false;
    
    // King and queen/rook/pawn - sufficient material
    if (pieces.some(piece => ['q', 'r', 'p'].includes(piece.type))) return true;
    
    // King and multiple bishops/knights - sufficient material
    if (pieces.length > 2) return true;
    
    // King and single bishop/knight - insufficient material
    if (pieces.length === 2 && pieces.some(piece => ['b', 'n'].includes(piece.type))) return false;
    
    return true;
  }
}

module.exports = new GameManager();
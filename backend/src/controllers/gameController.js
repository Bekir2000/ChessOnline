const { Chess } = require('chess.js');
const Game = require('../models/Game');

class GameController {
  constructor() {
    this.games = new Map();
    this.waitingPlayers = [];
  }

  addToWaitingQueue(socket, playerName) {
    const player = {
      id: socket.id,
      name: playerName,
      socket: socket
    };

    if (this.waitingPlayers.length > 0) {
      const opponent = this.waitingPlayers.shift();
      return this.createGame(player, opponent);
    } else {
      this.waitingPlayers.push(player);
      return { waiting: true };
    }
  }

  async createGame(player1, player2) {
    const gameId = `${player1.id}-${player2.id}`;
    const chess = new Chess();

    // Create game state for real-time management
    const gameState = {
      id: gameId,
      game: chess,
      white: player2, // First player in queue gets white
      black: player1,
      currentTurn: 'white'
    };

    this.games.set(gameId, gameState);

    // Create persistent game record
    try {
      const game = new Game({
        whitePlayer: player2.id,
        blackPlayer: player1.id,
        timeControl: {
          initial: 600, // 10 minutes
          increment: 5 // 5 seconds
        }
      });
      await game.save();
    } catch (error) {
      console.error('Error saving game:', error);
    }

    // Notify players
    this._notifyGameStart(player1, player2, gameId);

    return {
      waiting: false,
      gameState
    };
  }

  _notifyGameStart(player1, player2, gameId) {
    player2.socket.emit('gameStart', {
      gameId,
      color: 'white',
      opponent: { name: player1.name }
    });

    player1.socket.emit('gameStart', {
      gameId,
      color: 'black',
      opponent: { name: player2.name }
    });
  }

  async handleMove(gameId, socket, from, to) {
    const gameState = this.games.get(gameId);
    if (!gameState) return { error: 'Game not found' };

    const playerColor = gameState.white.id === socket.id ? 'white' : 'black';
    if (playerColor !== gameState.currentTurn) return { error: 'Not your turn' };

    try {
      const move = gameState.game.move({ from, to });
      if (move) {
        gameState.currentTurn = gameState.currentTurn === 'white' ? 'black' : 'white';
        
        // Update game record
        try {
          await Game.findOneAndUpdate(
            { gameId },
            { 
              $push: { moves: { from, to, piece: move.piece } },
              pgn: gameState.game.pgn(),
              finalFen: gameState.game.fen()
            }
          );
        } catch (error) {
          console.error('Error updating game record:', error);
        }

        return {
          success: true,
          fen: gameState.game.fen(),
          isGameOver: gameState.game.isGameOver(),
          isCheckmate: gameState.game.isCheckmate(),
          isDraw: gameState.game.isDraw(),
          winningColor: gameState.game.isCheckmate() ? playerColor : null
        };
      }
      return { error: 'Invalid move' };
    } catch (error) {
      return { error: 'Move error' };
    }
  }

  async handleDisconnection(socketId) {
    // Remove from waiting players
    this.waitingPlayers = this.waitingPlayers.filter(player => player.id !== socketId);

    // Handle active games
    for (const [gameId, game] of this.games) {
      if (game.white.id === socketId || game.black.id === socketId) {
        const opponent = game.white.id === socketId ? game.black : game.white;
        opponent.socket.emit('opponentDisconnected');
        
        // Update game record
        try {
          await Game.findOneAndUpdate(
            { gameId },
            { 
              result: 'forfeit',
              endTime: new Date()
            }
          );
        } catch (error) {
          console.error('Error updating game record:', error);
        }

        this.games.delete(gameId);
        break;
      }
    }
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }
}

module.exports = new GameController();
const { Chess } = require('chess.js');

class GameManager {
  constructor() {
    this.waitingPlayers = [];
    this.activeGames = new Map();
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

      this.activeGames.set(gameId, {
        game,
        white: whitePlayer,
        black: blackPlayer
      });

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

      const result = {
        success: true,
        fen: game.fen(),
        isGameOver: game.isGameOver(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
        winningColor: game.isCheckmate() ? (isWhiteMove ? 'white' : 'black') : null
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
    this.activeGames.delete(gameId);
  }
}

module.exports = new GameManager();
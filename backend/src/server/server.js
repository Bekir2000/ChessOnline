const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const gameManager = require('./gameManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle player joining queue
  socket.on('joinQueue', (playerName) => {
    const matched = gameManager.addToWaitingQueue(socket, playerName);
  });

  // Handle move
  socket.on('move', ({ gameId, from, to }) => {
    const result = gameManager.handleMove(gameId, socket, from, to);
    if (result && result.success) {
      const game = gameManager.getGame(gameId);
      if (!game) return;

      // Broadcast move to both players
      io.to(game.white.socket.id).to(game.black.socket.id).emit('moveMade', {
        from,
        to,
        fen: result.fen
      });

      // Handle game end conditions
      if (result.isGameOver) {
        //console.log('Game over:', result);
        let endMessage;
        if (result.isCheckmate) {
          endMessage = `${result.winningColor === 'white' ? 'White' : 'Black'} wins by checkmate!`;
        } else if (result.isDraw) {
          endMessage = 'Game ended in draw!';
        }
        io.to(game.white.socket.id).to(game.black.socket.id).emit('gameOver', { result: endMessage });
      }
    } else {
      socket.emit('error', { message: 'Invalid move' });
    }
  });

  // Handle game resignation
  socket.on('resign', ({gameId}) => {
    const result = gameManager.handleResignation(gameId, socket.id);
    if (!result) return;
    
    const game = gameManager.getGame(gameId);
    if (!game) return;
    
    io.to(game.white.socket.id).to(game.black.socket.id).emit('gameOver', {
      winner: result.winner,
      reason: result.reason
    });
    
    gameManager.removeGame(gameId);
  });
  // Handle draw offer
  socket.on('offerDraw', ({ gameId }) => {
    const result = gameManager.handleDrawOffer(gameId, socket.id);
    if (!result) return;

    const game = gameManager.getGame(gameId);
    if (!game) return;

    if (result.winner) {
      // Draw was accepted
      io.to(game.white.socket.id).to(game.black.socket.id).emit('gameOver', {
        winner: result.winner,
        reason: result.reason
      });
      gameManager.removeGame(gameId);
    } else {
      // Draw was offered
      const opponent = game.white.socket.id === socket.id ? game.black : game.white;
      opponent.socket.emit('drawOffer', { playerName: socket.playerName });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    gameManager.handleDisconnection(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
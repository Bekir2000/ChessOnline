const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  whitePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blackPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  moves: [{
    from: String,
    to: String,
    piece: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  result: {
    type: String,
    enum: ['white', 'black', 'draw', 'ongoing'],
    default: 'ongoing'
  },
  pgn: {
    type: String,
    default: ''
  },
  finalFen: String,
  timeControl: {
    initial: Number,  // Initial time in seconds
    increment: Number // Time increment per move in seconds
  }
});

gameSchema.methods.updateRatings = async function() {
  if (this.result === 'ongoing') return;

  const winner = this.result === 'white' ? this.whitePlayer : this.blackPlayer;
  const loser = this.result === 'white' ? this.blackPlayer : this.whitePlayer;

  if (this.result !== 'draw') {
    winner.wins += 1;
    loser.losses += 1;
  } else {
    this.whitePlayer.draws += 1;
    this.blackPlayer.draws += 1;
  }

  this.whitePlayer.gamesPlayed += 1;
  this.blackPlayer.gamesPlayed += 1;

  await Promise.all([
    this.whitePlayer.save(),
    this.blackPlayer.save()
  ]);
};

module.exports = mongoose.model('Game', gameSchema);
# Chess Online

A real-time multiplayer chess game built with modern web technologies. Play chess with friends online, featuring a beautiful interface and real-time game updates.

## Features

- Real-time multiplayer chess gameplay
- Beautiful, responsive chessboard interface
- Game state synchronization
- Move validation and legal move highlighting
- Player time control with countdown timer
- Move history tracking
- Game review mode
- Draw offers and resignation options
- Player perspective switching (white/black)
- Visual move indicators and piece animations

## Technology Stack

### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS
- Socket.IO Client
- Chess.js (chess logic)

### Backend
- Node.js
- Socket.IO
- Express.js

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd ChessOnline
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm start
```

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

## Game Rules

- Standard chess rules apply
- Each player has 10 minutes on their clock
- Players can offer draws or resign at any time
- Game ends when:
  - Checkmate occurs
  - A player runs out of time
  - A player resigns
  - Both players agree to a draw

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Chess Multiplayer Game

A real-time multiplayer chess game built with WebSocket, Node.js, TypeScript, and Next.js.

## Features

- Real-time multiplayer chess gameplay
- WebSocket-based communication
- Full chess rules implementation (move validation, check, checkmate, stalemate)
- Class-based architecture on both server and client
- Beautiful, responsive UI built with Next.js and Tailwind CSS
- TypeScript throughout the entire stack

## Project Structure

```
Chess/
├── server/          # Node.js WebSocket server
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── WebSocketServer.ts # WebSocket server class
│   │   ├── GameManager.ts     # Game room management
│   │   ├── Game.ts            # Chess game logic
│   │   ├── Board.ts           # Chess board class
│   │   ├── Piece.ts           # Chess piece class
│   │   └── types.ts           # Type definitions
│   └── package.json
└── client/          # Next.js frontend
    ├── app/
    │   └── page.tsx           # Main game page
    ├── components/
    │   ├── ChessBoard.tsx     # Chess board component
    │   ├── Square.tsx         # Square component
    │   └── Piece.tsx          # Piece component
    ├── services/
    │   └── WebSocketClient.ts # WebSocket client class
    ├── types/
    │   └── chess.ts           # Type definitions
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install server dependencies:

```bash
cd server
npm install
```

3. Install client dependencies:

```bash
cd ../client
npm install
```

### Running the Application

1. Start the WebSocket server:

```bash
cd server
npm run dev
```

The server will start on `ws://localhost:8080`

2. In a new terminal, start the Next.js frontend:

```bash
cd client
npm run dev
```

The client will be available at `http://localhost:3000`

3. Open two browser windows to `http://localhost:3000` to play a game

### Building for Production

Server:

```bash
cd server
npm run build
npm start
```

Client:

```bash
cd client
npm run build
npm start
```

## How to Play

1. Open the application in your browser
2. Click "Create New Game" to create a new game
3. Share the Game ID with another player, or click "Join Available Game" in another browser window
4. Once both players join, the game begins
5. Click on a piece to select it, then click on a valid square to move
6. The game enforces all standard chess rules

## Architecture

### Server

The server uses a class-based architecture:

- **WebSocketServer**: Manages WebSocket connections and message routing
- **GameManager**: Handles game creation, player matching, and game lifecycle
- **Game**: Implements chess game logic and rules
- **Board**: Manages the chess board state
- **Piece**: Represents individual chess pieces with move generation

### Client

The client is built with Next.js and React:

- **WebSocketClient**: Class-based WebSocket client with reconnection logic
- **ChessBoard**: Main game board component with move handling
- **Square & Piece**: Reusable UI components for rendering the board

## Technologies Used

- **Backend**: Node.js, TypeScript, ws (WebSocket library)
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Communication**: WebSocket protocol for real-time gameplay

## License

MIT

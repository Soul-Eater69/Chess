# Chess Server

WebSocket-based chess game server with full chess rules implementation.

## Features

- WebSocket server for real-time multiplayer chess
- Complete chess rules implementation
- Move validation
- Check and checkmate detection
- Game room management
- Automatic player matching

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server runs on `ws://localhost:8080`

## Build

```bash
npm run build
npm start
```

## Environment Variables

- `PORT`: WebSocket server port (default: 8080)

## API Messages

### Client to Server

- `CREATE_GAME`: Create a new game
- `JOIN_GAME`: Join an available game or specific game by ID
- `MAKE_MOVE`: Make a chess move
- `GET_STATE`: Get current game state
- `LEAVE_GAME`: Leave current game

### Server to Client

- `GAME_CREATED`: Game created successfully
- `GAME_JOINED`: Joined game successfully
- `GAME_STATE`: Current game state
- `MOVE_MADE`: Move was made successfully
- `INVALID_MOVE`: Move is invalid
- `PLAYER_JOINED`: Another player joined
- `PLAYER_LEFT`: Player left the game
- `ERROR`: Error message

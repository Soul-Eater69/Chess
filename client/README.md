# Chess Client

Next.js-based frontend for the multiplayer chess game.

## Features

- Real-time chess gameplay UI
- WebSocket client with auto-reconnection
- Responsive design with Tailwind CSS
- Beautiful chess piece rendering
- Game state management
- Move validation feedback

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Configuration

The WebSocket server URL is configured in `app/page.tsx`:

```typescript
const client = new WebSocketClient('ws://localhost:8080');
```

Update this for production deployment.

## Technologies

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- WebSocket API

import WebSocket from 'ws';
import { GameManager } from './GameManager';
import { Move } from './types';
import { v4 as uuidv4 } from 'uuid';

interface Client {
  id: string;
  ws: WebSocket;
}

export enum MessageType {
  // Client -> Server
  CREATE_GAME = 'create_game',
  JOIN_GAME = 'join_game',
  MAKE_MOVE = 'make_move',
  GET_STATE = 'get_state',
  LEAVE_GAME = 'leave_game',

  // Server -> Client
  GAME_CREATED = 'game_created',
  GAME_JOINED = 'game_joined',
  GAME_STATE = 'game_state',
  MOVE_MADE = 'move_made',
  INVALID_MOVE = 'invalid_move',
  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',
  ERROR = 'error'
}

interface Message {
  type: MessageType;
  payload?: any;
}

export class WebSocketServer {
  private wss: WebSocket.Server;
  private gameManager: GameManager;
  private clients: Map<string, Client>;

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port });
    this.gameManager = new GameManager();
    this.clients = new Map();

    this.initialize();
  }

  private initialize(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = uuidv4();
      const client: Client = { id: clientId, ws };
      this.clients.set(clientId, client);

      console.log(`Client connected: ${clientId}`);

      ws.on('message', (data: string) => {
        this.handleMessage(client, data);
      });

      ws.on('close', () => {
        this.handleDisconnect(client);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });

      // Send welcome message
      this.sendMessage(client, {
        type: MessageType.GAME_STATE,
        payload: { clientId, message: 'Connected to chess server' }
      });
    });

    console.log(`WebSocket server running on port ${this.wss.options.port}`);
  }

  private handleMessage(client: Client, data: string): void {
    try {
      const message: Message = JSON.parse(data.toString());

      switch (message.type) {
        case MessageType.CREATE_GAME:
          this.handleCreateGame(client);
          break;

        case MessageType.JOIN_GAME:
          this.handleJoinGame(client, message.payload);
          break;

        case MessageType.MAKE_MOVE:
          this.handleMakeMove(client, message.payload);
          break;

        case MessageType.GET_STATE:
          this.handleGetState(client);
          break;

        case MessageType.LEAVE_GAME:
          this.handleLeaveGame(client);
          break;

        default:
          this.sendError(client, 'Unknown message type');
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this.sendError(client, 'Invalid message format');
    }
  }

  private handleCreateGame(client: Client): void {
    const game = this.gameManager.joinGame(client.id);

    if (!game) {
      this.sendError(client, 'Failed to create game');
      return;
    }

    this.sendMessage(client, {
      type: MessageType.GAME_CREATED,
      payload: {
        gameId: game.id,
        playerColor: game.getPlayerColor(client.id),
        gameState: game.getState()
      }
    });
  }

  private handleJoinGame(client: Client, payload: { gameId?: string }): void {
    const game = this.gameManager.joinGame(client.id, payload?.gameId);

    if (!game) {
      this.sendError(client, 'Failed to join game');
      return;
    }

    const playerColor = game.getPlayerColor(client.id);

    // Send confirmation to joining player
    this.sendMessage(client, {
      type: MessageType.GAME_JOINED,
      payload: {
        gameId: game.id,
        playerColor,
        gameState: game.getState()
      }
    });

    // Notify opponent directly
    const opponentId = this.gameManager.getOpponentId(client.id);
    if (opponentId) {
      const opponent = this.clients.get(opponentId);
      if (opponent) {
        this.sendMessage(opponent, {
          type: MessageType.PLAYER_JOINED,
          payload: {
            gameState: game.getState()
          }
        });
      }
    }
  }

  private handleMakeMove(client: Client, payload: { move: Move }): void {
    const game = this.gameManager.getPlayerGame(client.id);

    if (!game) {
      this.sendError(client, 'You are not in a game');
      return;
    }

    const success = game.makeMove(payload.move, client.id);

    if (!success) {
      this.sendMessage(client, {
        type: MessageType.INVALID_MOVE,
        payload: { message: 'Invalid move' }
      });
      return;
    }

    const moveMessage = {
      type: MessageType.MOVE_MADE,
      payload: {
        move: payload.move,
        gameState: game.getState()
      }
    };

    // Send to the player who made the move
    this.sendMessage(client, moveMessage);

    // Send to opponent
    const opponentId = this.gameManager.getOpponentId(client.id);
    if (opponentId) {
      const opponent = this.clients.get(opponentId);
      if (opponent) {
        this.sendMessage(opponent, moveMessage);
      }
    }
  }

  private handleGetState(client: Client): void {
    const game = this.gameManager.getPlayerGame(client.id);

    if (!game) {
      this.sendError(client, 'You are not in a game');
      return;
    }

    this.sendMessage(client, {
      type: MessageType.GAME_STATE,
      payload: {
        gameId: game.id,
        playerColor: game.getPlayerColor(client.id),
        gameState: game.getState()
      }
    });
  }

  private handleLeaveGame(client: Client): void {
    const game = this.gameManager.getPlayerGame(client.id);

    if (game) {
      // Get opponent before leaving (so we can notify them)
      const opponentId = this.gameManager.getOpponentId(client.id);

      // Remove player from game
      this.gameManager.leaveGame(client.id);

      // Notify opponent directly
      if (opponentId) {
        const opponent = this.clients.get(opponentId);
        if (opponent) {
          this.sendMessage(opponent, {
            type: MessageType.PLAYER_LEFT,
            payload: { gameState: game.getState() }
          });
        }
      }
    }
  }

  private handleDisconnect(client: Client): void {
    console.log(`Client disconnected: ${client.id}`);
    this.handleLeaveGame(client);
    this.clients.delete(client.id);
  }

  private sendMessage(client: Client, message: Message): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private sendError(client: Client, error: string): void {
    this.sendMessage(client, {
      type: MessageType.ERROR,
      payload: { error }
    });
  }

  getServer(): WebSocket.Server {
    return this.wss;
  }
}

export enum PieceType {
  PAWN = 'pawn',
  ROOK = 'rook',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  QUEEN = 'queen',
  KING = 'king'
}

export enum Color {
  WHITE = 'white',
  BLACK = 'black'
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  CHECKMATE = 'checkmate',
  STALEMATE = 'stalemate',
  DRAW = 'draw'
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  promotion?: PieceType;
}

export interface PieceData {
  type: PieceType;
  color: Color;
  position: Position;
  hasMoved?: boolean;
}

export interface GameState {
  board: (PieceData | null)[][];
  currentTurn: Color;
  status: GameStatus;
  winner?: Color;
  inCheck?: Color;
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

export interface Message {
  type: MessageType;
  payload?: any;
}

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

export interface Player {
  id: string;
  color: Color;
  name?: string;
}

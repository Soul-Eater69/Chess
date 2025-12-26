import { Board } from './Board';
import { Piece } from './Piece';
import { Color, GameStatus, Move, Position, GameState, Player } from './types';
import { v4 as uuidv4 } from 'uuid';

export class Game {
  id: string;
  board: Board;
  currentTurn: Color;
  status: GameStatus;
  players: Map<Color, Player>;
  winner?: Color;
  moveHistory: Move[];

  constructor() {
    this.id = uuidv4();
    this.board = new Board();
    this.currentTurn = Color.WHITE;
    this.status = GameStatus.WAITING;
    this.players = new Map();
    this.moveHistory = [];
  }

  addPlayer(playerId: string, color?: Color): boolean {
    if (this.players.size >= 2) return false;

    // Assign color if not specified
    if (!color) {
      if (!this.players.has(Color.WHITE)) {
        color = Color.WHITE;
      } else if (!this.players.has(Color.BLACK)) {
        color = Color.BLACK;
      } else {
        return false;
      }
    }

    // Check if color is already taken
    if (this.players.has(color)) return false;

    this.players.set(color, { id: playerId, color });

    // Start game when both players join
    if (this.players.size === 2) {
      this.status = GameStatus.IN_PROGRESS;
    }

    return true;
  }

  removePlayer(playerId: string): void {
    for (const [color, player] of this.players.entries()) {
      if (player.id === playerId) {
        this.players.delete(color);
        break;
      }
    }
  }

  getPlayerColor(playerId: string): Color | null {
    for (const [color, player] of this.players.entries()) {
      if (player.id === playerId) {
        return color;
      }
    }
    return null;
  }

  isValidMove(move: Move, playerId: string): boolean {
    // Check if it's the player's turn
    const playerColor = this.getPlayerColor(playerId);
    if (!playerColor || playerColor !== this.currentTurn) {
      return false;
    }

    // Check if game is in progress
    if (this.status !== GameStatus.IN_PROGRESS) {
      return false;
    }

    const piece = this.board.getPiece(move.from);
    if (!piece || piece.color !== this.currentTurn) {
      return false;
    }

    // Check if the move is in the piece's possible moves
    const possibleMoves = piece.getPossibleMoves(this.board.board);
    const isMovePossible = possibleMoves.some(
      pos => pos.row === move.to.row && pos.col === move.to.col
    );

    if (!isMovePossible) {
      return false;
    }

    // Check if move would leave king in check
    if (this.wouldBeInCheckAfterMove(move, this.currentTurn)) {
      return false;
    }

    return true;
  }

  makeMove(move: Move, playerId: string): boolean {
    if (!this.isValidMove(move, playerId)) {
      return false;
    }

    const piece = this.board.getPiece(move.from);
    if (!piece) return false;

    // Make the move
    this.board.movePiece(move.from, move.to);
    this.moveHistory.push(move);

    // Switch turn
    this.currentTurn = this.currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE;

    // Check game status
    this.updateGameStatus();

    return true;
  }

  private wouldBeInCheckAfterMove(move: Move, color: Color): boolean {
    // Create a temporary board to test the move
    const tempBoard = this.board.clone();
    tempBoard.movePiece(move.from, move.to);

    // Find the king position
    const kingPos = tempBoard.findKing(color);
    if (!kingPos) return true; // If king not found, something is wrong

    // Check if king is under attack
    const opponentColor = color === Color.WHITE ? Color.BLACK : Color.WHITE;
    return tempBoard.isPositionUnderAttack(kingPos, opponentColor);
  }

  private isInCheck(color: Color): boolean {
    const kingPos = this.board.findKing(color);
    if (!kingPos) return false;

    const opponentColor = color === Color.WHITE ? Color.BLACK : Color.WHITE;
    return this.board.isPositionUnderAttack(kingPos, opponentColor);
  }

  private hasValidMoves(color: Color): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board.getPiece({ row, col });
        if (piece && piece.color === color) {
          const possibleMoves = piece.getPossibleMoves(this.board.board);
          for (const to of possibleMoves) {
            const move: Move = { from: { row, col }, to };
            if (!this.wouldBeInCheckAfterMove(move, color)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  private updateGameStatus(): void {
    const inCheck = this.isInCheck(this.currentTurn);
    const hasValidMoves = this.hasValidMoves(this.currentTurn);

    if (!hasValidMoves) {
      if (inCheck) {
        // Checkmate
        this.status = GameStatus.CHECKMATE;
        this.winner = this.currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
      } else {
        // Stalemate
        this.status = GameStatus.STALEMATE;
      }
    }
  }

  getState(): GameState {
    return {
      board: this.board.toJSON(),
      currentTurn: this.currentTurn,
      status: this.status,
      winner: this.winner,
      inCheck: this.isInCheck(this.currentTurn) ? this.currentTurn : undefined
    };
  }

  toJSON(): any {
    return {
      id: this.id,
      gameState: this.getState(),
      players: Array.from(this.players.values())
    };
  }
}

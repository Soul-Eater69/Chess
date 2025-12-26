import { PieceType, Color, Position } from './types';

export class Piece {
  type: PieceType;
  color: Color;
  position: Position;
  hasMoved: boolean;

  constructor(type: PieceType, color: Color, position: Position) {
    this.type = type;
    this.color = color;
    this.position = position;
    this.hasMoved = false;
  }

  /**
   * Get all possible moves for this piece (without considering check)
   */
  getPossibleMoves(board: (Piece | null)[][]): Position[] {
    switch (this.type) {
      case PieceType.PAWN:
        return this.getPawnMoves(board);
      case PieceType.ROOK:
        return this.getRookMoves(board);
      case PieceType.KNIGHT:
        return this.getKnightMoves(board);
      case PieceType.BISHOP:
        return this.getBishopMoves(board);
      case PieceType.QUEEN:
        return this.getQueenMoves(board);
      case PieceType.KING:
        return this.getKingMoves(board);
      default:
        return [];
    }
  }

  private getPawnMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const direction = this.color === Color.WHITE ? -1 : 1;
    const startRow = this.color === Color.WHITE ? 6 : 1;
    const { row, col } = this.position;

    // Forward move
    if (this.isValidPosition(row + direction, col) && !board[row + direction][col]) {
      moves.push({ row: row + direction, col });

      // Double move from start
      if (row === startRow && !board[row + 2 * direction][col]) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // Captures
    for (const dcol of [-1, 1]) {
      const newRow = row + direction;
      const newCol = col + dcol;
      if (this.isValidPosition(newRow, newCol)) {
        const target = board[newRow][newCol];
        if (target && target.color !== this.color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  private getRookMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (const [drow, dcol] of directions) {
      this.addMovesInDirection(board, moves, drow, dcol);
    }

    return moves;
  }

  private getKnightMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [drow, dcol] of knightMoves) {
      const newRow = this.position.row + drow;
      const newCol = this.position.col + dcol;

      if (this.isValidPosition(newRow, newCol)) {
        const target = board[newRow][newCol];
        if (!target || target.color !== this.color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  private getBishopMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [drow, dcol] of directions) {
      this.addMovesInDirection(board, moves, drow, dcol);
    }

    return moves;
  }

  private getQueenMoves(board: (Piece | null)[][]): Position[] {
    return [...this.getRookMoves(board), ...this.getBishopMoves(board)];
  }

  private getKingMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const directions = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [drow, dcol] of directions) {
      const newRow = this.position.row + drow;
      const newCol = this.position.col + dcol;

      if (this.isValidPosition(newRow, newCol)) {
        const target = board[newRow][newCol];
        if (!target || target.color !== this.color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  private addMovesInDirection(
    board: (Piece | null)[][],
    moves: Position[],
    drow: number,
    dcol: number
  ): void {
    let newRow = this.position.row + drow;
    let newCol = this.position.col + dcol;

    while (this.isValidPosition(newRow, newCol)) {
      const target = board[newRow][newCol];

      if (!target) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (target.color !== this.color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }

      newRow += drow;
      newCol += dcol;
    }
  }

  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  toJSON(): any {
    return {
      type: this.type,
      color: this.color,
      position: this.position,
      hasMoved: this.hasMoved
    };
  }
}

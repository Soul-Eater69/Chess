import { Piece } from './Piece';
import { PieceType, Color, Position } from './types';

export class Board {
  board: (Piece | null)[][];

  constructor() {
    this.board = this.initializeBoard();
  }

  private initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

    // Place pawns
    for (let col = 0; col < 8; col++) {
      board[1][col] = new Piece(PieceType.PAWN, Color.BLACK, { row: 1, col });
      board[6][col] = new Piece(PieceType.PAWN, Color.WHITE, { row: 6, col });
    }

    // Place rooks
    board[0][0] = new Piece(PieceType.ROOK, Color.BLACK, { row: 0, col: 0 });
    board[0][7] = new Piece(PieceType.ROOK, Color.BLACK, { row: 0, col: 7 });
    board[7][0] = new Piece(PieceType.ROOK, Color.WHITE, { row: 7, col: 0 });
    board[7][7] = new Piece(PieceType.ROOK, Color.WHITE, { row: 7, col: 7 });

    // Place knights
    board[0][1] = new Piece(PieceType.KNIGHT, Color.BLACK, { row: 0, col: 1 });
    board[0][6] = new Piece(PieceType.KNIGHT, Color.BLACK, { row: 0, col: 6 });
    board[7][1] = new Piece(PieceType.KNIGHT, Color.WHITE, { row: 7, col: 1 });
    board[7][6] = new Piece(PieceType.KNIGHT, Color.WHITE, { row: 7, col: 6 });

    // Place bishops
    board[0][2] = new Piece(PieceType.BISHOP, Color.BLACK, { row: 0, col: 2 });
    board[0][5] = new Piece(PieceType.BISHOP, Color.BLACK, { row: 0, col: 5 });
    board[7][2] = new Piece(PieceType.BISHOP, Color.WHITE, { row: 7, col: 2 });
    board[7][5] = new Piece(PieceType.BISHOP, Color.WHITE, { row: 7, col: 5 });

    // Place queens
    board[0][3] = new Piece(PieceType.QUEEN, Color.BLACK, { row: 0, col: 3 });
    board[7][3] = new Piece(PieceType.QUEEN, Color.WHITE, { row: 7, col: 3 });

    // Place kings
    board[0][4] = new Piece(PieceType.KING, Color.BLACK, { row: 0, col: 4 });
    board[7][4] = new Piece(PieceType.KING, Color.WHITE, { row: 7, col: 4 });

    return board;
  }

  getPiece(position: Position): Piece | null {
    return this.board[position.row][position.col];
  }

  setPiece(position: Position, piece: Piece | null): void {
    this.board[position.row][position.col] = piece;
  }

  movePiece(from: Position, to: Position): Piece | null {
    const piece = this.getPiece(from);
    if (!piece) return null;

    const capturedPiece = this.getPiece(to);

    this.setPiece(to, piece);
    this.setPiece(from, null);

    piece.position = to;
    piece.hasMoved = true;

    return capturedPiece;
  }

  findKing(color: Color): Position | null {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.type === PieceType.KING && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  }

  isPositionUnderAttack(position: Position, byColor: Color): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === byColor) {
          const possibleMoves = piece.getPossibleMoves(this.board);
          if (possibleMoves.some(move => move.row === position.row && move.col === position.col)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  clone(): Board {
    const newBoard = new Board();
    newBoard.board = this.board.map(row =>
      row.map(piece => {
        if (!piece) return null;
        const newPiece = new Piece(piece.type, piece.color, { ...piece.position });
        newPiece.hasMoved = piece.hasMoved;
        return newPiece;
      })
    );
    return newBoard;
  }

  toJSON(): any {
    return this.board.map(row =>
      row.map(piece => piece ? piece.toJSON() : null)
    );
  }
}

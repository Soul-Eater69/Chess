import React from 'react';
import { PieceData, PieceType, Color } from '@/types/chess';

interface PieceProps {
  piece: PieceData;
}

const pieceSymbols: Record<Color, Record<PieceType, string>> = {
  [Color.WHITE]: {
    [PieceType.KING]: '♔',
    [PieceType.QUEEN]: '♕',
    [PieceType.ROOK]: '♖',
    [PieceType.BISHOP]: '♗',
    [PieceType.KNIGHT]: '♘',
    [PieceType.PAWN]: '♙'
  },
  [Color.BLACK]: {
    [PieceType.KING]: '♚',
    [PieceType.QUEEN]: '♛',
    [PieceType.ROOK]: '♜',
    [PieceType.BISHOP]: '♝',
    [PieceType.KNIGHT]: '♞',
    [PieceType.PAWN]: '♟'
  }
};

const Piece: React.FC<PieceProps> = ({ piece }) => {
  const symbol = pieceSymbols[piece.color][piece.type];

  return (
    <div className="text-5xl md:text-6xl select-none pointer-events-none">
      {symbol}
    </div>
  );
};

export default Piece;

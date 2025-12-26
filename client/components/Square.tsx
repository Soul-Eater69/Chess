import React from 'react';
import { Position } from '@/types/chess';
import Piece from './Piece';
import { PieceData } from '@/types/chess';

interface SquareProps {
  position: Position;
  piece: PieceData | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isValidMove,
  onClick
}) => {
  const baseClasses = 'w-16 h-16 md:w-20 md:h-20 flex items-center justify-center relative cursor-pointer transition-all';
  const colorClasses = isLight ? 'bg-amber-100' : 'bg-amber-700';
  const selectedClasses = isSelected ? 'ring-4 ring-blue-500' : '';
  const validMoveClasses = isValidMove ? 'after:absolute after:w-4 after:h-4 after:bg-green-500 after:rounded-full after:opacity-60' : '';

  return (
    <div
      className={`${baseClasses} ${colorClasses} ${selectedClasses} ${validMoveClasses}`}
      onClick={onClick}
    >
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Square;

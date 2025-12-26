'use client';

import React, { useState, useEffect } from 'react';
import Square from './Square';
import { GameState, Position, Color, PieceData, MessageType } from '@/types/chess';
import { WebSocketClient } from '@/services/WebSocketClient';

interface ChessBoardProps {
  wsClient: WebSocketClient;
  gameState: GameState | null;
  playerColor: Color | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ wsClient, gameState, playerColor }) => {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);

  useEffect(() => {
    // Clear selection when turn changes
    setSelectedSquare(null);
    setValidMoves([]);
  }, [gameState?.currentTurn]);

  const handleSquareClick = (position: Position, piece: PieceData | null) => {
    if (!gameState || !playerColor) return;

    // Can't move if it's not your turn
    if (gameState.currentTurn !== playerColor) {
      return;
    }

    // If a square is already selected
    if (selectedSquare) {
      // Check if clicked square is a valid move
      const isValidMove = validMoves.some(
        move => move.row === position.row && move.col === position.col
      );

      if (isValidMove) {
        // Make the move
        wsClient.makeMove({
          from: selectedSquare,
          to: position
        });
        setSelectedSquare(null);
        setValidMoves([]);
      } else if (piece && piece.color === playerColor) {
        // Select a different piece
        setSelectedSquare(position);
        // In a real implementation, you'd get valid moves from the server
        setValidMoves([]);
      } else {
        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else {
      // Select a piece
      if (piece && piece.color === playerColor) {
        setSelectedSquare(position);
        // In a real implementation, you'd request valid moves from the server
        // For now, we'll just show that the piece is selected
        setValidMoves([]);
      }
    }
  };

  const isSquareLight = (row: number, col: number): boolean => {
    return (row + col) % 2 === 0;
  };

  const isValidMoveSquare = (position: Position): boolean => {
    return validMoves.some(
      move => move.row === position.row && move.col === position.col
    );
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading game...</div>
      </div>
    );
  }

  // Reverse board if playing as black
  const displayBoard = playerColor === Color.BLACK
    ? [...gameState.board].reverse().map(row => [...row].reverse())
    : gameState.board;

  return (
    <div className="flex flex-col items-center">
      <div className="inline-block border-4 border-gray-800 shadow-2xl">
        {displayBoard.map((row, rowIndex) => {
          const actualRow = playerColor === Color.BLACK ? 7 - rowIndex : rowIndex;
          return (
            <div key={rowIndex} className="flex">
              {row.map((piece, colIndex) => {
                const actualCol = playerColor === Color.BLACK ? 7 - colIndex : colIndex;
                const position: Position = { row: actualRow, col: actualCol };
                const isSelected = selectedSquare?.row === actualRow && selectedSquare?.col === actualCol;
                const isValidMove = isValidMoveSquare(position);

                return (
                  <Square
                    key={`${actualRow}-${actualCol}`}
                    position={position}
                    piece={piece}
                    isLight={isSquareLight(actualRow, actualCol)}
                    isSelected={isSelected}
                    isValidMove={isValidMove}
                    onClick={() => handleSquareClick(position, piece)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChessBoard;

'use client';

import React, { useState, useEffect } from 'react';
import ChessBoard from '@/components/ChessBoard';
import { WebSocketClient } from '@/services/WebSocketClient';
import { GameState, Color, MessageType, GameStatus } from '@/types/chess';

export default function Home() {
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const client = new WebSocketClient('ws://localhost:8080');

    client.on(MessageType.GAME_CREATED, (payload) => {
      if (!payload) return;
      setGameId(payload.gameId);
      setPlayerColor(payload.playerColor);
      setGameState(payload.gameState);
    });

    client.on(MessageType.GAME_JOINED, (payload) => {
      if (!payload) return;
      setGameId(payload.gameId);
      setPlayerColor(payload.playerColor);
      setGameState(payload.gameState);
    });

    client.on(MessageType.GAME_STATE, (payload) => {
      if (!payload) return;
      if (payload.gameState) {
        setGameState(payload.gameState);
      }
      if (payload.playerColor) {
        setPlayerColor(payload.playerColor);
      }
    });

    client.on(MessageType.MOVE_MADE, (payload) => {
      if (!payload || !payload.gameState) return;
      setGameState(payload.gameState);
    });

    client.on(MessageType.PLAYER_JOINED, (payload) => {
      if (!payload || !payload.gameState) return;
      setGameState(payload.gameState);
    });

    client.on(MessageType.PLAYER_LEFT, (payload) => {
      if (!payload || !payload.gameState) return;
      setGameState(payload.gameState);
      setError('Opponent disconnected. Waiting for a new player...');
      setTimeout(() => setError(null), 5000);
    });

    client.on(MessageType.INVALID_MOVE, (payload) => {
      if (!payload) return;
      setError(payload.message || 'Invalid move');
      setTimeout(() => setError(null), 3000);
    });

    client.on(MessageType.ERROR, (payload) => {
      if (!payload) return;
      setError(payload.error);
      setTimeout(() => setError(null), 5000);
    });

    client.connect()
      .then(() => {
        setConnected(true);
        setWsClient(client);
      })
      .catch((err) => {
        console.error('Failed to connect:', err);
        setError('Failed to connect to server');
      });

    return () => {
      client.disconnect();
    };
  }, []);

  const handleCreateGame = () => {
    if (wsClient) {
      wsClient.createGame();
    }
  };

  const handleJoinGame = () => {
    if (wsClient) {
      wsClient.joinGame();
    }
  };

  const handleLeaveGame = () => {
    if (wsClient) {
      wsClient.leaveGame();
      setGameState(null);
      setGameId(null);
      setPlayerColor(null);
    }
  };

  const getGameStatusText = () => {
    if (!gameState) return '';

    switch (gameState.status) {
      case GameStatus.WAITING:
        return 'Waiting for opponent...';
      case GameStatus.IN_PROGRESS:
        if (gameState.currentTurn === playerColor) {
          return "Your turn";
        } else {
          return "Opponent's turn";
        }
      case GameStatus.CHECKMATE:
        if (gameState.winner === playerColor) {
          return 'You won! Checkmate!';
        } else {
          return 'You lost. Checkmate.';
        }
      case GameStatus.STALEMATE:
        return 'Game ended in stalemate';
      case GameStatus.DRAW:
        return 'Game ended in draw';
      default:
        return '';
    }
  };

  const getPlayerColorText = () => {
    if (!playerColor) return '';
    return `You are playing as ${playerColor === Color.WHITE ? 'White' : 'Black'}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-2">Chess Multiplayer</h1>
        <p className="text-gray-300">Real-time chess game with WebSocket</p>
      </div>

      {error && (
        <div className="mb-4 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {!connected ? (
        <div className="text-white text-xl">Connecting to server...</div>
      ) : !gameState ? (
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join a Game</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleCreateGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md"
            >
              Create New Game
            </button>
            <button
              onClick={handleJoinGame}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg shadow-md"
            >
              Join Available Game
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white rounded-lg shadow-lg px-8 py-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">{getPlayerColorText()}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{getGameStatusText()}</p>
              {gameState.inCheck && (
                <p className="text-red-600 font-bold mt-2">Check!</p>
              )}
              {gameId && (
                <p className="text-sm text-gray-500 mt-2">Game ID: {gameId}</p>
              )}
              <button
                onClick={handleLeaveGame}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Leave Game
              </button>
            </div>
          </div>

          {wsClient && <ChessBoard wsClient={wsClient} gameState={gameState} playerColor={playerColor} />}

          {gameState.status === GameStatus.WAITING && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
              <p className="font-semibold">Waiting for another player to join...</p>
              <p className="text-sm mt-1">Share the game ID with a friend or wait for someone to join.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

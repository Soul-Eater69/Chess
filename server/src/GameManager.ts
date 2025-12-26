import { Game } from './Game';
import { Color } from './types';

export class GameManager {
  private games: Map<string, Game>;
  private playerGameMap: Map<string, string>; // playerId -> gameId

  constructor() {
    this.games = new Map();
    this.playerGameMap = new Map();
  }

  createGame(): Game {
    const game = new Game();
    this.games.set(game.id, game);
    return game;
  }

  getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  getPlayerGame(playerId: string): Game | undefined {
    const gameId = this.playerGameMap.get(playerId);
    if (!gameId) return undefined;
    return this.games.get(gameId);
  }

  joinGame(playerId: string, gameId?: string, color?: Color): Game | null {
    let game: Game | undefined;

    if (gameId) {
      // Join specific game
      game = this.games.get(gameId);
      if (!game) return null;
    } else {
      // Find available game or create new one
      game = this.findAvailableGame();
      if (!game) {
        game = this.createGame();
      }
    }

    // Try to add player to game
    const success = game.addPlayer(playerId, color);
    if (!success) return null;

    // Map player to game
    this.playerGameMap.set(playerId, game.id);

    return game;
  }

  leaveGame(playerId: string): void {
    const gameId = this.playerGameMap.get(playerId);
    if (!gameId) return;

    const game = this.games.get(gameId);
    if (game) {
      game.removePlayer(playerId);

      // If game is empty, remove it
      if (game.players.size === 0) {
        this.games.delete(gameId);
      }
    }

    this.playerGameMap.delete(playerId);
  }

  private findAvailableGame(): Game | undefined {
    for (const game of this.games.values()) {
      if (game.players.size < 2) {
        return game;
      }
    }
    return undefined;
  }

  getAvailableGames(): Game[] {
    return Array.from(this.games.values()).filter(game => game.players.size < 2);
  }

  getAllGames(): Game[] {
    return Array.from(this.games.values());
  }
}

export class GameSaver {
  constructor() {
    this.storageKey = 'pairEmUpGameState';
  }

  saveGame(gameState) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(gameState));
      return true;
    } catch (error) {
      return false;
    }
  }

  loadGame() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
  }

  deleteGame() {
    localStorage.removeItem(this.storageKey);
  }

  hasSavedGame() {
    return localStorage.getItem(this.storageKey) !== null;
  }
  getSavedGameMode() {
    const saved = this.loadGame();
    return saved ? saved.mode : null;
  }
}
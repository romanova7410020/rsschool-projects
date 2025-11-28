export class GameStats {
  constructor() {
    this.storageKey = 'gameHistory';
    this.maxRecords = 5;
  }

  saveGameResult(gameData) {
    try {
      const history = this.getHistory();

      const newRecord = {
        id: Date.now(),
        mode: gameData.mode,
        score: gameData.score,
        isWin: gameData.isWin,
        completionTime: gameData.completionTime,
        moves: gameData.moves,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };
      history.unshift(newRecord);

      history.splice(this.maxRecords);

      localStorage.setItem(this.storageKey, JSON.stringify(history));
      return newRecord;
    } catch (error) {
      return null;
    }
  }

  getHistory() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }

  getWins() {
    return this.getHistory().filter(record => record.isWin).length;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
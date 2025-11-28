import { GameStats } from '@/components/statistic';

export default class ResultScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
    this.gameStats = new GameStats();
  }

  render() {
    this.root.innerHTML = '';

    const container = document.createElement('div');
    container.classList.add('result-container');

    const title = document.createElement('h2');
    title.textContent = 'Game Results';
    container.appendChild(title);

    const historySection = this.createHistorySection();
    container.appendChild(historySection);

    const statsSection = this.createStatsSection();
    container.appendChild(statsSection);

    this.root.appendChild(container);
  }

  createHistorySection() {
    const section = document.createElement('div');
    section.classList.add('history-section');

    const title = document.createElement('h2');
    title.textContent = 'Last 5 Games';
    section.appendChild(title);

    const history = this.gameStats.getHistory();
    history.forEach((record) => {
    const formattedTime = this.gameStats.formatTime(record.completionTime);
  });
    if (history.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.classList.add('empty-message');
      emptyMsg.textContent = 'No games played yet';
      section.appendChild(emptyMsg);
      return section;
    }

    const historyList = document.createElement('div');
    historyList.classList.add('history-list');

    history.forEach((record, index) => {
      const card = document.createElement('div');
      card.classList.add('game-card', record.isWin ? 'win-card' : 'lose-card');

      const resultIcon = record.isWin ? '⭐' : '❌';
      const formattedTime = this.gameStats.formatTime(record.completionTime);

      card.innerHTML = `
        <div class="card-header">
          <div class="result-badge">${resultIcon} ${record.isWin ? 'WIN' : 'LOST'}</div>
          <div class="card-date">${record.date}</div>
        </div>
        <div class="card-body">
          <div class="card-item">
            <span class="card-label">Mode</span>
            <span class="card-value">${record.mode.toUpperCase()}</span>
          </div>
          <div class="card-item">
            <span class="card-label">Score</span>
            <span class="card-value">${record.score}</span>
          </div>
          <div class="card-item">
            <span class="card-label">Time</span>
            <span class="card-value">${formattedTime}</span>
          </div>
          <div class="card-item">
            <span class="card-label">Moves</span>
            <span class="card-value">${record.moves}</span>
          </div>
        </div>
      `;

      historyList.appendChild(card);
    });

    section.appendChild(historyList);
    return section;
  }

  createStatsSection() {
    const section = document.createElement('div');
    section.classList.add('stats-section');

    const history = this.gameStats.getHistory();
    const totalGames = history.length;
    const wins = this.gameStats.getWins();
    const losses = totalGames - wins;
    const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;

    const stats = [
      { label: 'Total Games', value: totalGames, icon: '🎮' },
      { label: 'Wins', value: wins, icon: '⭐' },
      { label: 'Losses', value: losses, icon: '❌' },
      { label: 'Win Rate', value: `${winRate}%`, icon: '📈' }
    ];

    stats.forEach(stat => {
      const statDiv = document.createElement('div');
      statDiv.classList.add('stat-item');
      statDiv.innerHTML = `
        <div class="stat-icon">${stat.icon}</div>
        <div class="stat-content">
          <div class="stat-label">${stat.label}</div>
          <div class="stat-value">${stat.value}</div>
        </div>
      `;
      section.appendChild(statDiv);
    });

    return section;
  }
}

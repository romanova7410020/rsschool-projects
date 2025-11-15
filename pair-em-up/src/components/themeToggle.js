export class ThemeToggle {
  constructor() {
    this.isDarkTheme = this.loadTheme();
    this.applyTheme();
  }

  loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.saveTheme();
  }

  applyTheme() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  saveTheme() {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
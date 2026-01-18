/**
 * @fileoverview Theme toggle functionality for light/dark/auto modes.
 * @description
 * This script manages the theme toggling feature, allowing users to switch
 * between light, dark, and auto themes. It updates the document's color scheme,
 * changes the theme icon, and persists the user's choice in localStorage.
 * @module theme-toggle
 */

const THEMES = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark'
};

const THEME_ICONS = {
  [THEMES.AUTO]: 'assets/scheme/scheme-device.svg',
  [THEMES.LIGHT]: 'assets/scheme/scheme-light.svg',
  [THEMES.DARK]: 'assets/scheme/scheme-dark.svg'
};

/**
 * Gets current theme from localStorage or returns default
 * @returns {string} Current theme (auto/light/dark)
 */
const getCurrentTheme = () => {
  return localStorage.getItem('theme') || THEMES.AUTO;
};

/**
 * Gets next theme in cycle: auto → light → dark → auto
 * @param {string} current - Current theme
 * @returns {string} Next theme
 */
const getNextTheme = (current) => {
  const cycle = [THEMES.AUTO, THEMES.LIGHT, THEMES.DARK];
  const index = cycle.indexOf(current);
  return cycle[(index + 1) % cycle.length];
};

/**
 * Applies theme to document root
 * @param {string} theme - Theme to apply
 */
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === THEMES.AUTO) {
    root.style.colorScheme = 'light dark';
  } else {
    root.style.colorScheme = theme;
  }
};

/**
 * Updates theme icon based on current theme
 * @param {string} theme - Current theme
 */
const updateIcon = (theme) => {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.src = THEME_ICONS[theme];
    icon.alt = `${theme} theme`;
  }
};

/**
 * Saves theme to localStorage
 * @param {string} theme - Theme to save
 */
const saveTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

/**
 * Handles theme toggle button click
 */
const handleThemeToggle = () => {
  const current = getCurrentTheme();
  const next = getNextTheme(current);
  applyTheme(next);
  updateIcon(next);
  saveTheme(next);
};

/**
 * Initializes theme on page load
 */
const initTheme = () => {
  const theme = getCurrentTheme();
  applyTheme(theme);
  updateIcon(theme);
};

/**
 * Sets up theme toggle button event listener
 */
const setupThemeToggle = () => {
  const button = document.getElementById('themeToggle');
  if (button) {
    button.addEventListener('click', handleThemeToggle);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupThemeToggle();
});

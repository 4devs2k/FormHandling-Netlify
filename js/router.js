/**
 * @fileoverview Modern SPA Router with History API
 * @description Client-side router for handling navigation without page reloads
 * @module router
 */

/**
 * Simple SPA Router with History API
 * Provides clean URLs without hash symbols
 */
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.loadRoute(window.location.pathname);
    });

    // Intercept all link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }

  /**
   * Register a route with its handler function
   * @param {string} path - Route path (e.g., '/privacy')
   * @param {Function} handler - Function that renders the page
   */
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Navigate to a new route
   * @param {string} path - Path to navigate to
   */
  navigate(path) {
    window.history.pushState(null, null, path);
    this.loadRoute(path);
  }

  /**
   * Load and render a route
   * @param {string} path - Path to load
   */
  loadRoute(path) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handler = this.routes[path] || this.routes['/404'];

    if (handler) {
      this.currentRoute = path;
      handler();
    }
  }

  /**
   * Initialize router and load initial route
   */
  init() {
    this.loadRoute(window.location.pathname);
  }
}

export default Router;

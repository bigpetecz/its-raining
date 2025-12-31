/**
 * Environment Configuration
 * 
 * This module provides centralized access to all environment variables.
 * Environment variables should be prefixed with VITE_ to be accessible in the browser.
 * 
 * .env file format:
 * VITE_VAR_NAME=value
 * 
 * Note: Using import.meta.env for Vite instead of process.env (Create React App)
 */

export const ENV = {
  // Debug Logging
  DEBUG_LOG_ENABLED: import.meta.env.VITE_DEBUG_LOG === 'true',

  // UI Visibility
  SHOW_DECK: import.meta.env.VITE_SHOW_DECK === 'true',

  // Application Environment
  ENV_NAME: (import.meta.env.VITE_ENV as string | undefined) ?? import.meta.env.MODE ?? 'development',

  // API Configuration (for future use)
  API_URL: import.meta.env.VITE_API_URL as string | undefined,
  API_TIMEOUT: parseInt((import.meta.env.VITE_API_TIMEOUT as string | undefined) ?? '5000', 10),

  // Feature Flags (for future use)
  FEATURE_MULTIPLAYER: import.meta.env.VITE_FEATURE_MULTIPLAYER === 'true',
  FEATURE_LEADERBOARD: import.meta.env.VITE_FEATURE_LEADERBOARD === 'true',
};

/**
 * Log environment configuration (useful for debugging)
 */
if (ENV.ENV_NAME === 'development') {
  console.log('Environment Configuration:', {
    debugLogEnabled: ENV.DEBUG_LOG_ENABLED,
    environment: ENV.ENV_NAME,
  });
}

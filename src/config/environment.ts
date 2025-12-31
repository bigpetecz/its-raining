/**
 * Environment Configuration
 * 
 * This module provides centralized access to all environment variables.
 * Environment variables should be prefixed with REACT_APP_ to be accessible in the browser.
 * 
 * .env file format:
 * REACT_APP_VAR_NAME=value
 */

export const ENV = {
  // Debug Logging
  DEBUG_LOG_ENABLED: process.env.REACT_APP_DEBUG_LOG === 'true',

  // UI Visibility
  SHOW_DECK: process.env.REACT_APP_SHOW_DECK === 'true',

  // Application Environment
  ENV_NAME: (process.env.REACT_APP_ENV as string | undefined) ?? 'development',

  // API Configuration (for future use)
  API_URL: process.env.REACT_APP_API_URL as string | undefined,
  API_TIMEOUT: parseInt((process.env.REACT_APP_API_TIMEOUT as string | undefined) ?? '5000', 10),

  // Feature Flags (for future use)
  FEATURE_MULTIPLAYER: process.env.REACT_APP_FEATURE_MULTIPLAYER === 'true',
  FEATURE_LEADERBOARD: process.env.REACT_APP_FEATURE_LEADERBOARD === 'true',
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

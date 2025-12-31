/**
 * Environment Configuration
 * 
 * This module provides centralized access to all environment variables.
 * Environment variables should be prefixed with NEXT_PUBLIC_ for Next.js
 * 
 * .env.local file format:
 * NEXT_PUBLIC_VAR_NAME=value
 * 
 * Note: Using process.env for Next.js (compatible with both server and client)
 */

export const ENV = {
  // Debug Logging
  DEBUG_LOG_ENABLED: process.env.NEXT_PUBLIC_DEBUG_LOG === 'true',

  // UI Visibility
  SHOW_DECK: process.env.NEXT_PUBLIC_SHOW_DECK === 'true',

  // Application Environment
  ENV_NAME: (process.env.NEXT_PUBLIC_ENV as string | undefined) ?? process.env.NODE_ENV ?? 'development',

  // API Configuration (for future use)
  API_URL: process.env.NEXT_PUBLIC_API_URL as string | undefined,
  API_TIMEOUT: parseInt((process.env.NEXT_PUBLIC_API_TIMEOUT as string | undefined) ?? '5000', 10),

  // Feature Flags (for future use)
  FEATURE_MULTIPLAYER: process.env.NEXT_PUBLIC_FEATURE_MULTIPLAYER === 'true',
  FEATURE_LEADERBOARD: process.env.NEXT_PUBLIC_FEATURE_LEADERBOARD === 'true',
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

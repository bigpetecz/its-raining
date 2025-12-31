import { ENV } from 'config/environment';

/**
 * Check if the debug log feature is enabled via environment variable.
 * Set REACT_APP_DEBUG_LOG=true to enable the game status log display.
 *
 * @returns true if REACT_APP_DEBUG_LOG is set to 'true', false otherwise
 */
export const isDebugLogEnabled = (): boolean => {
  return ENV.DEBUG_LOG_ENABLED;
};

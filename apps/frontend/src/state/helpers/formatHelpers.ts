import { GameContext } from 'state/context';

/**
 * Format draw info message suffix.
 * Shows how many cards need to be drawn.
 */
export const getDrawInfo = (context: GameContext): string =>
  context.mustDrawCards ? ` (Must draw ${context.consecutiveDrawCards} cards or play 7/K♠)` : '';

/**
 * Format color info message suffix.
 * Shows the currently selected color for Queens.
 */
export const getColorInfo = (context: GameContext): string =>
  context.selectedColor !== undefined ? ` (Color: ${context.selectedColor})` : '';

/**
 * Format skip info message suffix.
 * Shows if a player is skipped at game start.
 */
export const getSkipInfo = (playerName: string): string => ` (${playerName} is skipped)`;

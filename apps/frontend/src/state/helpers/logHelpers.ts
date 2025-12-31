import { GameContext, StatusLogEntry } from 'state/context';
import { ID } from 'type/player';

/**
 * Add a status log entry to the game context.
 * Tracks game events for UI display and debugging.
 *
 * @param context Current game context
 * @param message Human-readable message
 * @param playerId Optional player ID associated with the event
 * @returns Updated status log array
 */
export const addLogEntry = (
  context: GameContext,
  message: string,
  playerId?: ID,
): StatusLogEntry[] => [
  ...context.statusLog,
  {
    message,
    topCard: context.topCard,
    timestamp: Date.now(),
    playerId,
  },
];

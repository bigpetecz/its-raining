import { GameContext } from 'state/context';

/**
 * Guard: Check if game has a winner
 * True if any player has no cards in hand
 */
export const hasWinner = (context: GameContext): boolean => {
  return context.players.some(player => player.inHand.length === 0);
};

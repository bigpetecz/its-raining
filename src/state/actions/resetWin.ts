import { GameContext, initialGameContext } from 'state/context';
import { addLogEntry } from 'state/helpers/logHelpers';

/**
 * Action: RESET_GAME
 * Resets all game state back to initial values.
 * Used when transitioning from 'won' back to 'standby'.
 */
export const resetGameAction = (): Partial<GameContext> => initialGameContext;

/**
 * Action: SET_GAME_WINNER
 * Sets the winner when a player has no cards left in hand.
 * Adds winner message to status log.
 */
export const setGameWinnerAction = (context: GameContext): Partial<GameContext> => {
  const winner = context.players.find(player => player.inHand.length === 0);
  const winMessage = `${winner?.name} won!`;
  return {
    ...context,
    winner,
    gameStatus: winMessage,
    statusLog: addLogEntry(context, winMessage, winner?.id),
  };
};

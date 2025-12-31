import { GameContext } from 'state/context';
import findIndex from 'lodash/findIndex';
import { addLogEntry } from './logHelpers';
import { playerHasAce } from './playerHelpers';

/**
 * Get the next player index in rotation, handling skips.
 * @param currentIndex Current player index
 * @param playersLength Total number of players
 * @param skips Number of players to skip
 * @returns Next player index
 */
export const getNextPlayerIndex = (
  currentIndex: number,
  playersLength: number,
  skips = 0,
): number => {
  let nextIndex = currentIndex;
  
  // Skip players
  for (let i = 0; i <= skips; i++) {
    nextIndex = (nextIndex + 1) % playersLength;
  }
  
  return nextIndex;
};

/**
 * Advance the turn to the next player without triggering special mode.
 * Returns early if playerTurn is null, otherwise advances normally.
 * Used after draws and when no special card effects apply.
 */
export const advanceTurn = (context: GameContext): Partial<GameContext> => {
  if (context.playerTurn === null) {
    return {};
  }

  let nextPlayerIndex = findIndex(context.players, { id: context.playerTurn });

  // If draw penalty is active, next player must respond to it
  if (context.mustDrawCards === true) {
    nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
    const nextPlayer = context.players[nextPlayerIndex];
    const drawInfo = `(Must draw ${context.consecutiveDrawCards} cards or play 7/K♠)`;
    const drawPenaltyMessage = `${nextPlayer.name}'s turn ${drawInfo}`;
    return {
      playerTurn: nextPlayer.id,
      gameStatus: drawPenaltyMessage,
      statusLog: addLogEntry(context, drawPenaltyMessage, nextPlayer.id),
      awaitingAceResponse: false,
    };
  }

  // Skip players if needed (for other skip mechanics)
  let skipsRemaining = context.skippedPlayers;
  while (skipsRemaining > 0) {
    nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
    skipsRemaining--;
  }

  // Move to next player
  nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
  const nextPlayer = context.players[nextPlayerIndex];

  // Preserve selectedColor unless cleared by action
  const colorInfo = context.selectedColor !== undefined ? ` (Color: ${context.selectedColor})` : '';
  const nextTurnMessage = `${nextPlayer.name}'s turn${colorInfo}`;

  return {
    playerTurn: nextPlayer.id,
    skippedPlayers: 0,
    awaitingColorSelection: false,
    awaitingAceResponse: false,
    gameStatus: nextTurnMessage,
    statusLog: addLogEntry(context, nextTurnMessage, nextPlayer.id),
  };
};

/**
 * Handle Ace skip logic when an Ace is just played.
 * If next player has an Ace, give them a chance to respond.
 * Otherwise, skip them immediately.
 */
export const handleAceSkip = (context: GameContext): Partial<GameContext> => {
  if (context.playerTurn === null) {
    return {};
  }

  let nextPlayerIndex = findIndex(context.players, { id: context.playerTurn });
  nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
  const nextPlayer = context.players[nextPlayerIndex];

  // Check if the next player has an Ace before offering response option
  const hasAce = playerHasAce(nextPlayer);

  if (hasAce) {
    // Player has Ace - give them a chance to respond
    const aceResponseMessage = `${nextPlayer.name}'s turn - Can play Ace to avoid skip!`;
    return {
      playerTurn: nextPlayer.id,
      gameStatus: aceResponseMessage,
      statusLog: addLogEntry(context, aceResponseMessage, nextPlayer.id),
      awaitingAceResponse: true,
    };
  }

  // Player doesn't have Ace - skip them and advance to next player
  const skippedMessage = `${nextPlayer.name} is skipped! (No Ace to counter)`;
  let updatedStatusLog = addLogEntry(context, skippedMessage, nextPlayer.id);

  // Advance to the next player after the skipped one
  nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
  const finalNextPlayer = context.players[nextPlayerIndex];
  const finalMessage = `${finalNextPlayer.name}'s turn`;
  updatedStatusLog = [
    ...updatedStatusLog,
    {
      message: finalMessage,
      topCard: context.topCard,
      timestamp: Date.now(),
      playerId: finalNextPlayer.id,
    },
  ];

  return {
    playerTurn: finalNextPlayer.id,
    gameStatus: finalMessage,
    statusLog: updatedStatusLog,
    awaitingAceResponse: false,
    awaitingColorSelection: false,
    skippedPlayers: 0,
  };
};

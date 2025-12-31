import { GameContext } from 'state/context';
import { CardColor, SpecialCardType } from 'type/card';
import { isSpecialCard } from 'utils/gameRules';
import { advanceTurn, handleAceSkip } from 'state/helpers/turnHelpers';
import { addLogEntry } from 'state/helpers/logHelpers';
import findIndex from 'lodash/findIndex';

/**
 * Event for selecting color (Queen)
 */
export interface SelectColorEvent {
  color: CardColor;
}

/**
 * Action: EVALUATE_MOVE
 * Validates that the card play is legal based on game rules.
 * Returns updated gameStatus with error message if move is invalid.
 */
export const evaluateMoveAction = (context: GameContext): Partial<GameContext> => {
  // Note: Actual validation is done in utils/gameRules.isValidMove()
  // This action just handles the state update if validation fails.
  // The validation itself happens in a guard, so invalid moves won't reach here.
  return { ...context };
};

/**
 * Action: PROCESS_TURN
 * Handles special card effects after a card is played.
 * Routes to appropriate state based on card type:
 * - Ace: Check if next player can respond
 * - Queen: Wait for color selection
 * - Other: Advance to next player
 */
export const processTurnAction = (context: GameContext): Partial<GameContext> => {
  if (context.playerTurn === null) {
    return { ...context };
  }

  const nextPlayerIndex = findIndex(context.players, { id: context.playerTurn });
  const specialType = context.topCard !== null ? isSpecialCard(context.topCard) : null;

  // If player played an Ace during Ace response phase, check if next player can respond
  if (specialType === SpecialCardType.Ace && context.awaitingAceResponse === true) {
    return { ...context, ...handleAceSkip(context) };
  }

  // If Ace was just played (not during response phase), handle the skip
  if (specialType === SpecialCardType.Ace && context.awaitingAceResponse === false) {
    return { ...context, ...handleAceSkip(context) };
  }

  // If Queen was played and we're NOT already waiting for color selection,
  // set awaiting color selection for the current player (who played the Queen)
  if (
    specialType === SpecialCardType.Queen &&
    context.awaitingColorSelection === false
  ) {
    const colorSelectionMessage = `${context.players[nextPlayerIndex]?.name} is selecting color...`;
    return {
      ...context,
      awaitingColorSelection: true,
      gameStatus: colorSelectionMessage,
      statusLog: addLogEntry(context, colorSelectionMessage, context.players[nextPlayerIndex]?.id),
    };
  }

  // Otherwise, advance to next player normally
  return { ...context, ...advanceTurn(context) };
};

/**
 * Action: ADVANCE_TURN_AFTER_DRAW
 * Advances turn after drawing without triggering special mode.
 * Used specifically after DRAW_CARD action.
 */
export const advanceTurnAfterDrawAction = (context: GameContext): Partial<GameContext> => {
  return advanceTurn(context);
};

/**
 * Action: SELECT_COLOR
 * Handles Queen color selection and advances to next player.
 * Color selection happens for the current player (who played Queen).
 */
export const selectColorAction = (
  context: GameContext,
  event: SelectColorEvent,
): Partial<GameContext> => {
  if (context.playerTurn === null) {
    return { ...context };
  }

  let nextPlayerIndex = findIndex(context.players, { id: context.playerTurn });
  const specialType = context.topCard !== null ? isSpecialCard(context.topCard) : null;

  // Handle Ace skip after color selection (if Queen was on top of Ace)
  let skipsRemaining = 0;
  if (specialType === SpecialCardType.Ace) {
    skipsRemaining = 1;
  }

  // Skip players if needed
  while (skipsRemaining > 0) {
    nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
    skipsRemaining--;
  }

  // Move to next player
  nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
  const nextPlayer = context.players[nextPlayerIndex];
  const colorSelectionCompleteMessage = `${nextPlayer.name} plays. Selected color: ${event.color}`;

  return {
    ...context,
    playerTurn: nextPlayer.id,
    selectedColor: event.color,
    awaitingColorSelection: false,
    gameStatus: colorSelectionCompleteMessage,
    statusLog: addLogEntry(context, colorSelectionCompleteMessage, nextPlayer.id),
  };
};

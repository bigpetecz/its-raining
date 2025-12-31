import { GameContext } from 'state/context';
import { Card } from 'type/card';
import { isValidMove } from 'utils/gameRules';

/**
 * Guard: Check if a card play is valid
 * Used before allowing PLAY_CARD action.
 * 
 * Validation checks if card can be played based on:
 * - Top card suit/number match
 * - Selected color (for Queens)
 * - Draw penalty stacking rules (7/K♠ on 7/K♠)
 *   * Only 7 of Spades can stack on King of Spades
 *   * Any 7 can stack on another 7
 * - Ace response rules
 */
export const isLegalMove = (
  context: GameContext,
  event: { card: Card; player: { name: string; id: string } },
): boolean => {
  if (context.topCard === null) {
    return false;
  }

  return isValidMove(
    event.card,
    context.topCard,
    context.selectedColor,
    context.mustDrawCards,
    context.awaitingAceResponse,
  );
};

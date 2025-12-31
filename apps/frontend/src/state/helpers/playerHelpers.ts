import { Player } from 'type/player';
import { SpecialCardType } from 'type/card';
import { isSpecialCard } from 'utils/gameRules';

/**
 * Check if a player has an Ace in their hand.
 * Used to determine if a player can respond to a skip.
 */
export const playerHasAce = (player: Player): boolean => {
  return player.inHand.some(card => isSpecialCard(card) === SpecialCardType.Ace);
};

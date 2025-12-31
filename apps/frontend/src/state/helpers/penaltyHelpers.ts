import { SpecialCardType } from 'type/card';

/**
 * Penalty configuration for special cards.
 * Maps card type to the number of cards to draw.
 */
export const PENALTY_CARDS = {
  [SpecialCardType.Seven]: 2,
  [SpecialCardType.KingOfSpades]: 4,
} as const;

/**
 * Get the draw penalty for a special card type.
 * Returns the number of cards that should be drawn.
 */
export const getPenaltyCards = (cardType: SpecialCardType | null): number => {
  if (cardType === null || cardType === undefined) {
    return 0;
  }

  const penalty = PENALTY_CARDS[cardType as keyof typeof PENALTY_CARDS];
  return penalty !== undefined ? penalty : 0;
};

/**
 * Check if a card type causes a draw penalty.
 */
export const isPenaltyCard = (cardType: SpecialCardType | null): boolean => {
  return cardType === SpecialCardType.Seven || cardType === SpecialCardType.KingOfSpades;
};

/**
 * Check if a card can initiate a penalty (only Seven and King of Spades).
 */
export const canInitiatePenalty = (cardType: SpecialCardType | null): boolean => {
  return cardType === SpecialCardType.Seven || cardType === SpecialCardType.KingOfSpades;
};

/**
 * Calculate the draw penalty when a card is played.
 * Stacking rules:
 * - Seven can stack on another Seven or on King of Spades
 * - King of Spades can only be stacked by Seven of Spades (not by other Sevens)
 * - King of Spades can initiate a new penalty if no penalty is active
 */
export const calculateDrawPenalty = (
  playedCardType: SpecialCardType | null,
  currentPenalty: number,
  isPenaltyActive: boolean,
  isSevenOfSpades = false,
): number => {
  if (!isPenaltyCard(playedCardType)) {
    return 0;
  }

  const cardPenalty = getPenaltyCards(playedCardType);

  // If penalty is active, stack the new penalty on top
  if (isPenaltyActive) {
    // Only 7 can stack with other 7s
    if (playedCardType === SpecialCardType.Seven) {
      return currentPenalty + cardPenalty;
    }
    // Only 7 of Spades can stack on King of Spades
    if (playedCardType === SpecialCardType.KingOfSpades && isSevenOfSpades) {
      return currentPenalty + cardPenalty;
    }
    // Otherwise, return 0 (card cannot be played during penalty)
    return 0;
  }

  // Otherwise, start a new penalty
  return cardPenalty;
};

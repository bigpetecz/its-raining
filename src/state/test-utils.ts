import { Card, CardColor, CardValue } from 'type/card';
import { Player } from 'type/player';

/**
 * Test utility functions for creating test data
 */

export const createTestCard = (
  value: CardValue,
  color: CardColor,
  index = 0,
): Card => ({
  index,
  color,
  symbol: {
    value,
    numericValue: getNumericValue(value),
  },
});

const getNumericValue = (value: CardValue): number => {
  switch (value) {
    case CardValue.Seven:
      return 7;
    case CardValue.Eight:
      return 8;
    case CardValue.Nine:
      return 9;
    case CardValue.Ten:
      return 10;
    case CardValue.Jack:
      return 11;
    case CardValue.Queen:
      return 12;
    case CardValue.King:
      return 13;
    case CardValue.Ace:
      return 14;
  }
};

export const createTestPlayer = (
  id: string,
  name: string,
  inHand: Card[] = [],
): Player => ({
  id,
  name,
  color: 'blue',
  inHand,
});

/**
 * Create a test card of each special type
 */
export const getTestCards = () => ({
  sevenHearts: createTestCard(CardValue.Seven, CardColor.Hearts, 0),
  sevenDiamonds: createTestCard(CardValue.Seven, CardColor.Diamonds, 1),
  kingSpades: createTestCard(CardValue.King, CardColor.Spades, 2),
  kingHearts: createTestCard(CardValue.King, CardColor.Hearts, 3),
  queenHearts: createTestCard(CardValue.Queen, CardColor.Hearts, 4),
  queenDiamonds: createTestCard(CardValue.Queen, CardColor.Diamonds, 5),
  aceHearts: createTestCard(CardValue.Ace, CardColor.Hearts, 6),
  aceDiamonds: createTestCard(CardValue.Ace, CardColor.Diamonds, 7),
  nineHearts: createTestCard(CardValue.Nine, CardColor.Hearts, 8),
  nineDiamonds: createTestCard(CardValue.Nine, CardColor.Diamonds, 9),
  tenHearts: createTestCard(CardValue.Ten, CardColor.Hearts, 10),
  tenDiamonds: createTestCard(CardValue.Ten, CardColor.Diamonds, 11),
});

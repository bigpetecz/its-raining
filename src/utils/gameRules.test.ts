import { Card, CardColor, CardValue, SpecialCardType } from 'type/card';
import { 
  isSpecialCard, 
  isValidMove, 
  getDrawCount, 
  canStackSpecialCard,
  getCardDescription 
} from './gameRules';

// Helper function to create a test card
const createCard = (value: CardValue, color: CardColor): Card => ({
  symbol: {
    value,
    numericValue: value === CardValue.Seven ? 7 : value === CardValue.Eight ? 8 : value === CardValue.Ace ? 14 : 12
  },
  color,
  index: 0
});

describe('gameRules - isSpecialCard', () => {
  it('should identify Seven as special card', () => {
    const card = createCard(CardValue.Seven, CardColor.Hearts);
    expect(isSpecialCard(card)).toBe(SpecialCardType.Seven);
  });

  it('should identify Ace as special card', () => {
    const card = createCard(CardValue.Ace, CardColor.Spades);
    expect(isSpecialCard(card)).toBe(SpecialCardType.Ace);
  });

  it('should identify Queen as special card', () => {
    const card = createCard(CardValue.Queen, CardColor.Diamonds);
    expect(isSpecialCard(card)).toBe(SpecialCardType.Queen);
  });

  it('should identify King of Spades as special card', () => {
    const card = createCard(CardValue.King, CardColor.Spades);
    expect(isSpecialCard(card)).toBe(SpecialCardType.KingOfSpades);
  });

  it('should NOT identify King of other colors as special card', () => {
    const card = createCard(CardValue.King, CardColor.Hearts);
    expect(isSpecialCard(card)).toBeNull();
  });

  it('should NOT identify regular cards as special cards', () => {
    const card = createCard(CardValue.Eight, CardColor.Hearts);
    expect(isSpecialCard(card)).toBeNull();
  });
});

describe('gameRules - isValidMove', () => {
  describe('Normal play (no draw penalty)', () => {
    it('should allow playing card with same color', () => {
      const played = createCard(CardValue.Eight, CardColor.Hearts);
      const top = createCard(CardValue.Ten, CardColor.Hearts);
      expect(isValidMove(played, top, undefined, false)).toBe(true);
    });

    it('should allow playing card with same value/rank', () => {
      const played = createCard(CardValue.Eight, CardColor.Hearts);
      const top = createCard(CardValue.Eight, CardColor.Spades);
      expect(isValidMove(played, top, undefined, false)).toBe(true);
    });

    it('should allow playing Queen always', () => {
      const played = createCard(CardValue.Queen, CardColor.Spades);
      const top = createCard(CardValue.Eight, CardColor.Hearts);
      expect(isValidMove(played, top, undefined, false)).toBe(true);
    });

    it('should allow playing 7 on same color', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Hearts);
      const top = createCard(CardValue.Eight, CardColor.Hearts);
      expect(isValidMove(played7, top, undefined, false)).toBe(true);
    });

    it('should NOT allow playing 7 on different color when top is not a 7', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Hearts);
      const top = createCard(CardValue.Eight, CardColor.Spades);
      expect(isValidMove(played7, top, undefined, false)).toBe(false);
    });

    it('should allow playing 7 on any 7 regardless of color', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Hearts);
      const top7 = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(played7, top7, undefined, false)).toBe(true);
    });

    it('should allow playing 7 of different color on 7 of any color', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Diamonds);
      const top7 = createCard(CardValue.Seven, CardColor.Clubs);
      expect(isValidMove(played7, top7, undefined, false)).toBe(true);
    });

    it('should allow playing Ace only on same color', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Clubs);
      const top = createCard(CardValue.Eight, CardColor.Clubs);
      expect(isValidMove(playedAce, top, undefined, false)).toBe(true);
    });

    it('should NOT allow playing Ace on different color in normal play', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Clubs);
      const top = createCard(CardValue.Eight, CardColor.Hearts);
      expect(isValidMove(playedAce, top, undefined, false)).toBe(false);
    });

    it('should allow playing Ace on any Ace', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Clubs);
      const topAce = createCard(CardValue.Ace, CardColor.Hearts);
      expect(isValidMove(playedAce, topAce, undefined, false)).toBe(true);
    });

    it('should allow playing King of Spades only on Spades', () => {
      const playedKing = createCard(CardValue.King, CardColor.Spades);
      const top = createCard(CardValue.Eight, CardColor.Spades);
      expect(isValidMove(playedKing, top, undefined, false)).toBe(true);
    });

    it('should NOT allow playing King of Spades on other colors', () => {
      const playedKing = createCard(CardValue.King, CardColor.Spades);
      const top = createCard(CardValue.Eight, CardColor.Hearts);
      expect(isValidMove(playedKing, top, undefined, false)).toBe(false);
    });

    it('should respect selected color from Queen', () => {
      const played = createCard(CardValue.Eight, CardColor.Hearts);
      const top = createCard(CardValue.Queen, CardColor.Spades);
      const selectedColor = CardColor.Hearts;
      expect(isValidMove(played, top, selectedColor, false)).toBe(true);
    });
  });

  describe('Draw penalty phase (stacking)', () => {
    it('should allow playing 7 on another 7 during stacking', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Hearts);
      const top7 = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(played7, top7, undefined, true)).toBe(true);
    });

    it('should allow playing 7 of Spades on King of Spades when 7 of Spades is played', () => {
      // Only 7 of Spades can stack on King of Spades
      const played7OfSpades = createCard(CardValue.Seven, CardColor.Spades);
      const kingOfSpades = createCard(CardValue.King, CardColor.Spades);
      expect(isValidMove(played7OfSpades, kingOfSpades, undefined, true)).toBe(true);
    });

    it('should NOT allow playing 7 of other colors on King of Spades during stacking', () => {
      const played7Hearts = createCard(CardValue.Seven, CardColor.Hearts);
      const kingOfSpades = createCard(CardValue.King, CardColor.Spades);
      expect(isValidMove(played7Hearts, kingOfSpades, undefined, true)).toBe(false);
    });

    it('should NOT allow playing 7 of Diamonds on King of Spades during stacking', () => {
      const played7Diamonds = createCard(CardValue.Seven, CardColor.Diamonds);
      const kingOfSpades = createCard(CardValue.King, CardColor.Spades);
      expect(isValidMove(played7Diamonds, kingOfSpades, undefined, true)).toBe(false);
    });

    it('should NOT allow playing 7 of Clubs on King of Spades during stacking', () => {
      const played7Clubs = createCard(CardValue.Seven, CardColor.Clubs);
      const kingOfSpades = createCard(CardValue.King, CardColor.Spades);
      expect(isValidMove(played7Clubs, kingOfSpades, undefined, true)).toBe(false);
    });

    it('should NOT allow playing King of Spades on 7 during stacking', () => {
      const playedKing = createCard(CardValue.King, CardColor.Spades);
      const top7 = createCard(CardValue.Seven, CardColor.Hearts);
      expect(isValidMove(playedKing, top7, undefined, true)).toBe(false);
    });

    it('should NOT allow playing regular cards during stacking', () => {
      const played = createCard(CardValue.Eight, CardColor.Hearts);
      const top = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(played, top, undefined, true)).toBe(false);
    });

    it('should NOT allow playing Ace during stacking', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Hearts);
      const top = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(playedAce, top, undefined, true, false)).toBe(false);
    });

    it('should NOT allow playing Queen during stacking', () => {
      const playedQueen = createCard(CardValue.Queen, CardColor.Hearts);
      const top = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(playedQueen, top, undefined, true, false)).toBe(false);
    });
  });

  describe('Ace response phase (awaitingAceResponse)', () => {
    it('should allow playing any Ace during Ace response phase', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Spades);
      const topAce = createCard(CardValue.Ace, CardColor.Hearts);
      expect(isValidMove(playedAce, topAce, undefined, false, true)).toBe(true);
    });

    it('should allow playing Ace of selected color after Queen color selection', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Hearts);
      const topQueen = createCard(CardValue.Queen, CardColor.Spades);
      const selectedColor = CardColor.Hearts;
      expect(isValidMove(playedAce, topQueen, selectedColor, false, false)).toBe(true);
    });

    it('should NOT allow playing Ace of different color after Queen color selection', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Spades);
      const topQueen = createCard(CardValue.Queen, CardColor.Hearts);
      const selectedColor = CardColor.Hearts;
      // Ace must match the selected color in normal play
      expect(isValidMove(playedAce, topQueen, selectedColor, false, false)).toBe(false);
    });

    it('should allow playing Ace of different color during Ace response phase', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Diamonds);
      const topAce = createCard(CardValue.Ace, CardColor.Clubs);
      expect(isValidMove(playedAce, topAce, undefined, false, true)).toBe(true);
    });

    it('should NOT allow playing non-Ace cards during Ace response phase', () => {
      const played = createCard(CardValue.Eight, CardColor.Hearts);
      const top = createCard(CardValue.Ace, CardColor.Spades);
      expect(isValidMove(played, top, undefined, false, true)).toBe(false);
    });

    it('should NOT allow playing Queen during Ace response phase', () => {
      const playedQueen = createCard(CardValue.Queen, CardColor.Hearts);
      const top = createCard(CardValue.Ace, CardColor.Spades);
      expect(isValidMove(playedQueen, top, undefined, false, true)).toBe(false);
    });

    it('should NOT allow playing Seven during Ace response phase', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Hearts);
      const top = createCard(CardValue.Ace, CardColor.Spades);
      expect(isValidMove(played7, top, undefined, false, true)).toBe(false);
    });
  });
});

describe('gameRules - getDrawCount', () => {
  it('should return 2 cards for Seven', () => {
    const seven = createCard(CardValue.Seven, CardColor.Hearts);
    expect(getDrawCount(seven, 0)).toBe(2);
  });

  it('should return 4 cards for King of Spades', () => {
    const king = createCard(CardValue.King, CardColor.Spades);
    expect(getDrawCount(king, 0)).toBe(4);
  });

  it('should return 0 for regular cards', () => {
    const card = createCard(CardValue.Eight, CardColor.Hearts);
    expect(getDrawCount(card, 0)).toBe(0);
  });

  it('should stack draw counts correctly', () => {
    const seven = createCard(CardValue.Seven, CardColor.Hearts);
    expect(getDrawCount(seven, 2)).toBe(4); // 2 existing + 2 new
  });

  it('should stack Seven and King of Spades counts', () => {
    const king = createCard(CardValue.King, CardColor.Spades);
    expect(getDrawCount(king, 2)).toBe(6); // 2 existing + 4 new
  });
});

describe('gameRules - canStackSpecialCard', () => {
  it('should allow stacking Seven on Seven', () => {
    const seven1 = createCard(CardValue.Seven, CardColor.Hearts);
    const seven2 = createCard(CardValue.Seven, CardColor.Spades);
    expect(canStackSpecialCard(seven1, seven2)).toBe(true);
  });

  it('should allow stacking Seven of Spades on King of Spades', () => {
    const sevenSpades = createCard(CardValue.Seven, CardColor.Spades);
    const kingOfSpades = createCard(CardValue.King, CardColor.Spades);
    expect(canStackSpecialCard(sevenSpades, kingOfSpades)).toBe(true);
  });

  it('should NOT allow stacking Seven of Hearts on King of Spades', () => {
    const sevenHearts = createCard(CardValue.Seven, CardColor.Hearts);
    const kingOfSpades = createCard(CardValue.King, CardColor.Spades);
    expect(canStackSpecialCard(sevenHearts, kingOfSpades)).toBe(false);
  });

  it('should NOT allow stacking Seven of Diamonds on King of Spades', () => {
    const sevenDiamonds = createCard(CardValue.Seven, CardColor.Diamonds);
    const kingOfSpades = createCard(CardValue.King, CardColor.Spades);
    expect(canStackSpecialCard(sevenDiamonds, kingOfSpades)).toBe(false);
  });

  it('should NOT allow stacking Seven of Clubs on King of Spades', () => {
    const sevenClubs = createCard(CardValue.Seven, CardColor.Clubs);
    const kingOfSpades = createCard(CardValue.King, CardColor.Spades);
    expect(canStackSpecialCard(sevenClubs, kingOfSpades)).toBe(false);
  });

  it('should NOT allow stacking King of Spades on King of Spades', () => {
    const king1 = createCard(CardValue.King, CardColor.Spades);
    const king2 = createCard(CardValue.King, CardColor.Spades);
    expect(canStackSpecialCard(king1, king2)).toBe(false);
  });

  it('should NOT allow stacking King of Spades on Seven', () => {
    const king = createCard(CardValue.King, CardColor.Spades);
    const seven = createCard(CardValue.Seven, CardColor.Hearts);
    expect(canStackSpecialCard(king, seven)).toBe(false);
  });

  it('should NOT allow stacking regular cards', () => {
    const eight = createCard(CardValue.Eight, CardColor.Hearts);
    const nine = createCard(CardValue.Nine, CardColor.Spades);
    expect(canStackSpecialCard(eight, nine)).toBe(false);
  });
});

describe('gameRules - getCardDescription', () => {
  it('should describe Seven correctly', () => {
    const seven = createCard(CardValue.Seven, CardColor.Hearts);
    expect(getCardDescription(seven)).toContain('7');
    expect(getCardDescription(seven)).toContain('2 karty');
  });

  it('should describe Ace correctly', () => {
    const ace = createCard(CardValue.Ace, CardColor.Spades);
    expect(getCardDescription(ace)).toContain('A');
    expect(getCardDescription(ace)).toContain('vynechává');
  });

  it('should describe Queen correctly', () => {
    const queen = createCard(CardValue.Queen, CardColor.Diamonds);
    expect(getCardDescription(queen)).toContain('Q');
    expect(getCardDescription(queen)).toContain('barvu');
  });

  it('should describe King of Spades correctly', () => {
    const king = createCard(CardValue.King, CardColor.Spades);
    expect(getCardDescription(king)).toContain('K');
    expect(getCardDescription(king)).toContain('4 karty');
  });

  it('should describe regular cards correctly', () => {
    const eight = createCard(CardValue.Eight, CardColor.Hearts);
    expect(getCardDescription(eight)).toContain('8');
  });
});

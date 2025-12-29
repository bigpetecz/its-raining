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
    expect(isSpecialCard(card)).toBe(SpecialCardType.KingOfClubs);
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

    it('should allow playing 7 only on same color', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Hearts);
      const top = createCard(CardValue.Eight, CardColor.Hearts);
      expect(isValidMove(played7, top, undefined, false)).toBe(true);
    });

    it('should NOT allow playing 7 on different color', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Hearts);
      const top = createCard(CardValue.Eight, CardColor.Spades);
      expect(isValidMove(played7, top, undefined, false)).toBe(false);
    });

    it('should allow playing Ace only on same color', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Clubs);
      const top = createCard(CardValue.Eight, CardColor.Clubs);
      expect(isValidMove(playedAce, top, undefined, false)).toBe(true);
    });

    it('should NOT allow playing Ace on different color (unless it is an Ace)', () => {
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
    it('should allow playing 7 with any color during stacking', () => {
      const played7 = createCard(CardValue.Seven, CardColor.Hearts);
      const top = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(played7, top, undefined, true)).toBe(true);
    });

    it('should allow playing King of Spades with any color during stacking', () => {
      const playedKing = createCard(CardValue.King, CardColor.Spades);
      const top = createCard(CardValue.Seven, CardColor.Hearts);
      expect(isValidMove(playedKing, top, undefined, true)).toBe(true);
    });

    it('should NOT allow playing regular cards during stacking', () => {
      const played = createCard(CardValue.Eight, CardColor.Hearts);
      const top = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(played, top, undefined, true)).toBe(false);
    });

    it('should NOT allow playing Ace during stacking', () => {
      const playedAce = createCard(CardValue.Ace, CardColor.Hearts);
      const top = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(playedAce, top, undefined, true)).toBe(false);
    });

    it('should NOT allow playing Queen during stacking', () => {
      const playedQueen = createCard(CardValue.Queen, CardColor.Hearts);
      const top = createCard(CardValue.Seven, CardColor.Spades);
      expect(isValidMove(playedQueen, top, undefined, true)).toBe(false);
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

  it('should allow stacking King of Spades on King of Spades', () => {
    const king1 = createCard(CardValue.King, CardColor.Spades);
    const king2 = createCard(CardValue.King, CardColor.Spades);
    expect(canStackSpecialCard(king1, king2)).toBe(true);
  });

  it('should NOT allow stacking Seven on King of Spades', () => {
    const seven = createCard(CardValue.Seven, CardColor.Hearts);
    const king = createCard(CardValue.King, CardColor.Spades);
    expect(canStackSpecialCard(seven, king)).toBe(false);
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

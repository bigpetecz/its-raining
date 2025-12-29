interface CardSymbol {
    value: CardValue;
    numericValue: number;
}

export enum CardColor {
    Hearts = '♥︎',
    Spades = '♠︎',
    Diamonds = '♦︎',
    Clubs = '♣︎'
}

export enum CardValue {
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K',
    Ace = 'A'
}

export enum SpecialCardType {
    Seven = 'SEVEN_DRAW_2',        // Draw 2 cards (stackable)
    Ace = 'ACE_SKIP',               // Skip next player
    Queen = 'QUEEN_CHANGE_COLOR',   // Change color
    KingOfClubs = 'KING_CLUBS_DRAW_4' // Draw 4 cards
}

export const cardNumericValue = {
    [CardValue.Seven]: 7,
    [CardValue.Eight]: 8,
    [CardValue.Nine]: 9,
    [CardValue.Ten]: 10,
    [CardValue.Jack]: 11,
    [CardValue.Queen]: 12,
    [CardValue.King]: 13,
    [CardValue.Ace]: 14
}

export interface Card {
    symbol: CardSymbol;
    color: CardColor;
    index: number;
}

export const getCardSymbol = (value: CardValue): CardSymbol => ({
    value,
    numericValue: cardNumericValue[value]    
})
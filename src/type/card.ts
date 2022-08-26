interface CardSymbol {
    value: CardValue;
    numericValue: number;
}
// srdce, piky, kara, trefy (listy)
export enum CardColor {
    Hearts = '♥︎',
    Spades = '♠︎',
    Diamonds = '♦︎',
    Clubs = '♣︎'
};
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
}
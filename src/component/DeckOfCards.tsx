import React from 'react';
import { useSelector } from 'react-redux';
import { selectDeck } from 'store/deck';
import { CardColor } from 'type/card';

export const DeckOfCards: React.FC = () => {
    const deck = useSelector(selectDeck);
    return (
        <>
            <ul>
                {deck.cards.map(card => <li style={{color: [CardColor.Hearts, CardColor.Diamonds].includes(card.color) ? 'red' : 'black'}} key={`${card.color}${card.symbol.numericValue}`}>{card.color} {card.symbol.value}</li>)}
            </ul>
        </>
    )
}
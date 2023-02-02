import React from 'react';
import { Card, CardColor } from 'type/card';

interface DeckOfCardsProps { cards: Card[], title: string}

export const DeckOfCards: React.FC<DeckOfCardsProps> = ({
    title,
    cards
}) => {
    return (
        <>
            <div><strong>{title}:</strong> ({cards.length} cards)</div>
            <ul>
                {cards.map(card => <li style={{ color: [CardColor.Hearts, CardColor.Diamonds].includes(card.color) ? 'red' : 'black' }} key={`${card.color}${card.symbol.numericValue}`}>{card.color} {card.symbol.value} ({card.index})</li>)}
            </ul>
        </>
    )
}
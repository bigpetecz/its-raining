import React from 'react';
import { Card, CardColor } from 'type/card';
import { Player } from 'type/player';

interface PlayersProps {
    playerTurn: string | null,
    playCard: (card: Card, player: Player) => void,
    players: Player[]
}

export const Players: React.FC<PlayersProps> = ({
    players,
    playCard,
    playerTurn
}) => {
    return (
        <>
            {players.map((player, index) => <div key={player.name} style={{color: player.color}}>
                <strong>Player {index+1}: </strong> {player.name} ({player.inHand.length} cards) {playerTurn === player.id ? '(Turn)' : ''}
                <ul>
                    {player.inHand.map(card => <li 
                        style={{color: [CardColor.Hearts, CardColor.Diamonds].includes(card.color) ? 'red' : 'black'}} 
                        key={`${player.id}${card.color}${card.symbol.numericValue}`}
                    >
                        {playerTurn === player.id ? <a style={{ cursor: 'pointer' }} onClick={() => playCard(card, player)}>{card.color} {card.symbol.value} ({card.index})</a>: <>{card.color} {card.symbol.value} ({card.index})</>}
                    </li>)}
                </ul>
                </div>)}
        </>
    )
}
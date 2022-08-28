import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from 'store/players';
import { CardColor } from 'type/card';

export const Players: React.FC = () => {
    const players = useSelector(selectPlayers);
    return (
        <>
            {players.inGame.map((player, index) => <div key={player.name} style={{color: player.color}}>
                <strong>Player {index+1}: </strong> {player.name}
                <ul>
                    {player.inHand.map(card => <li 
                        style={{color: [CardColor.Hearts, CardColor.Diamonds].includes(card.color) ? 'red' : 'black'}} 
                        key={`${player.id}${card.color}${card.symbol.numericValue}`}
                    >{card.color} {card.symbol.value}</li>)}
                </ul>
                </div>)}
        </>
    )
}
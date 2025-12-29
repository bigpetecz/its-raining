import React from 'react';
import { Card, CardColor } from 'type/card';
import { Player } from 'type/player';
import { isValidMove } from 'utils/gameRules';

interface PlayersProps {
    playerTurn: string | null,
    playCard: (card: Card, player: Player) => void,
    drawCard: (player: Player) => void,
    players: Player[],
    topCard: Card | null,
    awaitingColorSelection: boolean,
    onSelectColor: (color: CardColor) => void,
    mustDrawCards: boolean
}

export const Players: React.FC<PlayersProps> = ({
    players,
    playCard,
    drawCard,
    playerTurn,
    topCard,
    awaitingColorSelection,
    onSelectColor,
    mustDrawCards
}) => {
    const canPlayCard = (card: Card): boolean => {
        return topCard !== null && isValidMove(card, topCard, undefined, mustDrawCards);
    }

    const colorOptions = Object.values(CardColor);

    return (
        <>
            {players.map((player, index) => {
                const isPlayerTurn = playerTurn === player.id;
                const isWaitingForColor = awaitingColorSelection === true && isPlayerTurn === true;
                const canPlay = isPlayerTurn === true && topCard !== null && awaitingColorSelection === false;
                const hasValidMove = canPlay === true && player.inHand.some(canPlayCard);

                return (
                    <div key={player.name} style={{
                        color: player.color,
                        padding: '10px',
                        border: isPlayerTurn === true ? '2px solid gold' : '1px solid #ccc',
                        borderRadius: '5px',
                        marginBottom: '10px'
                    }}>
                        <strong>Player {index+1}: </strong> {player.name} ({player.inHand.length} cards) {isPlayerTurn === true ? '👈 (Turn)' : ''}
                        
                        {isWaitingForColor === true && (
                            <div style={{
                                backgroundColor: '#fffacd',
                                padding: '10px',
                                borderRadius: '5px',
                                marginTop: '10px',
                                marginBottom: '10px'
                            }}>
                                <p><strong>Zvolte barvu pro Dámu:</strong></p>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {colorOptions.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => onSelectColor(color)}
                                            style={{
                                                fontSize: '16px',
                                                padding: '8px 12px',
                                                backgroundColor: '#fff',
                                                border: '2px solid #333',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                color: [CardColor.Hearts, CardColor.Diamonds].includes(color) === true ? 'red' : 'black',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isPlayerTurn === true && hasValidMove === false && awaitingColorSelection === false && (
                            <div style={{color: 'red', marginTop: '5px'}}>
                                <button onClick={() => drawCard(player)}>
                                    Draw Card
                                </button>
                            </div>
                        )}
                        <ul>
                            {player.inHand.map(card => {
                                const isValid = canPlayCard(card);
                                return (
                                    <li 
                                        key={`${player.id}${card.color}${card.symbol.numericValue}`}
                                        style={{
                                            color: [CardColor.Hearts, CardColor.Diamonds].includes(card.color) === true ? 'red' : 'black',
                                            opacity: canPlay === true && isValid === false ? 0.5 : 1,
                                            cursor: canPlay === true && isValid === true ? 'pointer' : 'default'
                                        }}
                                    >
                                        {canPlay === true && isValid === true ? (
                                            <a style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => playCard(card, player)}>
                                                {card.color} {card.symbol.value}
                                            </a>
                                        ) : (
                                            <>{card.color} {card.symbol.value}</>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </>
    )
}
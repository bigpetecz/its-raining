import React from 'react';
import { Card as CardType, CardColor } from 'type/card';
import { Player } from 'type/player';
import { isValidMove } from 'utils/gameRules';
import { Card } from './Card';
import styles from './PlayerHand.module.css';

interface PlayerHandProps {
  player: Player;
  topCard: CardType | null;
  isPlayerTurn: boolean;
  onPlayCard: (card: CardType) => void;
  mustDrawCards: boolean;
  selectedColor?: CardColor;
  awaitingAceResponse?: boolean;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  topCard,
  isPlayerTurn,
  onPlayCard,
  mustDrawCards,
  selectedColor,
  awaitingAceResponse,
}) => {
  const canPlayCard = (card: CardType): boolean => {
    return (
      topCard !== null &&
      isValidMove(card, topCard, selectedColor, mustDrawCards, awaitingAceResponse)
    );
  };

  if (player.inHand.length === 0) {
    return (
      <div className={styles.emptyHand}>
        Hand is empty
      </div>
    );
  }

  return (
    <div className={styles.playerHand}>
      {player.inHand.map((card) => {
        const isValid = canPlayCard(card);
        const isPlayable = isPlayerTurn && topCard !== null && isValid;

        return (
          <Card
            key={`${player.id}${card.color}${card.symbol.numericValue}`}
            card={card}
            isPlayable={isPlayable}
            disabled={isPlayerTurn === false || topCard === null}
            onClick={() => isPlayable && onPlayCard(card)}
          />
        );
      })}
    </div>
  );
};

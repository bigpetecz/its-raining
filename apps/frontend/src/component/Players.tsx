import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType, CardColor } from 'type/card';
import { Player } from 'type/player';
import { PlayerHand } from './PlayerHand';
import { ColorSelector } from './ColorSelector';
import styles from './Players.module.css';

interface PlayersProps {
  playerTurn: string | null;
  playCard: (card: CardType, player: Player) => void;
  drawCard: (player: Player) => void;
  players: Player[];
  topCard: CardType | null;
  awaitingColorSelection: boolean;
  onSelectColor: (color: CardColor) => void;
  mustDrawCards: boolean;
  selectedColor?: CardColor;
  awaitingAceResponse?: boolean;
}

export const Players: React.FC<PlayersProps> = ({
  players,
  playCard,
  drawCard,
  playerTurn,
  topCard,
  awaitingColorSelection,
  onSelectColor,
  mustDrawCards,
  selectedColor,
  awaitingAceResponse,
}) => {
  return (
    <div className={styles.playerContainer}>
      <ColorSelector isOpen={awaitingColorSelection} onSelectColor={onSelectColor} />
      {players.map((player, index) => {
        const isPlayerTurn = playerTurn === player.id;
        const isWaitingForColor =
          awaitingColorSelection === true && isPlayerTurn === true;

        return (
          <motion.div
            key={player.id}
            className={`${styles.playerCard} ${
              isPlayerTurn === true ? styles.active : ''
            }`}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.playerHeader}>
              <div className={styles.playerName}>
                {isPlayerTurn === true && (
                  <span className={styles.turnIndicator} />
                )}
                <span>
                  Player {index + 1}: {player.name}
                </span>
              </div>
              <div className={styles.headerRight}>
                <div className={styles.cardCount}>
                  {player.inHand.length} cards
                </div>
                {isPlayerTurn === true && awaitingColorSelection === false && (
                  <motion.button
                    className={styles.drawButton}
                    onClick={() => drawCard(player)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Draw Card
                  </motion.button>
                )}
              </div>
            </div>

            <PlayerHand
              player={player}
              topCard={topCard}
              isPlayerTurn={isPlayerTurn && !isWaitingForColor}
              onPlayCard={(card) => playCard(card, player)}
              mustDrawCards={mustDrawCards}
              selectedColor={selectedColor}
              awaitingAceResponse={awaitingAceResponse}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
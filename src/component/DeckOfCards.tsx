import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardColor } from 'type/card';
import styles from './DeckOfCards.module.css';

interface DeckOfCardsProps {
  cards: Card[];
  title: string;
}

export const DeckOfCards: React.FC<DeckOfCardsProps> = ({ title, cards }) => {
  const isRed = (color: CardColor) =>
    [CardColor.Hearts, CardColor.Diamonds].includes(color);

  if (cards.length === 0) {
    return (
      <div className={styles.deckContainer}>
        <div className={styles.deckTitle}>
          {title}
          <span className={styles.deckCardCount}>0 cards</span>
        </div>
        <div className={styles.emptyDeck}>Deck is empty</div>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.deckContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.deckTitle}>
        {title}
        <span className={styles.deckCardCount}>{cards.length} cards</span>
      </div>
      <ul className={styles.cardList}>
        {cards.map((card) => (
          <motion.li
            key={`${card.color}${card.symbol.numericValue}`}
            className={styles.cardListItem}
            style={{
              color: isRed(card.color) === true ? '#d32f2f' : '#000',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {card.color} {card.symbol.value} (idx: {card.index})
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
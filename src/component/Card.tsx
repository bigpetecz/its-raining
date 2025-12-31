import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType, CardColor } from 'type/card';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  isPlayable = false,
  onClick,
  disabled = false,
}) => {
  const isRed = [CardColor.Hearts, CardColor.Diamonds].includes(card.color);
  const colorClass = isRed === true ? styles.red : styles.black;

  return (
    <motion.div
      className={`${styles.card} ${isPlayable ? styles.playable : ''} ${disabled ? styles.disabled : ''}`}
      onClick={() => !disabled && onClick?.()}
      whileHover={!disabled ? { scale: 1.05, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${styles.symbol} ${colorClass}`}>{card.color}</div>
      <div className={`${styles.value} ${colorClass}`}>{card.symbol.value}</div>
    </motion.div>
  );
};

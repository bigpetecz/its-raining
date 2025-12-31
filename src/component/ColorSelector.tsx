import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardColor } from 'type/card';
import styles from './ColorSelector.module.css';

interface ColorSelectorProps {
  isOpen: boolean;
  onSelectColor: (color: CardColor) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  isOpen,
  onSelectColor,
}) => {
  const colorOptions = Object.values(CardColor);
  const isRed = (color: CardColor) =>
    [CardColor.Hearts, CardColor.Diamonds].includes(color);

  return (
    <AnimatePresence>
      {isOpen === true && (
        <motion.div
          className={styles.colorSelectorOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.currentTarget === e.target}
        >
          <motion.div
            className={styles.colorSelectorDialog}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className={styles.title}>Select a Color</div>
            <div className={styles.colorGrid}>
              {colorOptions.map((color) => (
                <motion.button
                  key={color}
                  className={`${styles.colorButton} ${
                    isRed(color) === true ? styles.red : styles.black
                  }`}
                  onClick={() => onSelectColor(color)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {color}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

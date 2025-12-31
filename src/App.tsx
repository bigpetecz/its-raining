import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DeckOfCards } from 'component/DeckOfCards';
import { Players } from 'component/Players';
import { Card } from 'component/Card';
import { GameStatusLog } from 'component/GameStatusLog';
import { useMachine } from '@xstate/react';
import { gameMachine } from 'state';
import { Card as CardType, CardColor } from 'type/card';
import { Player } from 'type/player';
import { ENV } from 'config/environment';
import styles from './App.module.css';

const App: React.FC = () => {
  const [state, send] = useMachine(gameMachine);

  useEffect(() => {
    send({
      type: 'START_GAME',
      players: [
        {
          id: '1',
          name: 'Petr',
          color: 'blue',
          inHand: [],
        },
        {
          id: '2',
          name: 'Andrea',
          color: 'green',
          inHand: [],
        },
      ],
    } as Parameters<typeof send>[0]);
  }, [send]);

  useEffect(() => {
    if (state.matches('won') === true) {
      alert(`${state.context.winner?.name} won!`);
    }
  }, [state]);

  const playCard = (card: CardType, player: Player) => {
    send({ type: 'PLAY_CARD', card, player } as Parameters<typeof send>[0]);
  };

  const drawCard = (player: Player) => {
    send({ type: 'DRAW_CARD', player } as Parameters<typeof send>[0]);
  };

  const selectColor = (color: CardColor) => {
    send({ type: 'SELECT_COLOR', color } as Parameters<typeof send>[0]);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.playersSection}>
        <Players
          playerTurn={state.context.playerTurn}
          players={state.context.players}
          playCard={playCard}
          drawCard={drawCard}
          topCard={state.context.topCard}
          awaitingColorSelection={state.context.awaitingColorSelection}
          onSelectColor={selectColor}
          mustDrawCards={state.context.mustDrawCards}
          selectedColor={state.context.selectedColor}
          awaitingAceResponse={state.context.awaitingAceResponse}
        />
      </div>

      <div className={styles.gameStateSection}>
        <div className={styles.topCardContainer}>
          <div className={styles.topCardTitle}>Top Card</div>
          {state.context.topCard !== null ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <Card card={state.context.topCard} />
            </motion.div>
          ) : (
            <div style={{ color: '#999', fontStyle: 'italic' }}>
              No top card yet
            </div>
          )}
        </div>

        <div className={styles.gameLogSection}>
          <GameStatusLog logs={state.context.statusLog} />
        </div>

        {ENV.SHOW_DECK && (
          <div className={styles.deckSection}>
            <DeckOfCards title="Deck" cards={state.context.deck} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

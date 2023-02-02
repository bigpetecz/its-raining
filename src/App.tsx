import React, { useEffect } from 'react';
import { DeckOfCards } from 'component/DeckOfCards';
import { Players } from 'component/Players';
import { useMachine } from '@xstate/react';
import { gameMachine } from 'state';
import { Card } from 'type/card';
import { Player } from 'type/player';

const App: React.FC = () => {

  // React.useEffect(() => {
  //   dispatch(prepareDeck());
  //   dispatch(shuffleDeck());
  //   dispatch(addPlayer({
  //     id: '1',
  //     name: 'Petr',
  //     color: 'blue',
  //     inHand: []
  //   }));
  //   dispatch(clearHand('1'));
  //   dispatch(addPlayer({
  //     id: '2',
  //     name: 'Andrea',
  //     color: 'green',
  //     inHand: [],
  //   }));
  //   dispatch(clearHand('2'));
  //   dispatch(setPlayerTurn('1'));
  //   dispatch(dealCards());
  // }, [dispatch]);

  const [state, send] = useMachine(gameMachine);

  useEffect(() => {
    send('START_GAME', { players: [{
          id: '1',
          name: 'Petr',
          color: 'blue',
          inHand: []
        },{
          id: '2',
          name: 'Andrea',
          color: 'green',
          inHand: [],
        }]});
  }, []);

  const playCard = (card: Card, player: Player) =>  {
    send('PLAY_CARD', { card, player });
  }

  return (
    <div style={{display: 'flex'}}>
      <Players playerTurn={state.context.playerTurn} players={state.context.players} playCard={playCard} />
      <DeckOfCards title="Game" cards={state.context.game} />
      <DeckOfCards title="Deck" cards={state.context.deck} />
      <DeckOfCards title="All cards" cards={state.context.allCards} />
    </div>
  );
}

export default App;

import React from 'react';
import { DeckOfCards } from 'component/DeckOfCards';
import { Players } from 'component/Players';
import { useMachine } from '@xstate/react';
import { createGameMachine } from 'state';
import { createDeck } from 'utils/cards';

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

  const [state, send] = useMachine(createGameMachine(createDeck()));

  return (
    <>
      <Players />
      <DeckOfCards />
    </>
  );
}

export default App;

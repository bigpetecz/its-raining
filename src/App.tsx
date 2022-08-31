import React from 'react';
import { DeckOfCards } from 'component/DeckOfCards';
import { useAppDispatch } from 'store/hook';
import { dealCards, prepareDeck, shuffleDeck } from 'store/deck';
import { addPlayer, clearHand, setPlayerTurn } from 'store/players';
import { Players } from 'component/Players';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(prepareDeck());
    dispatch(shuffleDeck());
    dispatch(addPlayer({
      id: '1',
      name: 'Petr',
      color: 'blue',
      inHand: []
    }));
    dispatch(clearHand('1'));
    dispatch(addPlayer({
      id: '2',
      name: 'Andrea',
      color: 'green',
      inHand: [],
    }));
    dispatch(clearHand('2'));
    dispatch(setPlayerTurn('1'));
    dispatch(dealCards());
  }, [dispatch]);

  return (
    <>
      <Players />
      <DeckOfCards />
    </>
  );
}

export default App;

import React from 'react';
import { DeckOfCards } from 'component/DeckOfCards';
import { useAppDispatch } from 'store/hook';
import { prepareDeck, shuffleDeck } from 'store/deck';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(prepareDeck);
    dispatch(shuffleDeck);
  }, [dispatch]);

  return (
    <>
      <DeckOfCards />
    </>
  );
}

export default App;

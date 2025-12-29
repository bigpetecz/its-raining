import React, { useEffect } from 'react';
import { DeckOfCards } from 'component/DeckOfCards';
import { Players } from 'component/Players';
import { useMachine } from '@xstate/react';
import { gameMachine } from 'state';
import { Card, CardColor } from 'type/card';
import { Player } from 'type/player';

const App: React.FC = () => {
  const [state, send] = useMachine(gameMachine);

  useEffect(() => {
    send({ type: 'START_GAME', players: [{
          id: '1',
          name: 'Petr',
          color: 'blue',
          inHand: []
        },{
          id: '2',
          name: 'Andrea',
          color: 'green',
          inHand: [],
        }] } as Parameters<typeof send>[0]);
  }, [send]);

  useEffect(() => {
    if(state.matches('won') === true) {
      alert(`${state.context.winner?.name} vyhrál/a!`);
    }
  },[state]);

  const playCard = (card: Card, player: Player) =>  {
    send({ type: 'PLAY_CARD', card, player } as Parameters<typeof send>[0]);
  }

  const drawCard = (player: Player) => {
    send({ type: 'DRAW_CARD', player } as Parameters<typeof send>[0]);
  }

  const selectColor = (color: CardColor) => {
    send({ type: 'SELECT_COLOR', color } as Parameters<typeof send>[0]);
  }

  return (
    <div style={{display: 'flex', gap: '20px', padding: '20px'}}>
      <div style={{flex: 1}}>
        <div style={{marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px'}}>
          <strong>Status:</strong> {state.context.gameStatus}
        </div>
        <Players 
          playerTurn={state.context.playerTurn} 
          players={state.context.players} 
          playCard={playCard}
          drawCard={drawCard}
          topCard={state.context.topCard}
          awaitingColorSelection={state.context.awaitingColorSelection}
          onSelectColor={selectColor}
          mustDrawCards={state.context.mustDrawCards}
        />
      </div>
      <div style={{flex: 1}}>
        <div style={{marginBottom: '20px'}}>
          <h3>Top Card:</h3>
          {state.context.topCard !== null ? (
            <div style={{
              fontSize: '24px',
              padding: '20px',
              backgroundColor: '#fff',
              border: '2px solid #ccc',
              borderRadius: '5px',
              textAlign: 'center',
              color: ['♥︎', '♦︎'].includes(state.context.topCard.color) === true ? 'red' : 'black'
            }}>
              {state.context.topCard.color} {state.context.topCard.symbol.value}
            </div>
          ) : null}
        </div>
        <DeckOfCards title="Deck" cards={state.context.deck} />
      </div>
    </div>
  );
}

export default App;

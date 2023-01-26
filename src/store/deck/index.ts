import { createSelector, createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { concat, concatMap, exhaustMap, filter, map, merge, mergeMap, of, tap, withLatestFrom } from 'rxjs'

import { shuffle } from 'utils/array'
import { RootState } from 'store'
import { addCardsToPlayer, selectPlayers, setNextPlayerTurn } from 'store/players'
import { Card, CardColor, cardNumericValue, CardValue } from 'type/card'

interface DeckState {
  cards: Card[],
  playedCards?: Card[],
}

const initialState: DeckState = {
  cards: [],
}

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    prepareDeck: (state) => {
      state.cards = Object.values(CardColor)
        .flatMap(color => Object.values(CardValue).map(value => ({
            color,
            symbol: {
                value,
                numericValue: cardNumericValue[value]
            }
        })))
    },
    shuffleDeck: (state) => {
        state.cards = shuffle(state.cards);
    },
    dealCards: (_state) => {
        
    },
    drawCards: (_state, _action: PayloadAction<{ playerId: string, count: number }>) => {

    },
    removeCards: (state, action: PayloadAction<number>) => {
      state.cards = [ ...state.cards.slice(action.payload, state.cards.length)]
    }
  },
});

export const { prepareDeck, shuffleDeck, dealCards, drawCards, removeCards } = deckSlice.actions

export const selectDeck = (state: RootState) => state.deck
export const selectTopCards = createSelector(
  [
    selectDeck,
    (_state, count) => count,
  ],
  (deck, count) => deck.cards.slice(0, count),
);

export const deckReducer = deckSlice.reducer

export const deckEpic = (action$: any, state$: any) => action$.pipe(
  filter(dealCards.match),
  exhaustMap(() => {
    // const players = selectPlayers(state$.value);

    // return of(...players.inGame.flatMap((player, index) => {
    //   return drawCards({ playerId: player.id, count: index === 0 ? 5 : 4})
    // }));
    return of(drawCards({ playerId: '1', count: 5}),drawCards({ playerId: '2', count: 4}));
  })
);

export const drawFromDeckEpic = (action$: any, state$: any) => action$.pipe(
  filter(drawCards.match),
  concatMap((action: any) => {
    const cards = selectTopCards(state$.value, action.payload.count);

    console.log(state$.value.deck.cards);

    return of(
      addCardsToPlayer({playerId: action.payload.playerId, cards}),
      removeCards(action.payload.count),
      setNextPlayerTurn()
    );
  }),
);

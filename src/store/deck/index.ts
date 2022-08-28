import { createSlice } from '@reduxjs/toolkit'
import { shuffle } from 'helper/array'
import { filter, from, map, merge, mergeMap, of } from 'rxjs'
import { RootState } from 'store'
import { addCardsToPlayer, selectPlayers} from 'store/players'
import { Card, CardColor, cardNumericValue, CardValue, getCardSymbol } from 'type/card'

interface DeckState {
  cards: Card[]
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
            color: color,
            symbol: {
                value,
                numericValue: cardNumericValue[value]
            }
        })))
    },
    shuffleDeck: (state) => {
        state.cards = shuffle(state.cards);
    },
    dealCards: (state) => {
        
    },
  },
});



export const { prepareDeck, shuffleDeck, dealCards } = deckSlice.actions
export const selectDeck = (state: RootState) => state.deck
export const deckReducer = deckSlice.reducer

export const deckEpic = (action$: any, state: any) => action$.pipe(
  filter(dealCards.match),
  mergeMap(() => {
    const players = selectPlayers(state.value);

    return merge(...players.inGame.map(player => {
        const cards: Card[] = [{ color: CardColor.Clubs, symbol: getCardSymbol(CardValue.Ace)}];
        return of(addCardsToPlayer({playerId: player.id, cards}));
    }));
  })
);

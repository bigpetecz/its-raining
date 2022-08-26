import { createSlice } from '@reduxjs/toolkit'
import { shuffle } from 'helper/array'
import { RootState } from 'store'
import { Card, CardColor, cardNumericValue, CardValue } from 'type/card'

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
        state.cards = shuffle([...state.cards]);
    },
  },
})

export const { prepareDeck, shuffleDeck } = deckSlice.actions
export const selectDeck = (state: RootState) => state.deck
export const deckReducer = deckSlice.reducer
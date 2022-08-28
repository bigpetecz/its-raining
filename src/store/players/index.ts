import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { Card } from 'type/card'
import { Player } from 'type/player'

interface PlayersState {
  inGame: Player[]
}

const initialState: PlayersState = {
  inGame: [],
}

export const deckSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<Player>) => {
        if (state.inGame.find(player => player.name === action.payload.name) === undefined) {
          state.inGame = [...state.inGame, action.payload];
        } else {
          //throw new Error(`Player with name '${action.payload.name}' is already in the game.`);
        }
    },
    addCardsToPlayer: (state, action: PayloadAction<{ playerId: string, cards: Card[]}>) => {
      state.inGame = state.inGame.map(player => {
        if (player.id === action.payload.playerId) {

          return {
            ...player,
            inHand: [...player.inHand, ...action.payload.cards]
          }
        }

        return player;
      });
    },
    playerMove: (state, action: PayloadAction<{ playerId: string, card: Card}>) => {

    }
  },
})

export const { addPlayer, addCardsToPlayer, playerMove } = deckSlice.actions
export const selectPlayers = (state: RootState) => state.players
export const playersReducer = deckSlice.reducer
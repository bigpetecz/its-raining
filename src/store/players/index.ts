import { createSelector, createSlice, current, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from 'store'
import { Card } from 'type/card'
import { ID, Player } from 'type/player'

interface PlayersState {
  inGame: Player[],
  inTurn?: ID,
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
    clearHand: (state, action: PayloadAction<string>) => {
      state.inGame = state.inGame.map(player => {
        if (player.id === action.payload) {

          return {
            ...player,
            inHand: []
          }
        }

        return player;
      });
    },
    playerMove: (state, action: PayloadAction<{ playerId: string, card: Card}>) => {

    },
    setPlayerTurn: (state, action: PayloadAction<ID>) => {
      state.inTurn = action.payload;
    },
    setNextPlayerTurn: (state) => {
      const currentPlayerIndex = state.inGame.findIndex(player => player.id === state.inTurn);
      const nextPlayer = state.inGame.length >= (currentPlayerIndex + 1) ? state.inGame[currentPlayerIndex + 1] : state.inGame[0];
      // console.log(currentPlayerIndex, state.inGame.length, current(nextPlayer));
      state.inTurn = nextPlayer.id;
    }
  },
})

export const { addPlayer, addCardsToPlayer, clearHand, playerMove, setNextPlayerTurn, setPlayerTurn } = deckSlice.actions
export const selectPlayers = (state: RootState) => state.players
export const selectPlayerInTurn = createSelector(selectPlayers, players => players.inTurn);
export const playersReducer = deckSlice.reducer
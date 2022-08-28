import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware } from 'redux-observable';
import { deckReducer } from 'store/deck'
import { rootEpic } from 'store/epic';
import { playersReducer } from 'store/players'

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    deck: deckReducer,
    players: playersReducer
  },
  middleware: [epicMiddleware]
})

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
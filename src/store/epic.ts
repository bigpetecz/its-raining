import { combineEpics } from "redux-observable";
import { deckEpic } from "store/deck";

export const rootEpic = combineEpics(
    deckEpic
);
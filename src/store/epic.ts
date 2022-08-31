import { combineEpics } from "redux-observable";
import { deckEpic, drawFromDeckEpic } from "store/deck";

export const rootEpic = combineEpics(
    deckEpic,
    drawFromDeckEpic,
);
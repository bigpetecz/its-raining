import { Card } from "type/card";
import { ID, Player } from "type/player";
import { shuffle } from "utils/array";
import { createDeck } from "utils/cards";
import { assign, createMachine } from "xstate";

const id = 'prsi';

interface GameContext {
  players: Player[],
  playedIndexes: number[],
  packageIndexes: number[],
  allCards: Card[],
  deck: Card[],
  game: Card[],
  playerTurn: ID | null
}

type GameEvent =
| {
  type: 'PLAY_CARD',
  playerId: ID;
  card: Card;
} | {
  type: 'DRAW_CARD';
  playerId: ID;
  count: number;
} | {
  type: 'START_GAME';
  players: Player[];
} | {
  type: 'RESET_GAME';
}

export const gameMachine = createMachine<GameContext>({
  id,
  initial: 'standby',
  context: {
    players: [],
    playedIndexes: [],
    packageIndexes: [],
    allCards: [],
    game: [],
    deck: [],
    playerTurn: null,
  },
  states: {
    standby: {
      type: 'atomic',
      on: {
        START_GAME: {
          target: 'playing',
          actions: 'start',
        },
      },
    },
    playing: {
      initial: 'playerTurn',
      type: 'compound',
      states: {
        playerTurn: {
          on: {
            '': {
              target: `#${id}.won`,
              cond: (context, event) => context.players.find(player => player.id === event.playerId)?.handIndexes.length === 0,
            },
            PLAY_CARD: {
              target: 'playerTurn',
              actions: 'playCard',
            },
            DRAW_CARD: {
              target: 'playerTurn',
              actions: 'drawCard'
            }
          }
        },
      },
    },
    won: {
      type: 'atomic',
      on: {
        RESET_GAME: {
          target: 'standby',
          actions: 'reset',
        },
      },
    },
  },
},
{
  actions: {
    start: assign((context, event) => {
      const allCards = shuffle(createDeck()).map((card, index) => ({...card, index}));
      const players = event.players;

      let cardDealt = 0;

      do {
        for (let i = 0; i < players.length; i++) {
          const start = allCards.length-1-cardDealt;
          const end = allCards.length-cardDealt;

          players[i].inHand = [
            ...players[i].inHand,
            ...allCards.slice(start, end)
          ];

          cardDealt++
        }
      } while (players[0].inHand.length <= 3);

      const game = allCards.slice(allCards.length-1-cardDealt, allCards.length-cardDealt);
      const deck = allCards.slice(0, allCards.length-1-cardDealt);

      return {
        ...context,
        allCards,
        deck,
        game,
        players,
        playerTurn: players[0]?.id
      }
    }),
    reset: assign((_context) => ({
      players: [],
      playedIndexes: [],
      packageIndexes: [],
      allCards: []
    })),
    playCard: assign((context, event) => {
      return {
        ...context,
      }
    }),
    drawCard: assign((context, event) => {
      return {
        ...context,
      }
    }),
  },
});
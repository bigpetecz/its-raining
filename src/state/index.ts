import { Card } from 'type/card';
import { ID, Player } from 'type/player';
import { shuffle } from 'utils/array';
import { createDeck } from 'utils/cards';
import { assign, createMachine } from 'xstate';
import findIndex from 'lodash/findIndex';

const id = 'prsi';

interface GameContext {
  players: Player[];
  playedIndexes: number[];
  packageIndexes: number[];
  allCards: Card[];
  deck: Card[];
  game: Card[];
  playerTurn: ID | null;
  winner?: Player;
}

type PlayCardEvent = {
  type: 'PLAY_CARD';
  player: Player;
  card: Card;
};
type DrawCardEvent = {
  type: 'DRAW_CARD';
  player: Player;
  count: number;
};
type StartGameEvent = {
  type: 'START_GAME';
  players: Player[];
};
type ResetGameEvent = {
  type: 'RESET_GAME';
};

export const gameMachine = createMachine<GameContext>(
  {
    id,
    context: {
      players: [],
      playedIndexes: [],
      packageIndexes: [],
      allCards: [],
      game: [],
      deck: [],
      playerTurn: null,
    },
    initial: 'standby',
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
                cond: (context, event) =>
                  context.players.find(
                    (player) => player.inHand.length === 0,
                  ) !== undefined,
                actions: ['setGameWinner'],
              },
              PLAY_CARD: {
                target: 'playerTurn',
                actions: 'playCard',
              },
              DRAW_CARD: {
                target: 'playerTurn',
                actions: 'drawCard',
              },
            },
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
        const allCards = shuffle(createDeck()).map((card, index) => ({
          ...card,
          index,
        }));
        const players = event.players;

        let cardDealt = 0;

        do {
          for (let i = 0; i < players.length; i++) {
            const start = allCards.length - 1 - cardDealt;
            const end = allCards.length - cardDealt;

            players[i].inHand = [
              ...players[i].inHand,
              ...allCards.slice(start, end),
            ];

            cardDealt++;
          }
        } while (players[0].inHand.length <= 3);

        const game = allCards.slice(
          allCards.length - 1 - cardDealt,
          allCards.length - cardDealt,
        );
        const deck = allCards.slice(0, allCards.length - 1 - cardDealt);

        return {
          ...context,
          allCards,
          deck,
          game,
          players,
          playerTurn: players[0]?.id,
        };
      }),
      reset: assign((_context) => ({
        players: [],
        playedIndexes: [],
        packageIndexes: [],
        allCards: [],
      })),
      playCard: assign((context, event) => {
        const playerIndex = findIndex(context.players, { id: event.player.id });
        const playerTurn =
          context.players[playerIndex + 1] ?? context.players[0];

        context.players.splice(playerIndex, 1, {
          ...context.players[playerIndex],
          inHand: context.players[playerIndex].inHand.filter(
            (card) => card.index !== event.card.index,
          ),
        });
        return {
          ...context,
          game: [...context.game, event.card],
          playerTurn: playerTurn.id,
        };
      }),
      drawCard: assign((context, event) => {
        return {
          ...context,
        };
      }),
      setGameWinner: assign((context, event) => {
        return {
          ...context,
          winner: context.players.find((player) => player.inHand.length === 0),
        };
      }),
    },
  },
);

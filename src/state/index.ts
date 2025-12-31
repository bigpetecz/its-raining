import { assign, createMachine } from 'xstate';
// Types
import { GameContext, initialGameContext } from 'state/context';
import { Card, CardColor } from 'type/card';
import { Player } from 'type/player';
// Actions
import { startGameAction } from 'state/actions/gameStart';
import { playCardAction, drawCardAction } from 'state/actions/cardActions';
import { processTurnAction, advanceTurnAfterDrawAction, selectColorAction } from 'state/actions/turnActions';
import { setGameWinnerAction, resetGameAction } from 'state/actions/resetWin';
// Guards
import { hasWinner } from 'state/guards/gameValidation';
import { isLegalMove } from 'state/guards/cardValidation';

const id = 'prsi';

// Re-export types for backward compatibility
export type { StatusLogEntry } from 'state/context';
export type { GameContext };

/**
 * Game state machine for the card game Prší
 *
 * States:
 * - standby: Waiting for game to start
 * - playing: Game in progress (playerTurn is active)
 * - won: Game has a winner
 *
 * Events:
 * - START_GAME: Begin a new game
 * - PLAY_CARD: Player plays a card
 * - DRAW_CARD: Player draws cards
 * - SELECT_COLOR: Player selects color for Queen
 * - RESET_GAME: Reset to standby after win
 */
export const gameMachine = createMachine<GameContext>(
  {
    id,
    predictableActionArguments: true,
    context: initialGameContext,
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
                cond: hasWinner,
                actions: 'setGameWinner',
              },
              PLAY_CARD: [
                {
                  cond: 'isLegalMove',
                  target: 'playerTurn',
                  actions: ['playCard', 'evaluateMove', 'processTurn'],
                },
                {
                  target: 'playerTurn',
                  // Invalid move - stays in same state
                },
              ],
              DRAW_CARD: {
                target: 'playerTurn',
                actions: ['drawCard', 'advanceTurnAfterDraw'],
              },
              SELECT_COLOR: {
                actions: 'selectColor',
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
      start: assign((context, event: unknown) => startGameAction(context, event as { players: Player[] })),
      playCard: assign((context, event: unknown) => playCardAction(context, event as { player: { id: string }; card: Card })),
      evaluateMove: assign((context) => context), // Validation done in guard, no state changes needed
      processTurn: assign((context) => processTurnAction(context)),
      advanceTurnAfterDraw: assign((context) => advanceTurnAfterDrawAction(context)),
      drawCard: assign((context, event: unknown) => drawCardAction(context, event as { player: { id: string; name: string } })),
      selectColor: assign((context, event: unknown) => selectColorAction(context, event as { color: CardColor })),
      setGameWinner: assign((context) => setGameWinnerAction(context)),
      reset: assign(() => resetGameAction()),
    },
    guards: {
      isLegalMove: (context, event: unknown) => {
        const evt = event as { card: Card; player: { name: string; id: string } };
        return isLegalMove(context, evt);
      },
    },
  },
);

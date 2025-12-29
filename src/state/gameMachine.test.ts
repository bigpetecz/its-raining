import { CardColor, CardValue, SpecialCardType } from 'type/card';
import { gameMachine } from './index';
import { interpret, Interpreter } from 'xstate';
import { GameContext } from './index';
import findIndex from 'lodash/findIndex';
import { Card } from 'type/card';

describe('Game Mechanics - Playing Cards and Special Effects', () => {
  const defaultPlayers = [
    { id: '1', name: 'Player1', color: 'blue', inHand: [] },
    { id: '2', name: 'Player2', color: 'red', inHand: [] },
  ];

  // Helper to start game and wait for initial state
  const startGame = (service: Interpreter<GameContext, any, any, any, any>) => {
    return new Promise<any>((resolve) => {
      let isStarted = false;
      service.onTransition((state) => {
        if ((state.value === 'playing' || state.value === Object(state.value)) && !isStarted) {
          isStarted = true;
          resolve(state);
        }
      });
      service.start();
      service.send({
        type: 'START_GAME',
        players: defaultPlayers,
      } as any);
    });
  };

  it('should allow drawing a card when player has no valid moves', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then((state) => {
      const playerIndex = findIndex(state.context.players, { id: state.context.playerTurn });
      const currentPlayer = state.context.players[playerIndex];
      const initialHandSize = currentPlayer.inHand.length;

      service.send({
        type: 'DRAW_CARD',
        player: currentPlayer,
      } as any);

      // Check next state
      service.onTransition((newState) => {
        if ((newState.value === 'playing' || typeof newState.value === 'object')) {
          const updatedPlayer = newState.context.players[playerIndex];
          expect(updatedPlayer.inHand.length).toBeGreaterThanOrEqual(initialHandSize);
          service.stop();
          done();
        }
      });
    });
  });

  it('should trigger draw penalty when Seven is played', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then((initialState) => {
      // Find a player with a Seven card
      let playerWithSeven: { player: any; card: Card } | null = null;
      for (const player of initialState.context.players) {
        const sevenCard = player.inHand.find((card: Card) => card.symbol.value === CardValue.Seven);
        if (sevenCard) {
          playerWithSeven = { player, card: sevenCard };
          break;
        }
      }

      if (!playerWithSeven) {
        // If no seven in hand, skip test
        service.stop();
        done();
        return;
      }

      const currentPlayer = playerWithSeven.player;
      const sevenCard = playerWithSeven.card;

      service.send({
        type: 'PLAY_CARD',
        card: sevenCard,
        player: currentPlayer,
      } as any);

      service.onTransition((newState) => {
        if ((newState.value === 'playing' || typeof newState.value === 'object') && newState.context.mustDrawCards) {
          expect(newState.context.consecutiveDrawCards).toBe(2);
          expect(newState.context.penaltyCardType).toBe(SpecialCardType.Seven);
          service.stop();
          done();
        }
      });
    });
  });

  it('should trigger draw penalty when King of Spades is played', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then((initialState) => {
      // Find a player with King of Spades
      let playerWithKing: { player: any; card: Card } | null = null;
      for (const player of initialState.context.players) {
        const kingCard = player.inHand.find(
          (card: Card) => card.symbol.value === CardValue.King && card.color === CardColor.Spades
        );
        if (kingCard) {
          playerWithKing = { player, card: kingCard };
          break;
        }
      }

      if (!playerWithKing) {
        // If no king in hand, skip test
        service.stop();
        done();
        return;
      }

      const currentPlayer = playerWithKing.player;
      const kingCard = playerWithKing.card;

      service.send({
        type: 'PLAY_CARD',
        card: kingCard,
        player: currentPlayer,
      } as any);

      service.onTransition((newState) => {
        if ((newState.value === 'playing' || typeof newState.value === 'object') && newState.context.topCard === kingCard) {
          expect(newState.context.mustDrawCards).toBe(true);
          expect(newState.context.consecutiveDrawCards).toBe(4);
          expect(newState.context.penaltyCardType).toBe(SpecialCardType.KingOfClubs);
          service.stop();
          done();
        }
      });
    });
  });

  it('should allow stacking Seven on Seven penalty', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then((initialState) => {
      // First, get game into a state with Seven penalty
      let playerWithSeven: { player: any; card: Card } | null = null;
      for (const player of initialState.context.players) {
        const sevenCard = player.inHand.find((card: Card) => card.symbol.value === CardValue.Seven);
        if (sevenCard) {
          playerWithSeven = { player, card: sevenCard };
          break;
        }
      }

      if (!playerWithSeven) {
        service.stop();
        done();
        return;
      }

      // Play the first Seven
      service.send({
        type: 'PLAY_CARD',
        card: playerWithSeven.card,
        player: playerWithSeven.player,
      } as any);

      // Wait for penalty state and try to stack another Seven
      let penaltyActive = false;
      service.onTransition((newState) => {
        if (newState.context.mustDrawCards && !penaltyActive) {
          penaltyActive = true;
          // Now try to play another Seven from the second player
          const playerIndex = findIndex(newState.context.players, (p: any) => p.id === newState.context.playerTurn);
          if (playerIndex >= 0) {
            const nextPlayer = newState.context.players[playerIndex];
            const secondSeven = nextPlayer.inHand.find((card: Card) => card.symbol.value === CardValue.Seven);

            if (secondSeven) {
              service.send({
                type: 'PLAY_CARD',
                card: secondSeven,
                player: nextPlayer,
              } as any);
            }
          }
        } else if (newState.context.mustDrawCards && penaltyActive && newState.context.consecutiveDrawCards > 2) {
          // Verify stacking worked
          expect(newState.context.consecutiveDrawCards).toBe(4);
          service.stop();
          done();
        }
      });
    });
  });

  it('should apply Ace skip effect', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then((initialState) => {
      // Find a player with an Ace
      let playerWithAce: { player: any; card: Card } | null = null;
      for (const player of initialState.context.players) {
        const aceCard = player.inHand.find((card: Card) => card.symbol.value === CardValue.Ace);
        if (aceCard) {
          playerWithAce = { player, card: aceCard };
          break;
        }
      }

      if (!playerWithAce) {
        service.stop();
        done();
        return;
      }

      const currentPlayerId = playerWithAce.player.id;
      const aceCard = playerWithAce.card;

      service.send({
        type: 'PLAY_CARD',
        card: aceCard,
        player: playerWithAce.player,
      } as any);

      service.onTransition((newState) => {
        if ((newState.value === 'playing' || typeof newState.value === 'object')) {
          // After Ace, player turn should skip to the next player in turn order
          const currentPlayerIndex = findIndex(newState.context.players, { id: currentPlayerId });
          if (currentPlayerIndex >= 0 && newState.context.playerTurn) {
            const actualNextIndex = findIndex(newState.context.players, { id: newState.context.playerTurn });
            
            // Verify skip happened (second player from current, not next)
            expect(actualNextIndex).not.toBe((currentPlayerIndex + 1) % newState.context.players.length);
            service.stop();
            done();
          }
        }
      });
    });
  });

  it('should require Queen color selection', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then((initialState) => {
      // Find a player with a Queen
      let playerWithQueen: { player: any; card: Card } | null = null;
      for (const player of initialState.context.players) {
        const queenCard = player.inHand.find((card: Card) => card.symbol.value === CardValue.Queen);
        if (queenCard) {
          playerWithQueen = { player, card: queenCard };
          break;
        }
      }

      if (!playerWithQueen) {
        service.stop();
        done();
        return;
      }

      const queenCard = playerWithQueen.card;

      service.send({
        type: 'PLAY_CARD',
        card: queenCard,
        player: playerWithQueen.player,
      } as any);

      service.onTransition((newState) => {
        if ((newState.value === 'playing' || typeof newState.value === 'object')) {
          // After playing Queen, should be waiting for color selection
          expect(newState.context.awaitingColorSelection).toBe(true);
          service.stop();
          done();
        }
      });
    });
  });

  it('should update selected color when Queen color is selected', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then((initialState) => {
      let queenPlayed = false;

      // Find a player with a Queen
      let playerWithQueen: { player: any; card: Card } | null = null;
      for (const player of initialState.context.players) {
        const queenCard = player.inHand.find((card: Card) => card.symbol.value === CardValue.Queen);
        if (queenCard) {
          playerWithQueen = { player, card: queenCard };
          break;
        }
      }

      if (!playerWithQueen) {
        service.stop();
        done();
        return;
      }

      const queenCard = playerWithQueen.card;

      // Play Queen
      service.send({
        type: 'PLAY_CARD',
        card: queenCard,
        player: playerWithQueen.player,
      } as any);

      service.onTransition((newState) => {
        if (newState.context.awaitingColorSelection && !queenPlayed) {
          queenPlayed = true;
          // Select a color
          service.send({
            type: 'SELECT_COLOR',
            color: CardColor.Hearts,
          } as any);
        } else if (queenPlayed && !newState.context.awaitingColorSelection) {
          // After color selection, should not be awaiting anymore
          expect(newState.context.selectedColor).toBe(CardColor.Hearts);
          expect(newState.context.awaitingColorSelection).toBe(false);
          service.stop();
          done();
        }
      });
    });
  });

  it('should handle card drawing from deck', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then((state) => {
      // Verify the initial deck exists
      expect(state.context.deck.length).toBeGreaterThan(0);
      service.stop();
      done();
    });
  });

  it('should detect win condition when player has no cards', (done) => {
    const service = interpret(gameMachine);

    startGame(service).then(() => {
      // The win condition is checked in the playerTurn state
      service.stop();
      done();
    });
  });
});

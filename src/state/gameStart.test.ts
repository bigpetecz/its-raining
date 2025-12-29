import { CardColor, CardValue, SpecialCardType } from 'type/card';
import { gameMachine, GameContext } from './index';
import { interpret, Interpreter } from 'xstate';

describe('Game Start Scenarios', () => {
  const defaultPlayers = [
    { id: '1', name: 'Player1', color: 'blue', inHand: [] },
    { id: '2', name: 'Player2', color: 'red', inHand: [] },
  ];

  it('should start game with players', (done) => {
    const service = interpret(gameMachine);
    
    service.onTransition((state) => {
      if ((state.value === 'playing' || typeof state.value === 'object')) {
        expect(state.context.players.length).toBe(2);
        expect(state.context.playerTurn).toBe(defaultPlayers[0].id);
        expect(state.context.topCard).not.toBeNull();
        service.stop();
        done();
      }
    });

    service.start();
    service.send({
      type: 'START_GAME',
      players: defaultPlayers,
    } as any);
  });

  it('should handle Queen as starting card', (done) => {
    const service = interpret(gameMachine);
    let queenGameStarted = false;

    service.onTransition((state) => {
      if ((state.value === 'playing' || typeof state.value === 'object')) {
        // Inject a Queen as top card for testing
        if (state.context.topCard?.symbol.value === CardValue.Queen && !queenGameStarted) {
          expect(state.context.awaitingColorSelection).toBe(true);
          expect(state.context.selectedColor).not.toBeUndefined();
          queenGameStarted = true;
          service.stop();
          done();
        }
      }
    });

    service.start();
    service.send({
      type: 'START_GAME',
      players: defaultPlayers,
    } as any);
  });

  it('should handle Seven as starting card - first player in draw phase', (done) => {
    const service = interpret(gameMachine);
    let sevenGameStarted = false;

    service.onTransition((state) => {
      if ((state.value === 'playing' || typeof state.value === 'object')) {
        if (state.context.topCard?.symbol.value === CardValue.Seven && !sevenGameStarted) {
          expect(state.context.mustDrawCards).toBe(true);
          expect(state.context.consecutiveDrawCards).toBe(2);
          expect(state.context.penaltyCardType).toBe(SpecialCardType.Seven);
          expect(state.context.playerTurn).toBe(defaultPlayers[0].id);
          sevenGameStarted = true;
          service.stop();
          done();
        }
      }
    });

    service.start();
    service.send({
      type: 'START_GAME',
      players: defaultPlayers,
    } as any);
  });

  it('should handle King of Spades as starting card - first player must draw', (done) => {
    const service = interpret(gameMachine);
    let kingGameStarted = false;

    service.onTransition((state) => {
      if ((state.value === 'playing' || typeof state.value === 'object')) {
        if (
          state.context.topCard?.symbol.value === CardValue.King &&
          state.context.topCard?.color === CardColor.Spades &&
          !kingGameStarted
        ) {
          expect(state.context.mustDrawCards).toBe(true);
          expect(state.context.consecutiveDrawCards).toBe(4);
          expect(state.context.penaltyCardType).toBe(SpecialCardType.KingOfClubs);
          expect(state.context.playerTurn).toBe(defaultPlayers[0].id);
          kingGameStarted = true;
          service.stop();
          done();
        }
      }
    });

    service.start();
    service.send({
      type: 'START_GAME',
      players: defaultPlayers,
    } as any);
  });

  it('should handle Ace as starting card - first player skipped', (done) => {
    const service = interpret(gameMachine);
    let aceGameStarted = false;

    service.onTransition((state) => {
      if ((state.value === 'playing' || typeof state.value === 'object')) {
        if (state.context.topCard?.symbol.value === CardValue.Ace && !aceGameStarted) {
          // When Ace is starting card, second player should start
          expect(state.context.playerTurn).toBe(defaultPlayers[1].id);
          expect(state.context.gameStatus).toContain('vynechává');
          aceGameStarted = true;
          service.stop();
          done();
        }
      }
    });

    service.start();
    service.send({
      type: 'START_GAME',
      players: defaultPlayers,
    } as any);
  });

  it('should deal 4 cards to each player at start', (done) => {
    const service = interpret(gameMachine);

    service.onTransition((state) => {
      if ((state.value === 'playing' || typeof state.value === 'object')) {
        expect(state.context.players[0].inHand.length).toBeGreaterThanOrEqual(4);
        expect(state.context.players[1].inHand.length).toBeGreaterThanOrEqual(4);
        service.stop();
        done();
      }
    });

    service.start();
    service.send({
      type: 'START_GAME',
      players: defaultPlayers,
    } as any);
  });

  it('should have deck and game pile properly initialized', (done) => {
    const service = interpret(gameMachine);

    service.onTransition((state) => {
      if ((state.value === 'playing' || typeof state.value === 'object')) {
        expect(state.context.deck.length).toBeGreaterThan(0);
        expect(state.context.game.length).toBeGreaterThan(0);
        expect(state.context.allCards.length).toBe(32); // Standard deck without jokers
        service.stop();
        done();
      }
    });

    service.start();
    service.send({
      type: 'START_GAME',
      players: defaultPlayers,
    } as any);
  });

  it('should update game status message on start', (done) => {
    const service = interpret(gameMachine);

    service.onTransition((state) => {
      if ((state.value === 'playing' || typeof state.value === 'object')) {
        expect(state.context.gameStatus).not.toBe('');
        expect(state.context.gameStatus).toContain('začíná');
        service.stop();
        done();
      }
    });

    service.start();
    service.send({
      type: 'START_GAME',
      players: defaultPlayers,
    } as any);
  });
});

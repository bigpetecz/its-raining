import { GameContext } from 'state/context';
import { Card, SpecialCardType } from 'type/card';
import { isSpecialCard } from 'utils/gameRules';
import { shuffle } from 'utils/array';
import findIndex from 'lodash/findIndex';
import { addLogEntry } from 'state/helpers/logHelpers';
import { calculateDrawPenalty, isPenaltyCard } from 'state/helpers/penaltyHelpers';

/**
 * Event for playing a card (partial player data)
 */
export interface PlayCardEvent {
  player: { id: string };
  card: Card;
}

/**
 * Event for drawing cards (partial player data)
 */
export interface DrawCardEvent {
  player: { id: string; name: string };
}

/**
 * Action: PLAY_CARD
 * Handles removing card from player hand and adding to game pile.
 * Updates draw penalty if applicable.
 */
export const playCardAction = (
  context: GameContext,
  event: PlayCardEvent,
): Partial<GameContext> => {
  const playerIndex = findIndex(context.players, { id: event.player.id });

  // Remove card from player's hand
  context.players.splice(playerIndex, 1, {
    ...context.players[playerIndex],
    inHand: context.players[playerIndex].inHand.filter(
      card => card.index !== event.card.index,
    ),
  });

  // Add to game pile
  const game = [...context.game, event.card];
  const playedCardType = isSpecialCard(event.card);

  // Color selection is cleared when any card is played (except Queen)
  const selectedColor: typeof context.selectedColor = undefined;

  // Calculate draw penalty if special card was played
  let consecutiveDrawCards = context.consecutiveDrawCards;
  let mustDrawCards = context.mustDrawCards;
  let penaltyCardType = context.penaltyCardType;
  let awaitingAceResponse = context.awaitingAceResponse;

  if (isPenaltyCard(playedCardType)) {
    const newPenalty = calculateDrawPenalty(
      playedCardType,
      context.consecutiveDrawCards,
      context.mustDrawCards,
    );

    consecutiveDrawCards = newPenalty;
    mustDrawCards = newPenalty > 0;
    penaltyCardType = playedCardType ?? undefined; // Ensure we don't assign null
    awaitingAceResponse = false; // Exit Ace response phase when card is played
  } else if (playedCardType === SpecialCardType.Ace && awaitingAceResponse === true) {
    // Player played Ace during Ace response phase - they counter the skip
    // Keep awaitingAceResponse = true to signal processTurn to continue the chain
    consecutiveDrawCards = 0;
    mustDrawCards = false;
    penaltyCardType = undefined;
  } else {
    // Regular card played, clear all penalties and response phases
    consecutiveDrawCards = 0;
    mustDrawCards = false;
    penaltyCardType = undefined;
    awaitingAceResponse = false;
  }

  return {
    game,
    topCard: event.card,
    selectedColor,
    consecutiveDrawCards,
    mustDrawCards,
    penaltyCardType,
    awaitingAceResponse,
  };
};

/**
 * Action: DRAW_CARD
 * Handles drawing cards from deck, including deck recycling when empty.
 * Clears all penalties and awaiting states after drawing.
 */
export const drawCardAction = (
  context: GameContext,
  event: DrawCardEvent,
): Partial<GameContext> => {
  const playerIndex = findIndex(context.players, { id: event.player.id });
  let deck = [...context.deck];
  let gameCards = [...context.game];

  // Determine how many cards to draw
  const cardsToDraw = context.mustDrawCards ? context.consecutiveDrawCards : 1;
  const cardsToAdd: Card[] = [];

  // Draw cards from deck (with recycling)
  for (let i = 0; i < cardsToDraw; i++) {
    if (deck.length === 0) {
      // Recycle game pile if deck is empty
      if (gameCards.length > 1) {
        const topCard = gameCards[gameCards.length - 1];
        const restCards = gameCards.slice(0, -1);
        deck = shuffle([...restCards]);
        gameCards = [topCard];
      } else {
        // Not enough cards to draw
        break;
      }
    }

    if (deck.length > 0) {
      const card = deck.shift();
      if (card !== undefined) {
        cardsToAdd.push(card);
      }
    }
  }

  // Add drawn cards to player's hand
  context.players.splice(playerIndex, 1, {
    ...context.players[playerIndex],
    inHand: [...context.players[playerIndex].inHand, ...cardsToAdd],
  });

  const drawMessage = `${event.player.name} drew ${cardsToAdd.length} card${
    cardsToAdd.length > 1 ? 's' : ''
  }`;

  const updatedContext = {
    ...context,
    deck,
    game: gameCards,
    mustDrawCards: false,
    consecutiveDrawCards: 0,
    penaltyCardType: undefined,
    awaitingColorSelection: false,
    awaitingAceResponse: false,
    gameStatus: drawMessage,
  };

  return {
    ...updatedContext,
    statusLog: addLogEntry(updatedContext, drawMessage, event.player.id),
  };
};

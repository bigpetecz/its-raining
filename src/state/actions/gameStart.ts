import { GameContext, StatusLogEntry } from 'state/context';
import { SpecialCardType } from 'type/card';
import { Player } from 'type/player';
import { shuffle } from 'utils/array';
import { createDeck } from 'utils/cards';
import { isSpecialCard, selectRandomColor } from 'utils/gameRules';
import { addLogEntry } from 'state/helpers/logHelpers';
import { getSkipInfo } from 'state/helpers/formatHelpers';

/**
 * Action: START_GAME
 * Initializes the game with players, shuffles deck, deals cards, and sets up initial state.
 * Handles special cases for initial card (Queen, 7, K, Ace).
 */
export const startGameAction = (
  context: GameContext,
  event: { players: Player[] },
): Partial<GameContext> => {
  const allCards = shuffle(createDeck()).map((card, index) => ({
    ...card,
    index,
  }));
  const players: Player[] = event.players;

  let cardDealt = 0;

  // Deal cards to players (4 cards each)
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

  // Split deck and game pile
  const game = allCards.slice(
    allCards.length - 1 - cardDealt,
    allCards.length - cardDealt,
  );
  const deck = allCards.slice(0, allCards.length - 1 - cardDealt);
  const topCard = game.length > 0 ? game[game.length - 1] : null;

  // Handle Queen: automatically select a random color
  let selectedColor = undefined;
  let colorSelectionLog: StatusLogEntry | undefined = undefined;
  if (topCard !== null && isSpecialCard(topCard) === SpecialCardType.Queen) {
    selectedColor = selectRandomColor();
    colorSelectionLog = {
      message: `First card is Queen! ♛ Color automatically selected: ${selectedColor}`,
      topCard: topCard,
      timestamp: Date.now(),
    };
  }

  // Handle special initial cards (7, K, Ace)
  let mustDrawCards = false;
  let consecutiveDrawCards = 0;
  let penaltyCardType: SpecialCardType | undefined = undefined;
  let initialPlayerIndex = 0;

  if (topCard !== null) {
    const initialCardType = isSpecialCard(topCard);
    if (initialCardType === SpecialCardType.Seven) {
      mustDrawCards = true;
      consecutiveDrawCards = 2;
      penaltyCardType = SpecialCardType.Seven;
    } else if (initialCardType === SpecialCardType.KingOfSpades) {
      mustDrawCards = true;
      consecutiveDrawCards = 4;
      penaltyCardType = SpecialCardType.KingOfSpades;
    } else if (initialCardType === SpecialCardType.Ace) {
      // First player is skipped, second player starts
      initialPlayerIndex = 1;
    }
  }

  // Build initial status messages
  const startingPlayer = players[initialPlayerIndex];
  const colorInfo = selectedColor !== undefined ? ` (Color: ${selectedColor})` : '';
  const drawInfo = mustDrawCards ? ` (Must draw ${consecutiveDrawCards} cards or play 7/K♠)` : '';
  const skipInfo = initialPlayerIndex === 1 ? getSkipInfo(players[0]?.name) : '';
  const startMessage = `Game started! ${startingPlayer?.name} starts!${colorInfo}${drawInfo}${skipInfo}`;

  // Build initial log entries
  let initialStatusLog: StatusLogEntry[] = [];
  if (colorSelectionLog !== undefined) {
    initialStatusLog.push(colorSelectionLog);
  }

  const contextForLog = {
    ...context,
    topCard,
    selectedColor,
  };
  initialStatusLog = [
    ...initialStatusLog,
    ...addLogEntry(contextForLog, startMessage, startingPlayer?.id),
  ];

  return {
    allCards,
    deck,
    game,
    players,
    playerTurn: startingPlayer?.id,
    topCard,
    selectedColor,
    mustDrawCards,
    consecutiveDrawCards,
    penaltyCardType,
    gameStatus: startMessage,
    statusLog: initialStatusLog,
  };
};

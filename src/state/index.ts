import { Card, CardColor, SpecialCardType } from 'type/card';
import { ID, Player } from 'type/player';
import { shuffle } from 'utils/array';
import { createDeck } from 'utils/cards';
import { isSpecialCard, isValidMove } from 'utils/gameRules';
import { assign, createMachine } from 'xstate';
import findIndex from 'lodash/findIndex';

const id = 'prsi';

export interface GameContext {
  players: Player[];
  allCards: Card[];
  deck: Card[];
  game: Card[];
  playerTurn: ID | null;
  winner?: Player;
  topCard: Card | null;
  consecutiveDrawCards: number;
  selectedColor?: CardColor;
  gameStatus: string;
  mustDrawCards: boolean;
  skippedPlayers: number;
  awaitingColorSelection: boolean;
  penaltyCardType?: SpecialCardType; // Track which card type created the current penalty
}

export const gameMachine = createMachine<GameContext>(
  {
    id,
    predictableActionArguments: true,
    context: {
      players: [],
      allCards: [],
      game: [],
      deck: [],
      playerTurn: null,
      topCard: null,
      consecutiveDrawCards: 0,
      gameStatus: '',
      mustDrawCards: false,
      skippedPlayers: 0,
      awaitingColorSelection: false,
      penaltyCardType: undefined,
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
                cond: (context) =>
                  context.players.find(
                    (player) => player.inHand.length === 0,
                  ) !== undefined,
                actions: ['setGameWinner'],
              },
              PLAY_CARD: {
                target: 'playerTurn',
                actions: ['playCard', 'evaluateMove', 'processTurn'],
              },
              DRAW_CARD: {
                target: 'playerTurn',
                actions: ['drawCard', 'processTurn'],
              },
              SELECT_COLOR: {
                actions: ['selectColor'],
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
        const players: Player[] = event.players;

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

        const topCard = game.length > 0 ? game[game.length - 1] : null;

        // If the first card is a Queen, set a default color
        let selectedColor: CardColor | undefined = undefined;
        if (topCard !== null && isSpecialCard(topCard) === SpecialCardType.Queen) {
          // Use the Queen's color as default
          selectedColor = topCard.color;
        }

        // If the first card is a 7 or King of Spades, first player must draw
        // If the first card is an Ace, first player is skipped
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
          } else if (initialCardType === SpecialCardType.KingOfClubs) {
            mustDrawCards = true;
            consecutiveDrawCards = 4;
            penaltyCardType = SpecialCardType.KingOfClubs;
          } else if (initialCardType === SpecialCardType.Ace) {
            // First player is skipped, second player starts
            initialPlayerIndex = 1;
          }
        }

        const colorInfo = selectedColor !== undefined ? ` (Barva: ${selectedColor})` : '';
        const drawInfo = mustDrawCards === true ? ` (Musí líznout ${consecutiveDrawCards} karet nebo zahrát 7/K♠)` : '';
        const skipInfo = initialPlayerIndex === 1 ? ` (${players[0]?.name} vynechává tah)` : '';

        return {
          ...context,
          allCards,
          deck,
          game,
          players,
          playerTurn: players[initialPlayerIndex]?.id,
          topCard,
          selectedColor,
          mustDrawCards,
          consecutiveDrawCards,
          penaltyCardType,
          gameStatus: `${players[initialPlayerIndex]?.name} začíná!${colorInfo}${drawInfo}${skipInfo}`,
        };
      }),
      reset: assign(() => ({
        players: [],
        allCards: [],
        game: [],
        deck: [],
        winner: undefined,
        topCard: null,
        consecutiveDrawCards: 0,
        selectedColor: undefined,
        gameStatus: '',
        mustDrawCards: false,
        skippedPlayers: 0,
        awaitingColorSelection: false,
        penaltyCardType: undefined,
      })),
      playCard: assign((context, event) => {
        const playerIndex = findIndex(context.players, { id: event.player.id });

        // Remove card from player's hand
        context.players.splice(playerIndex, 1, {
          ...context.players[playerIndex],
          inHand: context.players[playerIndex].inHand.filter(
            (card) => card.index !== event.card.index,
          ),
        });

        // Add to game pile
        const game = [...context.game, event.card];

        // Clear selected color only if the played card is not a Queen
        let selectedColor = context.selectedColor;
        const playedCardType = isSpecialCard(event.card);
        if (playedCardType !== SpecialCardType.Queen) {
          selectedColor = undefined;
        }

        // Handle Seven stacking - if drawing is active and Seven is played, stack the penalty
        let consecutiveDrawCards = context.consecutiveDrawCards;
        let mustDrawCards = context.mustDrawCards;
        let penaltyCardType = context.penaltyCardType;
        
        if (mustDrawCards === true && playedCardType === SpecialCardType.Seven) {
          // Seven stacked on existing penalty - adds 2 regardless of penalty source
          consecutiveDrawCards += 2;
          penaltyCardType = SpecialCardType.Seven; // Update to Seven since it was just stacked
        } else if (mustDrawCards === true && playedCardType === SpecialCardType.KingOfClubs) {
          // King stacked on existing penalty - adds 4 regardless of penalty source
          consecutiveDrawCards += 4;
          penaltyCardType = SpecialCardType.KingOfClubs; // Update to King
        } else if (playedCardType === SpecialCardType.Seven) {
          // New draw penalty starting with Seven
          consecutiveDrawCards = 2;
          mustDrawCards = true;
          penaltyCardType = SpecialCardType.Seven;
        } else if (playedCardType === SpecialCardType.KingOfClubs) {
          // New draw penalty starting with King
          consecutiveDrawCards = 4;
          mustDrawCards = true;
          penaltyCardType = SpecialCardType.KingOfClubs;
        } else {
          // Regular card played, clear draw penalty
          consecutiveDrawCards = 0;
          mustDrawCards = false;
          penaltyCardType = undefined;
        }

        return {
          ...context,
          game,
          topCard: event.card,
          selectedColor,
          consecutiveDrawCards,
          mustDrawCards,
          penaltyCardType,
        };
      }),
      drawCard: assign((context, event) => {
        const playerIndex = findIndex(context.players, { id: event.player.id });
        let deck = [...context.deck];
        let gameCards = [...context.game];

        // Draw cards from deck
        const cardsToAdd: Card[] = [];
        const cardsToDraw = context.mustDrawCards === true ? context.consecutiveDrawCards : 1;

        for (let i = 0; i < cardsToDraw; i++) {
          if (deck.length === 0) {
            // Recycle game pile if deck is empty
            if (gameCards.length > 1) {
              // Keep top card, shuffle the rest back into deck
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

        return {
          ...context,
          deck,
          game: gameCards,
          mustDrawCards: false,
          consecutiveDrawCards: 0,
          penaltyCardType: undefined,
          awaitingColorSelection: false,
          gameStatus: `${event.player.name} si líznul${cardsToAdd.length > 1 ? 'o' : 'a'} ${cardsToAdd.length} kart${cardsToAdd.length > 1 ? 'y' : 'u'}`,
        };
      }),
      evaluateMove: assign((context, event) => {
        if (context.topCard === null) {
          return { ...context };
        }

        const playedCard = event.card;

        // Validate move - pass mustDrawCards flag for Seven stacking validation
        const isValid = isValidMove(playedCard, context.topCard, context.selectedColor, context.mustDrawCards);

        if (!isValid) {
          const currentPlayer = context.players.find(p => p.id === event.player.id);
          return {
            ...context,
            gameStatus: `${currentPlayer?.name} nemůže zahrát tuto kartu!`,
          };
        }

        return { ...context };
      }),
      processTurn: assign((context) => {
        if (context.playerTurn === null) {
          return { ...context };
        }

        let nextPlayerIndex = findIndex(context.players, { id: context.playerTurn });
        let skipsRemaining = context.skippedPlayers;

        const specialType = context.topCard !== null ? isSpecialCard(context.topCard) : null;

        // If Queen was played and we're NOT already waiting for color selection,
        // set awaiting color selection for the current player (who played the Queen)
        if (specialType === SpecialCardType.Queen && context.awaitingColorSelection === false) {
          return {
            ...context,
            awaitingColorSelection: true,
            gameStatus: `${context.players[nextPlayerIndex]?.name} si vybírá barvu...`,
          };
        }

        // If draw penalty is active, stay on next player (they must respond to penalty)
        if (context.mustDrawCards === true) {
          nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
          const nextPlayer = context.players[nextPlayerIndex];
          const drawInfo = `(Musí líznout ${context.consecutiveDrawCards} karet nebo zahrát 7/K♣)`;
          return {
            ...context,
            playerTurn: nextPlayer.id,
            gameStatus: `Na řadě je ${nextPlayer.name} ${drawInfo}`,
          };
        }

        // Handle Ace skip
        if (specialType === SpecialCardType.Ace) {
          skipsRemaining = 1;
        }

        // Skip players if needed
        while (skipsRemaining > 0) {
          nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
          skipsRemaining--;
        }

        // Move to next player
        nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
        const nextPlayer = context.players[nextPlayerIndex];

        // Keep selectedColor unless it's cleared by playCard
        const colorInfo = context.selectedColor !== undefined ? ` (Barva: ${context.selectedColor})` : '';

        return {
          ...context,
          playerTurn: nextPlayer.id,
          skippedPlayers: 0,
          awaitingColorSelection: false,
          gameStatus: `Na řadě je ${nextPlayer.name}${colorInfo}`,
        };
      }),
      selectColor: assign((context, event) => {
        if (context.playerTurn === null) {
          return { ...context };
        }

        let nextPlayerIndex = findIndex(context.players, { id: context.playerTurn });
        const specialType = context.topCard !== null ? isSpecialCard(context.topCard) : null;

        // Handle Ace skip after color selection (if needed)
        let skipsRemaining = 0;
        if (specialType === SpecialCardType.Ace) {
          skipsRemaining = 1;
        }

        // Skip players if needed
        while (skipsRemaining > 0) {
          nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
          skipsRemaining--;
        }

        // Move to next player
        nextPlayerIndex = (nextPlayerIndex + 1) % context.players.length;
        const nextPlayer = context.players[nextPlayerIndex];

        return {
          ...context,
          playerTurn: nextPlayer.id,
          selectedColor: event.color,
          awaitingColorSelection: false,
          gameStatus: `${nextPlayer.name} hraje. Vybraná barva: ${event.color}`,
        };
      }),
      setGameWinner: assign((context) => {
        const winner = context.players.find((player) => player.inHand.length === 0);
        return {
          ...context,
          winner,
          gameStatus: `${winner?.name} vyhrál!`,
        };
      }),
    },
  },
);

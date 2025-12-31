import { Card, CardColor, SpecialCardType } from 'type/card';
import { ID, Player } from 'type/player';

/**
 * Represents a single entry in the game status log.
 * Used to track game progression and state changes for UI display.
 */
export interface StatusLogEntry {
  message: string;
  topCard: Card | null;
  timestamp: number;
  playerId?: ID;
}

/**
 * Main game context for the XState state machine.
 * Contains all game state needed for the card game logic.
 *
 * Core Game State:
 * - players: All game participants and their hands
 * - allCards: Original shuffled deck (for reference)
 * - deck: Remaining cards to draw from
 * - game: Cards played in the current round
 * - topCard: The card on top of the game pile
 * - playerTurn: ID of the current player
 *
 * Turn Management:
 * - playerTurn: Current player's ID
 * - gameStatus: Human-readable status message
 *
 * Special Card Handling:
 * - mustDrawCards: Whether a draw penalty is active
 * - consecutiveDrawCards: How many cards to draw (7=2, K=4, stacked)
 * - penaltyCardType: Which special card caused the penalty
 * - selectedColor: Color chosen by Queen (if applicable)
 * - skippedPlayers: Number of players to skip
 * - awaitingColorSelection: Player is selecting color for Queen
 * - awaitingAceResponse: Player can respond with Ace to skip
 *
 * UI/Logging:
 * - statusLog: Game events for display
 *
 * Win Condition:
 * - winner: The player who won (once inHand.length === 0)
 */
export interface GameContext {
  // Core game state
  players: Player[];
  allCards: Card[];
  deck: Card[];
  game: Card[];
  topCard: Card | null;

  // Turn management
  playerTurn: ID | null;
  gameStatus: string;

  // Special card state - Draw penalties
  mustDrawCards: boolean;
  consecutiveDrawCards: number;
  penaltyCardType?: SpecialCardType;

  // Special card state - Queen & Ace
  selectedColor?: CardColor;
  awaitingColorSelection: boolean;
  awaitingAceResponse: boolean;

  // Skip management
  skippedPlayers: number;

  // Win condition
  winner?: Player;

  // UI/Logging
  statusLog: StatusLogEntry[];
}

/**
 * Initial/default context for the game machine.
 * Used when starting a new game or resetting.
 */
export const initialGameContext: GameContext = {
  players: [],
  allCards: [],
  game: [],
  deck: [],
  playerTurn: null,
  topCard: null,
  consecutiveDrawCards: 0,
  gameStatus: '',
  statusLog: [],
  mustDrawCards: false,
  skippedPlayers: 0,
  awaitingColorSelection: false,
  awaitingAceResponse: false,
  penaltyCardType: undefined,
};

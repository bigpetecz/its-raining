import { Card } from 'type/card';
import { Player } from 'type/player';

/**
 * Format a card for display in logs
 * @param card The card to format
 * @returns A formatted string like "7♥︎" or "Q♠︎"
 */
export const formatCard = (card: Card | null): string => {
  if (!card) {
    return 'No card';
  }
  return `${card.symbol.value}${card.color}`;
};

/**
 * Format a player's hand for display in logs
 * @param player The player whose hand to format
 * @returns A formatted string like "[7♥︎ 3♦︎ Q♠︎]"
 */
export const formatPlayerHand = (player: Player | undefined): string => {
  if (!player || player.inHand.length === 0) {
    return '[]';
  }
  const formattedCards = player.inHand.map(formatCard).join(' ');
  return `[${formattedCards}]`;
};

/**
 * Format all players' hands for logging
 * @param players Array of players
 * @returns A formatted string like "Petr: [7♥︎ 3♦︎] | Andrea: [Q♠︎ 8♣︎]"
 */
export const formatAllPlayerHands = (players: Player[]): string => {
  return players.map(p => `${p.name}: ${formatPlayerHand(p)}`).join(' | ');
};

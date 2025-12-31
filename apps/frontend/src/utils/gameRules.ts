import { Card, CardColor, CardValue, SpecialCardType } from 'type/card';

/**
 * Select a random color from all available colors
 */
export const selectRandomColor = (): CardColor => {
    const colors = Object.values(CardColor);
    return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Check if a card is a special card that triggers an effect
 */
export const isSpecialCard = (card: Card): SpecialCardType | null => {
    const { value } = card.symbol;
    
    // Seven: Draw 2 (stackable)
    if (value === CardValue.Seven) {
        return SpecialCardType.Seven;
    }
    
    // Ace: Skip next player
    if (value === CardValue.Ace) {
        return SpecialCardType.Ace;
    }
    
    // Queen: Change color
    if (value === CardValue.Queen) {
        return SpecialCardType.Queen;
    }
    
    // King of Spades: Draw 4 cards
    if (value === CardValue.King && card.color === CardColor.Spades) {
        return SpecialCardType.KingOfSpades;
    }
    
    return null;
};

/**
 * Check if a card move is valid against the top card
 * Also handles draw penalty stacking - when draw penalty is active,
 * only Seven can be played to stack the penalty, except:
 * - When King of Spades initiated the penalty, only Seven of Spades can stack on it
 * Also handles Ace response - when awaitingAceResponse is true,
 * ONLY Ace can be played to counter the skip effect, and any Ace can be played on any Ace
 * Valid if:
 * - Same suit (color)
 * - Queen can always be played (allows color change)
 * - Ace must match color in normal play, but can have any color during Ace response phase
 * - Seven can always be played during penalty phase to stack
 * - King of Spades can only be stacked by Seven of Spades
 * - Regular cards (8, 9, 10, J, K) can be played on same color or same rank
 */
export const isValidMove = (
    playedCard: Card, 
    topCard: Card, 
    selectedColor?: CardColor,
    mustDrawCards = false,
    awaitingAceResponse = false
): boolean => {
    const specialType = isSpecialCard(playedCard);

    // If Ace response is active, ONLY Ace can be played to counter the skip
    // During this phase, any Ace can be played on any Ace regardless of color
    if (awaitingAceResponse === true) {
        if (specialType === SpecialCardType.Ace) {
            // Any Ace can be played on any Ace
            return isSpecialCard(topCard) === SpecialCardType.Ace;
        }
        return false;
    }

    // If draw penalty is active, only Seven can be played to stack
    // Exception: when King of Spades initiated the penalty, only 7 of Spades can stack
    if (mustDrawCards === true) {
        // If top card is King of Spades, only 7 of Spades can stack on it
        if (isSpecialCard(topCard) === SpecialCardType.KingOfSpades) {
            return specialType === SpecialCardType.Seven && playedCard.color === CardColor.Spades;
        }
        // Otherwise, any Seven can stack on any card (Seven or other Seven)
        return specialType === SpecialCardType.Seven;
    }

    // If Queen was played, check against the selected color, not the Queen's color
    const checkColor = selectedColor ?? topCard.color;
    
    // Same suit/color
    if (playedCard.color === checkColor) {
        return true;
    }
    
    // Special cards handling
    const topSpecialType = isSpecialCard(topCard);
    
    // Queen can always be played (allows color change)
    if (specialType === SpecialCardType.Queen) {
        return true;
    }
    
    // Ace must match color in normal play (not during response phase)
    // Ace can be played on same color or on any other Ace
    if (specialType === SpecialCardType.Ace) {
        return playedCard.color === checkColor || topSpecialType === SpecialCardType.Ace;
    }
    
    // King of Spades must be played on Spades (only playable on Spades color)
    if (specialType === SpecialCardType.KingOfSpades) {
        return playedCard.color === checkColor;
    }
    
    // Seven can be played on same color OR on any 7
    if (specialType === SpecialCardType.Seven) {
        return playedCard.color === checkColor || topSpecialType === SpecialCardType.Seven;
    }
    
    // Same rank (value) - applies to regular cards like 8, 9, 10, J, K
    if (playedCard.symbol.value === topCard.symbol.value) {
        return true;
    }
    
    return false;
};

/**
 * Get the number of cards to draw based on special card effects
 * Handles stacking of draw cards (e.g., multiple Sevens or Kings of Spades)
 */
export const getDrawCount = (
    topCard: Card, 
    consecutiveDrawCards: number
): number => {
    const specialType = isSpecialCard(topCard);
    
    if (specialType === SpecialCardType.Seven) {
        return consecutiveDrawCards + 2;
    }
    
    if (specialType === SpecialCardType.KingOfSpades) {
        return consecutiveDrawCards + 4;
    }
    
    return consecutiveDrawCards;
};

/**
 * Check if a card is playable when draw penalty is pending.
 * Stacking rules:
 * - Seven cards can always stack on other Seven cards
 * - King of Clubs can only be stacked by Seven of Clubs (not by other Sevens)
 */
export const canStackSpecialCard = (
    playedCard: Card,
    topCard: Card
): boolean => {
    const playedType = isSpecialCard(playedCard);
    const topType = isSpecialCard(topCard);
    
    if (playedType === null || topType === null) {
        return false;
    }
    
    // Only Seven cards can stack with other Seven cards
    if (playedType === SpecialCardType.Seven && topType === SpecialCardType.Seven) {
        return true;
    }
    
    // Only Seven of Spades can stack on King of Spades
    if (playedType === SpecialCardType.Seven && topType === SpecialCardType.KingOfSpades) {
        return playedCard.color === CardColor.Spades;
    }
    
    return false;
};

/**
 * Format card description for UI
 */
export const getCardDescription = (card: Card): string => {
    const specialType = isSpecialCard(card);
    
    switch (specialType) {
        case SpecialCardType.Seven:
            return `${card.color} 7 - Další hráč si lízne 2 karty`;
        case SpecialCardType.Ace:
            return `${card.color} A - Další hráč vynechává tah`;
        case SpecialCardType.Queen:
            return `${card.color} Q - Mění barvu`;
        case SpecialCardType.KingOfSpades:
            return `${card.color} K - Další hráč si lízne 4 karty`;
        default:
            return `${card.color} ${card.symbol.value}`;
    }
};

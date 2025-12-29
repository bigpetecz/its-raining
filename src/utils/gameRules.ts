import { Card, CardColor, CardValue, SpecialCardType } from 'type/card';

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
        return SpecialCardType.KingOfClubs;
    }
    
    return null;
};

/**
 * Check if a card move is valid against the top card
 * Also handles draw penalty stacking - when draw penalty is active,
 * only Seven and King of Spades can be played to stack the penalty
 * Valid if:
 * - Same suit (color)
 * - Queen can always be played (allows color change)
 * - Ace/Seven/King of Spades must match color in normal play, but can have any color during stacking
 * - Regular cards (8, 9, 10, J, K) can be played on same color or same rank
 */
export const isValidMove = (
    playedCard: Card, 
    topCard: Card, 
    selectedColor?: CardColor,
    mustDrawCards = false
): boolean => {
    // If draw penalty is active, only Seven and King of Spades can be played to stack
    if (mustDrawCards === true) {
        const specialType = isSpecialCard(playedCard);
        return specialType === SpecialCardType.Seven || specialType === SpecialCardType.KingOfClubs;
    }

    // If Queen was played, check against the selected color, not the Queen's color
    const checkColor = selectedColor ?? topCard.color;
    
    // Same suit/color
    if (playedCard.color === checkColor) {
        return true;
    }
    
    // Special cards handling
    const specialType = isSpecialCard(playedCard);
    const topSpecialType = isSpecialCard(topCard);
    
    // Queen can always be played (allows color change)
    if (specialType === SpecialCardType.Queen) {
        return true;
    }
    
    // Ace can be played on any Ace or same color
    if (specialType === SpecialCardType.Ace) {
        return topSpecialType === SpecialCardType.Ace || playedCard.color === checkColor;
    }
    
    // King of Spades must be played on Spades (only playable on Spades color)
    if (specialType === SpecialCardType.KingOfClubs) {
        return playedCard.color === checkColor;
    }
    
    // Seven must match color (only playable on same color)
    if (specialType === SpecialCardType.Seven) {
        return playedCard.color === checkColor;
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
    
    if (specialType === SpecialCardType.KingOfClubs) {
        return consecutiveDrawCards + 4;
    }
    
    return consecutiveDrawCards;
};

/**
 * Check if a card is playable when draw penalty is pending
 * Only same special card type can be stacked
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
    // Only King of Spades can stack with other King of Spades
    if (playedType === SpecialCardType.Seven && topType === SpecialCardType.Seven) {
        return true;
    }
    
    if (playedType === SpecialCardType.KingOfClubs && topType === SpecialCardType.KingOfClubs) {
        return true;
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
        case SpecialCardType.KingOfClubs:
            return `${card.color} K - Další hráč si lízne 4 karty`;
        default:
            return `${card.color} ${card.symbol.value}`;
    }
};

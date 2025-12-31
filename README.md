# 🎴 It's Raining - Game Guide

A React-based implementation of the Czech card game **Prší** (It's Raining) - similar to Mau-Mau.

---

## 🎮 How to Play

### Game Setup
- **Players:** 2-4 players
- **Deck:** Standard 32-card Czech deck (7, 8, 9, 10, J, Q, K, A in 4 suits)
- **Starting Hand:** Each player receives 3-4 cards
- **First Play:** A card from the deck is placed on the table (game pile)

### Game Flow

1. **Player's Turn**
   - Play a card matching either the **suit** or **rank** of the top card
   - If you have no valid move, draw a card from the deck
   - If the drawn card is playable, you may play it immediately or pass

2. **Winning**
   - Be the first player to play all cards from your hand
   - Game ends immediately when a player's hand is empty

### Special Cards

| Card | Effect | Rule |
|------|--------|------|
| **7** (Seven) | Draw 2 cards | Stackable - next player can play another 7 or K♠ to stack penalties |
| **K♠** (King of Spades) | Draw 4 cards | Stackable - next player can play another K♠ or 7 to stack penalties |
| **A** (Ace) | Skip next player | That player loses their turn |
| **Q** (Queen) | Choose next suit | Select any of 4 suits (♥, ♦, ♠, ♣) |

### Penalty Stack System
When penalties stack:
- Play 7 → Next player draws 2 cards
- If next player plays 7 → Penalty becomes 4 cards for the following player
- If next player plays K♠ → Penalty becomes 8 cards for the following player
- Continue until someone can't play a special card

---

## 💻 Game Architecture

### Tech Stack
- **React 18** with TypeScript
- **XState** for state machine management
- **Framer Motion** for smooth animations
- **CSS Modules** for component styling

### Project Structure

```
src/
├── component/          # React UI components
│   ├── Card.tsx       # Individual card display
│   ├── PlayerHand.tsx # Current player's cards
│   ├── DeckOfCards.tsx # Deck display
│   ├── Players.tsx    # All players' hands
│   └── ColorSelector.tsx # Queen color selection modal
├── state/             # Game logic & state machine
│   ├── index.ts       # XState machine definition
│   ├── actions/       # Game actions (play card, draw, etc.)
│   ├── guards/        # Validation rules
│   └── helpers/       # Utility functions
├── type/              # TypeScript interfaces
│   ├── card.ts        # Card types & enums
│   └── player.ts      # Player types
├── utils/             # Helper functions
│   ├── cards.ts       # Deck creation & shuffle
│   ├── cardFormatter.ts # Card display formatting
│   ├── gameRules.ts   # Game rule validation
│   └── debugLog.ts    # Development logging
└── App.tsx            # Main app component
```

---

## 🎯 Game Rules Deep Dive

### Card Validity
A card is playable if:
- It matches the **suit** of the top card (e.g., ♥ on ♥), OR
- It matches the **rank** of the top card (e.g., 7 on 7), OR
- It's a **special card** (7, K♠, A, Q) - always playable

### Special Card Rules

**Seven (7) - Draw 2**
- Next player must draw 2 cards
- If they have another 7 or K♠, they can play it instead (stacking)
- Each card played adds 2-4 more cards to the penalty

**King of Spades (K♠) - Draw 4**
- Next player must draw 4 cards
- Can also be stacked like 7
- Cannot draw 4 and play a card - either draw or pass

**Ace (A) - Skip**
- Next player's turn is skipped
- That player doesn't get to play
- Turn passes to the following player

**Queen (Q) - Change Suit**
- After playing a Queen, choose the suit for the next play
- Other players must play a card of that suit (or another Queen)
- This effectively changes the "active suit" for validation

### Deck Management
- When the deck runs out, the game pile (played cards) is reshuffled to create a new deck
- Top card of the game pile stays visible
- Play continues seamlessly

### Initial Deal
- If the first card turned is a 7, K♠, or A, its effect applies to the first player
- Game is already set up when gameplay begins

---

## 🔧 Development Notes

### Key State Machine States
```
standby  → Game waiting to start
playing  → Active game in progress
won      → Game over, winner announced
```

### Important Functions

**Card Validation** (`src/utils/gameRules.ts`)
```typescript
isValidPlay(topCard: Card, playCard: Card, selectedColor?: CardColor): boolean
```
Checks if a card can be legally played on the top card.

**Create Deck** (`src/utils/cards.ts`)
```typescript
createDeck(): Card[]
```
Generates a full 32-card deck and shuffles it.

**Apply Special Effects** (`src/state/actions/`)
- Handle 7: Add draw penalty
- Handle K♠: Add 4-card draw penalty
- Handle A: Mark next player to skip
- Handle Q: Show color selection modal

### Testing
- Unit tests for game rules in `src/utils/gameRules.test.ts`
- State tests in `src/state/index.test.ts`
- Component tests verify correct props and interactions

---

## 🚀 Getting Started

### Installation
```bash
npm install
npm start
```

### Running Tests
```bash
npm test
```

### Development Environment
- Configure in `src/config/environment.ts`
- Debug logging available via `debugLog` utility
- XState devtools integration for state inspection

---

## 📝 Game Rules Summary (Quick Reference)

1. **Play a card** matching suit OR rank of top card
2. **No valid move?** Draw a card
3. **Special cards** work as follows:
   - **7** → Next player draws 2 (stackable)
   - **K♠** → Next player draws 4 (stackable)
   - **A** → Skip next player
   - **Q** → Select next suit
4. **Win** by emptying your hand first

---

## 🎨 UI Components

### Card Component
Displays individual cards with hover/tap animations. Shows suit color (red/black) and rank visually.

### PlayerHand
Shows the current player's playable cards. Cards are disabled if they don't match the top card.

### Players
Grid view of all players' hands with turn indicator and animation pulse on active player.

### DeckOfCards
Generic deck display showing card count and card list.

### ColorSelector Modal
Interactive dialog for Queen suit selection. Spring animation entrance/exit.

---

## 💡 Tips for Players

- **Watch the penalties** - Multiple 7s or K♠ can stack up quickly!
- **Save special cards** - Use them strategically, not immediately
- **Queen timing** - Choose a suit that many players have cards for
- **Remember** - If you can't play, you must draw (and can play immediately if valid)
- **Last card** - When down to one card, play carefully (in real play, you'd call "Prší!")

---

## 📞 Support

For game logic questions, check the game rules implementation in:
- `src/utils/gameRules.ts` - Rule validation
- `src/state/index.ts` - State machine logic
- `src/state/guards/` - Guard conditions
- `src/state/actions/` - Action handlers

For UI issues, check:
- `src/component/` - Component implementations
- `src/component/*.module.css` - Styling

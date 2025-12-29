# Prší Card Game - Implementation Analysis

## Project Overview
A React-based implementation of the Czech card game "Prší" (similar to Mau-Mau) using TypeScript, XState for state management, and React hooks.

**Tech Stack:**
- React 18 with TypeScript
- XState (state machine)
- Lodash utilities
- Standard 32-card Czech deck (7-A in 4 suits)

---

## Current Implementation Status

### ✅ Completed Features

#### 1. **Core Types & Data Structures**
- `Card` type with symbol and color properties
- `Player` type with id, name, color, and hand management
- Card enums (`CardValue`, `CardColor`) and numeric values
- Proper TypeScript interfaces

#### 2. **Deck Management**
- Full 32-card deck creation (`createDeck()`)
- Shuffle utility (Fisher-Yates algorithm)
- Card distribution system in game initialization

#### 3. **Game State Machine (XState)**
- Machine setup with three main states: `standby`, `playing`, `won`
- Card dealing logic (3-4 cards per player)
- Turn rotation between players
- Win condition detection (first player with empty hand)
- Reset functionality

#### 4. **UI Components**
- `DeckOfCards`: Displays any card collection with count
- `Players`: Shows all players, their hands, and turn indicator
- Card color styling (red for Hearts/Diamonds, black for Spades/Clubs)
- Click-to-play functionality for active player's cards

#### 5. **Game Flow**
- Game initialization with hardcoded 2 players
- Turn-based play system
- Card playing with validation
- Draw card functionality
- Winner announcement
- Deck recycling when empty

#### 6. **Special Card Effects** ✅ IMPLEMENTED
- **Seven (7):** Draw 2 cards (stackable with other Sevens and Kings)
- **Queen (👑):** Player chooses the suit for next play
- **Ace (A):** Skip next player's turn
- **King of Spades (K♣):** Draw 4 cards (stackable)

#### 7. **Game Rules** ✅ IMPLEMENTED
- Card validity validation (same suit or same rank)
- Special card handling and effects
- Draw penalty system with stacking
- Deck recycling when empty (reshuffle game pile)
- Initial card penalty handling (if first card is 7, K♠, or A)

#### 8. **UI Components** ✅ UPDATED
- Top card display (current game card on table)
- Draw button (when player has no valid moves)
- Game status messages showing current turn and penalties
- Deck count display
- Card validity visual feedback (disabled cards faded)
- Color selection UI for Queen special card

---

## ❌ Missing/Incomplete Features

### Non-Critical Enhancements

#### 1. **Multi-Player Support** ⚠️ MEDIUM PRIORITY
- Currently: Hardcoded 2 players (Petr & Andrea)
- **Missing:** Dynamic player count (2-5+ players)
- Need player configuration screen
- Would improve game flexibility

#### 2. **UI Polish** ⚠️ LOW PRIORITY
- "Last Card" warning (when player has 1 card)
- Better card styling (clickable cards with hover effects)
- Game history/log
- Timer for player turns
- Sound effects

#### 3. **Game Variants** ⚠️ LOW PRIORITY
- Alternative rule sets for Prší
- Different scoring systems
- Custom special card effects

#### 4. **Accessibility** ⚠️ LOW PRIORITY
- Keyboard navigation for card selection
- Screen reader support
- Colorblind mode

#### 5. **Testing** ⚠️ LOW PRIORITY
- More comprehensive unit tests
- E2E testing for game flow
- Edge case coverage (stale deck, etc.)

---

## Implementation Architecture

### File Structure
```
src/
├── type/
│   ├── card.ts          ✅ Complete
│   └── player.ts        ✅ Complete
├── utils/
│   ├── array.ts         ✅ Complete
│   └── cards.ts         ✅ Complete
├── component/
│   ├── DeckOfCards.tsx  ✅ Basic (needs enhancement)
│   └── Players.tsx      ✅ Basic (needs enhancement)
├── state/
│   └── index.ts         ⚠️ Incomplete (missing game logic)
├── App.tsx              ⚠️ Needs hardcoded players removed
└── index.tsx            ✅ Entry point
```

### State Machine Hierarchy
```
standby
  ├─→ START_GAME
         ↓
       playing
         ├─ playerTurn (initial)
         │  ├─ PLAY_CARD → playCard, evaluateMove
         │  └─ [empty transition] → won (if player has no cards)
         └─ [missing: draw phase]
         ↓
       won
         ├─ RESET_GAME
         └─→ standby
```

---

## Recommended Implementation Order

### Phase 1: ✅ COMPLETED
- ✅ Core game rules (card validity, drawing, deck recycling)
- ✅ Special card effects (Seven, Ace, Queen, King of Spades)
- ✅ Draw card action and logic
- ✅ Game status messages and UI feedback
- ✅ Top card display and deck management

### Phase 2: OPTIONAL ENHANCEMENTS
1. Multi-player configuration (allow custom player count 2-5+)
2. "Last Card" visual warning
3. Better card UI (hover effects, animations)
4. Game history/replay logging
5. Player statistics tracking

### Phase 3: NICE-TO-HAVES
1. Game variants/rule options
2. Accessibility improvements (keyboard navigation)
3. Sound effects and animations
4. Leaderboard/scoring system
5. Theme customization

---

## Key Code Areas (Current Implementation)

### 1. `state/index.ts` ✅ COMPLETE
**Current Implementation:**
- ✅ `GameContext` includes:
  - `topCard: Card` (current card on table)
  - `consecutiveDrawCards: number` (for stacking)
  - `selectedColor?: CardColor` (for Queen)
  - `gameStatus: string` (display messages)
  - `mustDrawCards: boolean` (draw penalty active)
  - `penaltyCardType?: SpecialCardType` (track penalty source)
  - `awaitingColorSelection: boolean` (Queen selection)

- ✅ Game events:
  - `PLAY_CARD` - Play a card
  - `DRAW_CARD` - Draw from deck
  - `SELECT_COLOR` - Select color for Queen

- ✅ Actions implemented:
  - `playCard` - Update game pile and player hand
  - `drawCard` - Draw cards with deck recycling
  - `evaluateMove` - Validate card play
  - `processTurn` - Handle turn rotation and special effects
  - `selectColor` - Process color selection for Queen

### 2. `component/Players.tsx` ✅ UPDATED
**Current Implementation:**
- ✅ Display all players with turn indicator
- ✅ "Draw Card" button when no valid moves
- ✅ Color selection UI for Queen
- ✅ Card validity visual feedback (faded invalid cards)
- ✅ Game status display

**Potential Enhancements:**
- "Last Card" warning when player has 1 card
- Better styling for card interactions
- Keyboard shortcuts for card selection

### 3. `component/DeckOfCards.tsx` ✅ FUNCTIONAL
**Current Implementation:**
- ✅ Display card count
- ✅ Show top card separately
- ✅ Card list with colors

### 4. `utils/gameRules.ts` ✅ COMPLETE
**Current Implementation:**
- ✅ `isSpecialCard()` - Identify special cards
- ✅ `isValidMove()` - Validate card plays with:
  - Same color matching
  - Same rank matching
  - Draw penalty stacking rules
  - Queen special handling
  - Special card validation
- ✅ `getDrawCount()` - Calculate draw amounts

### 5. `App.tsx` ⚠️ HARDCODED PLAYERS
**Current Status:**
- Hardcoded 2 players: "Petr" (blue) and "Andrea" (green)
- **For Enhancement:** Create player setup screen to allow:
  - Custom player count (2-5+)
  - Custom player names and colors
  - Game rule options

## Testing Checklist

### ✅ Core Game Rules - COMPLETE
- [x] Valid moves: same suit and same rank
- [x] Invalid move rejection
- [x] Draw card functionality
- [x] Deck recycling when empty

### ✅ Special Cards - COMPLETE
- [x] Seven: Draw 2 cards (stackable)
- [x] King of Spades: Draw 4 cards (stackable)
- [x] Queen: Color selection
- [x] Ace: Skip next player

### ✅ Game Flow - COMPLETE
- [x] Turn rotation
- [x] Win condition (first player with 0 cards)
- [x] Draw penalty handling
- [x] Game status messages

### ⚠️ Enhancement Tests - TODO
- [ ] Last card warning (1 card remaining)
- [ ] Multi-player configuration (3+ players)
- [ ] Accessibility testing (keyboard nav)
- [ ] Performance with many cards

---

## Architecture Summary

### Current Game States
```
standby
  ├─→ START_GAME
       ↓
     playing
       ├─ playerTurn (initial)
       │  ├─ PLAY_CARD → playCard, evaluateMove, processTurn
       │  ├─ DRAW_CARD → drawCard, processTurn
       │  └─ SELECT_COLOR → selectColor, processTurn
       │  └─ [empty transition] → won (if player has no cards)
       └─→ won
           ├─ RESET_GAME
           └─→ standby
```

### Special Card Effects Implementation

**Seven (♣7):**
- Triggers draw penalty: 2 cards
- Can be stacked: +2 cards per Seven
- Only playable during draw penalty

**King of Spades (K♣):**
- Triggers draw penalty: 4 cards
- Can be stacked: +4 cards per King
- Only playable on Spades color
- Only playable during draw penalty to stack

**Queen (👑):**
- Allows color selection
- Can be played on any color
- Next player must play selected color

**Ace (A):**
- Skips next player
- Can be played on same color or another Ace
- Turn passes to player after skipped player

### Data Flow

1. **Game Initialization**
   - Deal 3-4 cards to each player
   - Set first card as topCard
   - Handle special first card effects

2. **Player Turn**
   - Display valid moves (cards matching color or rank)
   - Player plays card OR draws
   - Evaluate special card effects
   - Move to next player

3. **Card Drawing**
   - Draw 1 or more cards (penalty)
   - If deck empty, reshuffle game pile
   - Keep top card separate
   - Continue until player has cards or deck empty

4. **Color Selection** (Queen)
   - After Queen is played
   - Player selects color
   - Next player must play that color

5. **Win Condition**
   - First player with 0 cards wins
   - Game transitions to won state
   - Show winner alert

---

## Project Status Summary

### ✅ GAME IS FULLY PLAYABLE
The core Prší card game is now fully implemented and ready to play with all essential game rules:

**Core Features Complete:**
- ✅ Card validity validation (match suit OR rank)
- ✅ Special card effects (Seven, King, Queen, Ace)
- ✅ Draw system with deck recycling
- ✅ Multi-player turn rotation
- ✅ Game state persistence
- ✅ Comprehensive UI feedback

**Game Flow:**
1. Start game → 2 players (Petr & Andrea)
2. Deal 3-4 cards to each player
3. Players take turns playing valid cards
4. If no valid card, player draws from deck
5. Special cards trigger effects (skip, draw, color selection)
6. First player with no cards wins

### 🎯 Next Steps (Optional Enhancements)

**If you want to extend the game:**

1. **Multi-Player Configuration** (30 min)
   - Allow 2-5+ players
   - Custom player names/colors
   - Add setup screen before game starts

2. **UI Polish** (2-3 hours)
   - Card animations
   - Hover effects
   - "Last Card" warning (1 card = visual alert)
   - Better styling

3. **Advanced Features** (4+ hours)
   - Game history/statistics
   - Different rule variants
   - Sound effects
   - Undo move functionality
   - AI opponent

### 📝 Last Updated
- **Date:** December 29, 2025
- **Status:** Core game implementation complete
- **Players:** Hardcoded 2-player game
- **Test Coverage:** Manual testing complete, unit tests in place

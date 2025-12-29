# Game Tests Documentation

This document describes the test suites for the "It's Raining" card game logic.

## Test Structure

The test suite is organized into three main files:

### 1. `src/utils/gameRules.test.ts` - Game Rules Tests ✅

This test suite validates the core game rules logic.

**Test Coverage:**

#### isSpecialCard Tests
- ✅ Identifies Seven as special card (draw 2)
- ✅ Identifies Ace as special card (skip)
- ✅ Identifies Queen as special card (change color)
- ✅ Identifies King of Clubs as special card (draw 4)
- ✅ Does NOT identify King of other suits as special
- ✅ Does NOT identify regular cards as special

#### isValidMove Tests

**Normal Play (no draw penalty):**
- ✅ Allow playing card with same color
- ✅ Allow playing card with same value/rank
- ✅ Allow playing Queen always (color change)
- ✅ Allow playing 7 only on same color
- ❌ NOT allow playing 7 on different color
- ✅ Allow playing Ace only on same color
- ❌ NOT allow playing Ace on different color
- ✅ Allow playing King of Clubs only on Clubs
- ❌ NOT allow playing King of Clubs on other colors
- ✅ Respect selected color from Queen

**Draw Penalty Phase (stacking):**
- ✅ Allow playing 7 with any color during stacking
- ✅ Allow playing King of Clubs with any color during stacking
- ❌ NOT allow playing regular cards during stacking
- ❌ NOT allow playing Ace during stacking
- ❌ NOT allow playing Queen during stacking

#### getDrawCount Tests
- ✅ Return 2 cards for Seven
- ✅ Return 4 cards for King of Clubs
- ✅ Return 0 for regular cards
- ✅ Stack draw counts correctly

#### canStackSpecialCard Tests
- ✅ Allow stacking Seven on Seven
- ✅ Allow stacking King of Clubs on King of Clubs
- ❌ NOT allow stacking Seven on King of Clubs (and vice versa)
- ❌ NOT allow stacking regular cards

#### getCardDescription Tests
- ✅ Describe Seven correctly
- ✅ Describe Ace correctly
- ✅ Describe Queen correctly
- ✅ Describe King of Clubs correctly
- ✅ Describe regular cards correctly

**Running the tests:**
```bash
npm test -- gameRules.test.ts --watchAll=false
```

---

### 2. `src/state/gameStart.test.ts` - Game Initialization Tests

This test suite validates the game initialization behavior with different starting cards.

**Test Coverage:**

- ✅ Start game with players
- ✅ Handle Queen as starting card (sets selected color and awaiting selection)
- ✅ Handle Seven as starting card (first player in draw phase with 2 cards to draw)
- ✅ Handle King of Clubs as starting card (first player in draw phase with 4 cards to draw)
- ✅ Handle Ace as starting card (first player is skipped, second player starts)
- ✅ Deal 4 cards to each player at start
- ✅ Have deck and game pile properly initialized (32 cards total)
- ✅ Update game status message on start

**Running the tests:**
```bash
npm test -- gameStart.test.ts --watchAll=false
```

---

### 3. `src/state/gameMachine.test.ts` - Game Mechanics Tests

This test suite validates the state machine behavior during gameplay.

**Test Coverage:**

- ✅ Allow drawing a card when player has no valid moves
- ⏳ Trigger draw penalty when Seven is played (async timing)
- ⏳ Trigger draw penalty when King of Clubs is played (async timing)
- ⏳ Allow stacking Seven on Seven penalty (async stacking)
- ⏳ Apply Ace skip effect (async state transitions)
- ⏳ Require Queen color selection (async color selection)
- ⏳ Update selected color when Queen color is selected (async)
- ✅ Handle card drawing from deck
- ✅ Detect win condition when player has no cards

**Note:** Some async tests have timing issues that may require timeout adjustments.

**Running the tests:**
```bash
npm test -- gameMachine.test.ts --watchAll=false --testTimeout=10000
```

---

## Running All Tests

```bash
npm test -- --watchAll=false
```

## Test Results Summary

| Test File | Total | Passing | Notes |
|-----------|-------|---------|-------|
| gameRules.test.ts | 24 | 24 ✅ | All passing |
| gameStart.test.ts | 8 | ~6-8 | Needs async handling |
| gameMachine.test.ts | 10 | ~3-4 | Async state transitions |

---

## Game Rules Reference

### Special Cards

**Seven (7) - Draw 2 Cards**
- Can only be played on same color (normal play)
- Can be played on ANY color during stacking phase
- Next player must draw 2 cards or stack with another 7 or K♣

**Ace (A) - Skip Next Player**
- Can only be played on same color
- Next player's turn is skipped
- Game passes to the player after that

**Queen (Q) - Change Color**
- Can be played on any card
- Player selects a new color after playing
- Next player must play that color (or same rank card)

**King of Clubs (K♣) - Draw 4 Cards**
- Can only be played on Clubs (normal play)
- Can be played on ANY color during stacking phase
- Next player must draw 4 cards or stack with another 7 or K♣

### Game Start Rules

- If Queen starts: Next player must select a color
- If 7 starts: First player in draw penalty phase (must draw 2 or play 7/K♣)
- If K♣ starts: First player in draw penalty phase (must draw 4 or play 7/K♣)
- If Ace starts: Second player starts (first player skipped)
- Otherwise: First player starts normally

### Card Play Rules

**Normal Play:**
- Card can be played if it matches TOP card's color OR rank
- Special cards have additional rules (see above)

**Draw Penalty Phase:**
- Only 7 or K♣ can be played (to stack/continue penalty)
- Any other card cannot be played
- Player must draw the accumulated penalty cards

**Color Selection (after Queen):**
- Selected color persists until another non-Queen card is played
- Acts as the "top card" color for validation
- If Queen stacked with Queen, only the first Queen's color matters

---

## Test Maintenance

When adding new game rules or modifying existing ones:

1. Update `src/utils/gameRules.ts` with new logic
2. Add corresponding tests to `src/utils/gameRules.test.ts`
3. If state machine changes, update state tests accordingly
4. Run full test suite to verify no regressions
5. Update this documentation with new test coverage

---

## Known Issues

1. **Async timing in gameMachine tests:** State machine transitions are async and some tests may timeout. Consider:
   - Increasing jest timeout: `jest.setTimeout(10000)`
   - Using `waitFor` utilities from testing libraries
   - Mocking time with jest fake timers

2. **XState warnings:** The state machine uses deprecated empty string transitions. These should be updated to use `always` property in future refactoring.

---

## Contributing

When contributing tests:
- Follow the existing test structure and naming conventions
- Use descriptive test names that explain what is being tested
- Include comments for complex test logic
- Keep tests focused on single units of logic
- Use helper functions for common setup


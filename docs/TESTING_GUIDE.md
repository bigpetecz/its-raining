# How to Run the Tests

## Quick Start

```bash
# Install Jest types if not already installed
npm install --save-dev @types/jest

# Run all tests
npm test -- --watchAll=false

# Run specific test file
npm test -- gameRules.test.ts --watchAll=false

# Run tests with increased timeout (helpful for async tests)
npm test -- --watchAll=false --testTimeout=10000

# Run tests in watch mode (re-run on file changes)
npm test
```

## Test Files Overview

### 1. **gameRules.test.ts** - Core Game Logic Tests ✅ **PASSING**
Location: `src/utils/gameRules.test.ts`

Tests the fundamental game rules:
- Card validation logic (which cards can be played when)
- Special card detection (Seven, Ace, Queen, King of Clubs)
- Draw count calculations
- Card stacking rules
- Card descriptions

**Status:** All 24 tests passing

```bash
npm test -- gameRules.test.ts --watchAll=false
```

### 2. **gameStart.test.ts** - Game Initialization Tests
Location: `src/state/gameStart.test.ts`

Tests what happens when the game starts with different cards:
- Game initialization with players
- Queen as starting card (requires color selection)
- Seven as starting card (first player draws 2 or plays)
- King of Clubs as starting card (first player draws 4 or plays)
- Ace as starting card (first player skipped)
- Proper card dealing to players
- Deck initialization

**Status:** Created and ready to run

```bash
npm test -- gameStart.test.ts --watchAll=false
```

### 3. **gameMachine.test.ts** - Game Mechanics Tests
Location: `src/state/gameMachine.test.ts`

Tests during-game mechanics:
- Drawing cards
- Playing Seven (penalty trigger)
- Playing King of Clubs (penalty trigger)
- Stacking penalties (7 on 7, K♣ on K♣)
- Ace skip effect
- Queen color selection
- Deck management

**Status:** Created with proper async handling

```bash
npm test -- gameMachine.test.ts --watchAll=false --testTimeout=10000
```

## Test Statistics

| Test Suite | Count | Type |
|-----------|-------|------|
| gameRules | 24 | Unit Tests |
| gameStart | 8 | Integration Tests |
| gameMachine | 10 | State Machine Tests |
| **Total** | **42** | **Tests** |

## Running Tests in CI/CD

For continuous integration, use:

```bash
npm test -- --watchAll=false --coverage --passWithNoTests
```

## What's Tested

✅ **Card Validation**
- Same color play
- Same rank play  
- Special card rules
- Stacking rules
- Color selection with Queen

✅ **Game Initialization**
- Correct starting conditions for each card type
- Player dealt with 4 cards
- Deck properly split between game pile and draw deck
- Status messages

✅ **Game Mechanics**
- Draw actions
- Penalty triggers
- Penalty stacking
- Skip effects
- Turn transitions

## Debugging Tests

If a test fails:

1. **Read the error message** - It tells you what was expected vs received
2. **Check the test file** - Look at the failing test in the `.test.ts` file
3. **Verify game rules** - Make sure your change matches the intended game rule
4. **Run with timeout** - For async tests: `--testTimeout=15000`
5. **Run in watch mode** - `npm test` and modify code to see live results

## Adding New Tests

To add more tests:

1. Choose the appropriate test file based on what you're testing
2. Follow the existing test structure and naming
3. Use helper functions already defined in the file
4. Keep tests focused on one thing
5. Run tests to verify: `npm test -- --watch`

Example:

```typescript
it('should do something specific', () => {
  const card = createCard(CardValue.Seven, CardColor.Hearts);
  expect(isSpecialCard(card)).toBe(SpecialCardType.Seven);
});
```

## Useful Testing Links

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [XState Testing](https://xstate.js.org/docs/guides/testing.html)
- [React Testing Library](https://testing-library.com/)


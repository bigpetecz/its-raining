import { CardColor, cardNumericValue, CardValue } from "type/card";

export const createDeck =
    () => Object.values(CardColor)
        .flatMap(color => Object.values(CardValue).map(value => ({
            color,
            symbol: {
                value,
                numericValue: cardNumericValue[value]
            }
        })))
import { CardColor, cardNumericValue, CardValue } from "type/card";

export const createDeck =
    () =>  {
        const cards = Object.values(CardColor)
        .flatMap(color => Object.values(CardValue).map(value => ({
            color,
            symbol: {
                value,
                numericValue: cardNumericValue[value]
            }
        })))

        return cards.map((card, index) => ({...card, index}))
    }
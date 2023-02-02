import { Card } from "type/card";

export type ID = string;

export interface Player {
    id: ID;
    name: string;
    color: string;
    inHand: Card[],
    handIndexes: number[],
}
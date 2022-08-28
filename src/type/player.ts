import { Card } from "type/card";

export interface Player {
    id: string;
    name: string;
    color: string;
    inHand: Card[]
}
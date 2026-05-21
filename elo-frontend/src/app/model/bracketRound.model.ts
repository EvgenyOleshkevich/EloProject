import { Match } from "./match.model";

export interface BracketRound {
    round: number;
    matches: Match[];
}
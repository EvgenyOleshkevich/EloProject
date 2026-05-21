import { Match } from "./match.model";

export interface MatchLayout {
    match: Match;
    round: number;
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export type DoubleEliminationLayouts = {
  winnerLayouts: MatchLayout[];
  loserLayouts: MatchLayout[];
};
import { MatchResult } from "../Enums";

export interface MatchInput {
    id: string,
    score1: number | null,
    score2: number | null,
    result: MatchResult,
}
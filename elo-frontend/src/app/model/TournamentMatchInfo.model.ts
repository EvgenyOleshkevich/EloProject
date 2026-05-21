import { BracketType } from "./Enums";

export interface TournamentMatchInfo {
    round: number,
    position: number,
    previousMatch1Id: string,
    previousMatch2Id: string,
    nextWinMatchId: string,
    nextLoseMatchId: string,
    bracketType: BracketType
}
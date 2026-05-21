import { CompetitionStatus, MatchResult } from "./Enums";
import { TournamentMatchInfo } from "./TournamentMatchInfo.model";

export interface Match {
    id: string,
    gameId: string,
    player1Id: string,
    player2Id: string,
    player1: string,
    player2: string,
    score1: number,
    score2: number,
    rating1: number,
    rating2: number,
    result: MatchResult,
    playedAt: string,
    status: CompetitionStatus,
    tournamentInfo: TournamentMatchInfo
}

export function getWinner(match: Match) : string | null  {
    if (match.status !== CompetitionStatus.Completed) {
        return null;
    }
    if (match.result === MatchResult.Player1Win) {
        return match.player1Id;
    }
    if (match.result === MatchResult.Player2Win) {
        return match.player2Id;
    }
    return null;
}

export function getLoser(match: Match) : string | null  {
    if (match.status !== CompetitionStatus.Completed) {
        return null;
    }
    if (match.result === MatchResult.Player1Win) {
        return match.player2Id;
    }
    if (match.result === MatchResult.Player2Win) {
        return match.player1Id;
    }
    return null;
}
import { TournamentType, CompetitionStatus } from "./Enums";
import { Match } from "./match.model";
import { Player } from "./player.model";

export interface Tournament {
    id: string,
    gameId: string,
    name: string,
    players: Player[]
    matches: Match[]
    createdAt: string,
    type: TournamentType,
    status: CompetitionStatus,
}
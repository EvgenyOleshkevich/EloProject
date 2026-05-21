import { TournamentType, CompetitionStatus } from "../Enums";

export interface TournamentInput {
    id: string,
    name: string,
    type: TournamentType,
    status: CompetitionStatus,
}
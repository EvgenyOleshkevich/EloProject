import { CompetitionStatus, MatchResult, PlayersOrder, TournamentType, UserRole } from "../../model/Enums";
import { RadioOption } from "../radio-buttons/radio-option";

export function renderTournamentType(type: TournamentType): string {
    switch (type) {
        case TournamentType.SingleElimination: return 'Single Elimination';
        case TournamentType.DoubleElimination: return 'Double Elimination';
        case TournamentType.Round: return 'Round';
        default: return '';
    }
}

export function renderCompetitionStatus(type: CompetitionStatus): string {
    switch (type) {
        case CompetitionStatus.Planned: return 'Planned';
        case CompetitionStatus.Ongoing: return 'Ongoing';
        case CompetitionStatus.Completed: return 'Completed';
        case CompetitionStatus.Canceled: return 'Canceled';
        default: return '';
    }
}

export function renderPlayersOrder(type: PlayersOrder): string {
    switch (type) {
        case PlayersOrder.Sort: return 'Sort by rating';
        case PlayersOrder.Random: return 'Random';
        case PlayersOrder.FromList: return 'From List';
        default: return '';
    }
}

export function renderMatchResult(type: MatchResult): string {
    switch (type) {
        case MatchResult.Player1Win: return 'Player 1 Win';
        case MatchResult.Draw: return 'Draw';
        case MatchResult.Player2Win: return 'Player 2 Win';
        default: return '';
    }
}

export const OrderOptions: RadioOption<PlayersOrder>[] = [
      { id: 1, title: renderPlayersOrder(PlayersOrder.Sort), value: PlayersOrder.Sort },
      { id: 2, title: renderPlayersOrder(PlayersOrder.Random), value: PlayersOrder.Random },
      { id: 3, title: renderPlayersOrder(PlayersOrder.FromList), value: PlayersOrder.FromList },
    ];

export const TypeOptions: RadioOption<TournamentType>[] = [
    { id: 1, title: renderTournamentType(TournamentType.SingleElimination), value: TournamentType.SingleElimination },
    { id: 2, title: renderTournamentType(TournamentType.DoubleElimination), value: TournamentType.DoubleElimination },
    { id: 3, title: renderTournamentType(TournamentType.Round), value: TournamentType.Round },
  ];

export const StatusOptions: RadioOption<CompetitionStatus>[] = [
    { id: 1, title: renderCompetitionStatus(CompetitionStatus.Planned), value: CompetitionStatus.Planned },
    { id: 2, title: renderCompetitionStatus(CompetitionStatus.Ongoing), value: CompetitionStatus.Ongoing },
    { id: 3, title: renderCompetitionStatus(CompetitionStatus.Completed), value: CompetitionStatus.Completed },
    { id: 4, title: renderCompetitionStatus(CompetitionStatus.Canceled), value: CompetitionStatus.Canceled },
  ];

export function renderUserRole(type: UserRole): string {
    switch (type) {
        case UserRole.Player: return 'Player';
        case UserRole.Operaotr: return 'Moderator';
        case UserRole.Admin: return 'Admin';
        default: return '';
    }
}

export const RoleOptions: RadioOption<UserRole>[] = [
    { id: 1, title: renderUserRole(UserRole.Player), value: UserRole.Player },
    { id: 2, title: renderUserRole(UserRole.Operaotr), value: UserRole.Operaotr },
    { id: 3, title: renderUserRole(UserRole.Admin), value: UserRole.Admin },
  ];
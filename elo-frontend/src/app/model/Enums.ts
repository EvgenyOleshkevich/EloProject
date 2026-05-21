export enum MatchResult {
  Player1Win = "PLAYER_1_WIN", 
  Draw = "DRAW", 
  Player2Win = "PLAYER_2_WIN",
}

export enum TournamentType {
  SingleElimination = "SINGLE_ELIMINATION", 
  DoubleElimination = "DOUBLE_ELIMINATION", 
  Round = "ROUND"
}

export enum CompetitionStatus {
  Planned = "PLANNED", 
  Ongoing = "ONGOING", 
  Completed = "COMPLETED",
  Canceled = "CANCELED"
}

export enum PlayersOrder {
  Sort = "SORT",
  Random = "RANDOM",
  FromList = "FROM_LIST"
}

export enum BracketType {
  Winner = "WINNER",
  Loser = "LOSER",
  GrandFinal = "GRAND_FINAL",
  ThirdPlace = "THIRD_PLACE",
  Round = "ROUND",
  Group = "GROUP"
}

export enum UserRole {
  Admin = "ADMIN",
  Operaotr = "OPERATOR",
  Player = "PLAYER"
}
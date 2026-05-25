import { gql } from 'apollo-angular';

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      role
    }
  }
`;

export const  GET_GAMES= gql`
  query GetGames {
    games {
      id
      name
    }
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($name: String!) {
    createGame(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($game: GameInput!) {
    updateGame(game: $game) {
      id
      name
    }
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($gameId: ID!) {
    deleteGame(gameId: $gameId) 
  }
`;

export const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      gameId
      name
      elo
      numberMatches
    }
  }
`;

export const GET_PLAYERS_BY_GAME = gql`
  query GetPlayersByGame($gameId: ID!) {
    playersByGame(gameId: $gameId) {
      id
      gameId
      name
      elo
      numberMatches
    }
  }
`;

export const CREATE_PLAYER = gql`
  mutation CreatePlayer($gameId: ID!, $name: String!) {
    createPlayer(gameId: $gameId, name: $name) {
      id
      gameId
      name
      elo
      numberMatches
    }
  }
`;

export const UPDATE_PLAYER = gql`
  mutation UpdatePlayer($id: ID!, $name: String!) {
    updatePlayer(id: $id, name: $name) {
      id
      gameId
      name
      elo
      numberMatches
    }
  }
`;

export const DELETE_PLAYER = gql`
  mutation DeletePlayer($id: ID!) {
    deletePlayer(id: $id) 
  }
`;

export const GET_MATCHES_BY_GAME = gql`
  query GetMatchesByGame($gameId: ID!) {
    matchesByGame(gameId: $gameId) {
      id
      gameId
      player1Id
      player2Id
      player1
      player2
      score1
      score2
      result
      playedAt
    }
  }
`;

export const GET_MATCHES_BY_PLAYER = gql`
  query GetMatchesByPlayer($playerId: ID!) {
    matchesByPlayer(playerId: $playerId) {
      id
      player1Id
      player2Id
      player1
      player2
      score1
      score2
      rating1
      rating2
      result
      playedAt
    }
  }
`;

export const CREATE_MATCH = gql`
  mutation CreateMatch($id1: ID!, $id2: ID!, $res: MatchResult!) {
    completeMatch(id1: $id1, id2: $id2, res: $res) {
      id
    }
  }
`;

export const CREATE_MATCH_NAMES = gql`
  mutation CreateMatchNames($gameId: ID!, $name1: String!, $name2: String!, $res: MatchResult!) {
    completeMatchWithNames(gameId: $gameId, name1: $name1, name2: $name2, res: $res) {
      id
    }
  }
`;

export const COMPLETE_TOURNAMENT_MATCH = gql`
  mutation CompleteTournamentMatch($input: MatchInput!) {
    completeTournamentMatch(input: $input) {
      id
      player1Id
      player2Id
      player1
      player2
      result
      playedAt
      status
      tournamentInfo {
        round
        position
        previousMatch1Id
        previousMatch2Id
        nextWinMatchId
        nextLoseMatchId
        bracketType
      }
    }
  }
`;

export const DELETE_MATCH = gql`
  mutation DeleteMatch($id: ID!) {
    deleteMatch(id: $id) 
  }
`;

export const GET_TOURNAMENTS_BY_GAME = gql`
  query GetTournamentByGame($gameId: ID!) {
    tournamentsByGame(gameId: $gameId) {
      id
      gameId
      name
      type
      status
      createdAt
    }
  }
`;

export const GET_TOURNAMENT = gql`
  query GetTournament($id: ID!) {
    tournament(id: $id) {
      id
      gameId
      name
      players {
        id
        name
        elo
      }
      matches {
        id
        player1Id
        player2Id
        player1
        player2
        result
        playedAt
        status
        tournamentInfo {
          round
          position
          previousMatch1Id
          previousMatch2Id
          nextWinMatchId
          nextLoseMatchId
          bracketType
        }
      }
      type
      status
      createdAt
    }
  }
`;

export const CREATE_TOURNAMENT = gql`
  mutation CreateTournament($input: TournamentInput!) {
    createTournament(input: $input) {
      id
      gameId
      name
      type
      status
      createdAt
    }
  }
`;

export const UPDATE_TOURNAMENT = gql`
  mutation UpdateTournament($input: TournamentInput!) {
    updateTournament(input: $input) {
      id
      gameId
      name
      type
      status
      createdAt
    }
  }
`;

export const UPDATE_TOURNAMENT_STATUS = gql`
  mutation UpdateTournament($input: TournamentInput!) {
    updateTournament(input: $input) {
      status
    }
  }
`;

export const ADD_PLAYERS_TO_TOURNAMENT = gql`
  mutation AddPlayersToTournament($id: ID!, $playerIds: [ID!]!, $order: PlayersOrder!) {
    addPlayersToTournament(id: $id, playerIds: $playerIds, order: $order) {
      id
      player1Id
      player2Id
      player1
      player2
      result
      playedAt
      status
      tournamentInfo {
        round
        position
        previousMatch1Id
        previousMatch2Id
        nextWinMatchId
        nextLoseMatchId
        bracketType
      }
    }
  }
`;

export const REORDER_PLAYERS = gql`
  mutation ReorderMatches($tournamentId: ID!, $orders: [MatchOrderInput!]!) {
    reorderMatches(tournamentId: $tournamentId, orders: $orders) {
      id
      player1Id
      player2Id
      player1
      player2
      result
      playedAt
      status
      tournamentInfo {
        round
        position
        previousMatch1Id
        previousMatch2Id
        nextWinMatchId
        nextLoseMatchId
        bracketType
      }
    }
  }
`;

export const DELETE_TOURNAMENT = gql`
  mutation DeleteTournament($id: ID!) {
    deleteTournament(id: $id) 
  }
`;
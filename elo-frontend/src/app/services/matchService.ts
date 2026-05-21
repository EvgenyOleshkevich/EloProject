import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Match } from '../model/match.model';
import { CREATE_MATCH, CREATE_MATCH_NAMES, COMPLETE_TOURNAMENT_MATCH, DELETE_MATCH, GET_MATCHES_BY_GAME, GET_MATCHES_BY_PLAYER, GET_PLAYERS_BY_GAME } from '../queries/queries';
import { MatchInput } from '../model/inputs/matchInput';
import { MatchResult } from '../model/Enums';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private apollo = inject(Apollo);

  getMatchesByGame(gameId: string): Observable<Match[]> {
    return this.apollo
      .watchQuery<{ matchesByGame: Match[] }>({
        query: GET_MATCHES_BY_GAME,
        variables: { gameId },
      })
      .valueChanges.pipe(
        map((result) =>
          result.dataState === 'complete' ? result.data.matchesByGame : []
        )
      );
  }

  getMatchesByPlayer(playerId: string): Observable<Match[]> {
    return this.apollo
      .watchQuery<{ matchesByPlayer: Match[] }>({
        query: GET_MATCHES_BY_PLAYER,
        variables: { playerId },
      })
      .valueChanges.pipe(
        map((result) =>
          result.dataState === 'complete' ? result.data.matchesByPlayer : []
        )
      );
  }

  create(gameId: string, id1: string, id2: string, res: MatchResult) {
    return this.apollo.mutate<{ createMatch: string[] }>({
      mutation: CREATE_MATCH,
      variables: { gameId, id1, id2, res },
      refetchQueries: [{
        query: GET_MATCHES_BY_GAME ,
        variables: { gameId },},
      {
        query: GET_PLAYERS_BY_GAME ,
        variables: { gameId },}],
    });
  }

  createWithNames(gameId: string, name1: string, name2: string, res: MatchResult) {
    return this.apollo.mutate<{ createMatch: string[] }>({
      mutation: CREATE_MATCH_NAMES,
      variables: { name1, name2, res },
      refetchQueries: [{
        query: GET_MATCHES_BY_GAME ,
        variables: { gameId },}],
    });
  }

  complete(input: MatchInput) {
    return this.apollo.mutate<{ completeTournamentMatch: Match[] }>({
      mutation: COMPLETE_TOURNAMENT_MATCH,
      variables: { input },
    });
  }

  // update(gameId: string, id: string, name: string) {
  //   return this.apollo.mutate<{ updateMatch: Match }>({
  //     mutation: UPDATE_MATCH,
  //     variables: { id, name },
  //     refetchQueries: [{
  //       query: GET_MATCHES_BY_GAME ,
  //       variables: { gameId },}],
  //   });
  // }

  delete(gameId: string, id: string) {
    return this.apollo.mutate<{ deleteMatch: boolean }>({
      mutation: DELETE_MATCH,
      variables: { id },
      refetchQueries: [{
        query: GET_MATCHES_BY_GAME ,
        variables: { gameId },}],
    });
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Tournament } from '../model/tournament.model';
import { GET_TOURNAMENT, GET_TOURNAMENTS_BY_GAME, CREATE_TOURNAMENT, UPDATE_TOURNAMENT, UPDATE_TOURNAMENT_STATUS, ADD_PLAYERS_TO_TOURNAMENT, DELETE_TOURNAMENT, REORDER_PLAYERS } from '../queries/queries';
import { TournamentInput } from '../model/inputs/tournamentInput';
import { PlayersOrder } from '../model/Enums';
import { Match } from '../model/match.model';
import { MatchOrder } from '../model/bracketSlotRef.model';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private apollo = inject(Apollo);
  selectedTournament = signal<Tournament | null>(null);

  getTournamentsByGame(gameId: string): Observable<Tournament[]> {
    return this.apollo
      .watchQuery<{ tournamentsByGame: Tournament[] }>({
        query: GET_TOURNAMENTS_BY_GAME,
        variables: { gameId },
      })
      .valueChanges.pipe(
        map((result) =>
          result.dataState === 'complete' ? result.data.tournamentsByGame : []
        )
      );
  }

  getTournament(id: string): Observable<Tournament | null> {
    return this.apollo
      .watchQuery<{ tournament: Tournament | null }>({
        query: GET_TOURNAMENT,
        variables: { id },
      })
      .valueChanges.pipe(
        map((result) =>
          result.dataState === 'complete' ? result.data.tournament : null
        )
      );
  }

  getTournament2(id: string): Observable<Tournament | null> {
    return this.apollo
      .query<{ tournament: Tournament | null }>({
        query: GET_TOURNAMENT,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(({ data }) => data?.tournament ?? null)
      );
  }

  create(input: TournamentInput) {
    const gameId = input.id;
    return this.apollo.mutate<{ createTournament: Tournament }>({
      mutation: CREATE_TOURNAMENT,
      variables: { input },
      refetchQueries: [{
        query: GET_TOURNAMENTS_BY_GAME ,
        variables: { gameId },}],
    });
  }

  updateAndRefetch(input: TournamentInput, gameId: string) {
    return this.apollo.mutate<{ updateTournament: Tournament }>({
      mutation: UPDATE_TOURNAMENT,
      variables: { input },
      refetchQueries: [{
        query: GET_TOURNAMENTS_BY_GAME ,
        variables: { gameId },}],
    });
  }

  update(input: TournamentInput) {
    return this.apollo.mutate<{ updateTournament: Tournament }>({
      mutation: UPDATE_TOURNAMENT,
      variables: { input },
    });
  }

  updateStatus(input: TournamentInput) {
    return this.apollo.mutate<{ updateTournament: Tournament }>({
      mutation: UPDATE_TOURNAMENT_STATUS,
      variables: { input },
    });
  }

  addPlayers(id: string, playerIds: string[], order: PlayersOrder) {
    return this.apollo.mutate<{ addPlayersToTournament: Match[] }>({
      mutation: ADD_PLAYERS_TO_TOURNAMENT,
      variables: { id, playerIds, order },
    });
  }

  reorderPlayers(tournamentId: string, orders: MatchOrder[]) {
    return this.apollo.mutate<{ reorderMatches: Match[] }>({
      mutation: REORDER_PLAYERS,
      variables: { tournamentId, orders },
    });
  }

  delete(gameId: string, id: string) {
    return this.apollo.mutate<{ deleteTournament: boolean }>({
      mutation: DELETE_TOURNAMENT,
      variables: { id },
      refetchQueries: [{
        query: GET_TOURNAMENTS_BY_GAME ,
        variables: { gameId },}],
    });
  }

  setSelectedTournament(tournament: Tournament) {
      this.selectedTournament.set(tournament);
  }
  
  clearSelectedTournament() {
    this.selectedTournament.set(null);
  }

  get getSelectedTournament(): Tournament | null  {
    return this.selectedTournament();
  }
}

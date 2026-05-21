import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Player } from '../model/player.model';
import { Apollo } from 'apollo-angular';
import { CREATE_PLAYER, UPDATE_PLAYER, DELETE_PLAYER, GET_PLAYERS, GET_PLAYERS_BY_GAME } from '../queries/queries';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apollo = inject(Apollo);
  selectedPlayer = signal<Player | null>(null);

  getPlayers() {
    return this.apollo.watchQuery<{ players: Player[] }>({
      query: GET_PLAYERS,
    }).valueChanges;
  }

  getPlayersByGame(gameId: string): Observable<Player[]> {
    return this.apollo
      .watchQuery<{ playersByGame: Player[] }>({
        query: GET_PLAYERS_BY_GAME,
        variables: { gameId },
      })
      .valueChanges.pipe(
        map((result) =>
          result.dataState === 'complete' ? result.data.playersByGame : []
        )
      );
  }

  create(gameId: string, name: string) {
    return this.apollo.mutate<{ createPlayer: Player }>({
      mutation: CREATE_PLAYER,
      variables: { gameId, name },
      refetchQueries: [{
        query: GET_PLAYERS_BY_GAME ,
        variables: { gameId },}],
    });
  }

  update(gameId: string, id: string, name: string) {
    return this.apollo.mutate<{ updatePlayer: Player }>({
      mutation: UPDATE_PLAYER,
      variables: { id, name },
      refetchQueries: [{
        query: GET_PLAYERS_BY_GAME ,
        variables: { gameId },}],
    });
  }

  delete(gameId: string, id: string) {
    return this.apollo.mutate<{ deletePlayer: boolean }>({
      mutation: DELETE_PLAYER,
      variables: { id },
      refetchQueries: [{
        query: GET_PLAYERS_BY_GAME ,
        variables: { gameId },}],
    });
  }

  setSelectedPlayer(tournament: Player) {
    this.selectedPlayer.set(tournament);
  }
  
  clearSelectedPlayer() {
    this.selectedPlayer.set(null);
  }

  get getSelectedPlayer(): Player | null  {
    return this.selectedPlayer();
  }
}

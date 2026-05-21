import { inject, Injectable, signal } from '@angular/core';
import { Game } from '../model/game.model';
import { Apollo } from 'apollo-angular';
import { GET_GAMES, CREATE_GAME, UPDATE_GAME, DELETE_GAME } from '../queries/queries';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apollo = inject(Apollo);
  selectedGame = signal<Game | null>(null);

  getGames() {
    return this.apollo.watchQuery<{ games: Game[] }>({
      query: GET_GAMES,
    }).valueChanges;
  }

  createGame(name: string) {
    return this.apollo.mutate<{ createGame: Game }>({
      mutation: CREATE_GAME,
      variables: { name },
      refetchQueries: [{ query: GET_GAMES }],
    });
  }

  updateGame(game: Game) {
    return this.apollo.mutate<{ updateGame: Game }>({
      mutation: UPDATE_GAME,
      variables: { game },
      refetchQueries: [{ query: GET_GAMES }],
    });
  }

  deleteGame(gameId: string) {
    return this.apollo.mutate<{ deleteGame: boolean }>({
      mutation: DELETE_GAME,
      variables: { gameId },
      refetchQueries: [{ query: GET_GAMES }],
    });
  }

  setSelectedGame(game: Game) {
    this.selectedGame.set(game);
  }

  clearSelectedGame() {
    this.selectedGame.set(null);
  }

  get getSelectedGame(): Game | null  {
    return this.selectedGame();
  }

}

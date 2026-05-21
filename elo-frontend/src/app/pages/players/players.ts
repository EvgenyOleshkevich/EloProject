import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { GameService } from '../../services/gameService';
import { PlayerService } from '../../services/playerService';
import { Game } from '../../model/game.model';
import { Player } from '../../model/player.model';
import { Table } from '../../utils/table/table';
import { Column } from '../../model/column.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GamePickerComponent } from '../../utils/game-picker/game-picker';
import { DeleteConfirmModal } from '../../modal/delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, GamePickerComponent, DeleteConfirmModal],
  templateUrl: './players.html',
  styleUrl: './players.css',
})
export class Players {
  private gameService = inject(GameService);
  private playerService = inject(PlayerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  games = signal<Game[]>([]);
  isGameFromService = signal(true);
  selectedGame = signal<Game | null>(null);
  players = signal<Player[]>([]);
  selectedForUpdate = signal<Player | null>(null);
  selectedForDelete = signal<Player | null>(null);
  playerName = '';
  columns: Column<Player>[] = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'elo', title: 'Score' },
  ];

  errorMessage = signal<string | null>(null);

  ngOnInit() {
    let gameName: string = '';
    this.route.params.subscribe(params => {
      gameName = params["gameName"];
    })

    this.gameService.getGames().subscribe({
      next: ({ data, dataState }) => {
        if (dataState === 'complete') {
          this.games.set(data.games);
          let game: Game | null | undefined = null;
          if (gameName) {
            game = this.games().find(g => g.name.toLowerCase() === gameName.toLowerCase());
            if (!game) {
              this.router.navigate(['/404']);
            }
            this.isGameFromService.set(false);
          }
          else {
            game = this.gameService.selectedGame();
          }

          if (game) {
            this.selectGame(game);
            //this.gameService.clearSelectedGame();
          }
        }
        else if (dataState === 'empty') {
          this.games.set([]);
        }
      },
    });
  }

  onSubmit() {
    const game = this.selectedGame();

    if (!game) {
      console.error('Game is not selected');
      this.errorMessage.set('Game is not selected');
      return;
    }
    if (this.playerName == '') {
      console.error('player name is empty');
      this.errorMessage.set('player name is empty');
      return;
    }
    
    const player = this.selectedForUpdate();
    if (player) {
      this.playerService.update(game.id, player.id, this.playerName)
      .subscribe({
        next: () => {
          this.errorMessage.set(null);
        },
        error: (err) => {
          console.error('Mutation error:', err);
          this.errorMessage.set('player name is busy');
        }
      });
    }
    else {
      this.playerService.create(game.id, this.playerName)
      .subscribe({
        next: () => {
          // console.log('Mutation result:', result);
          // console.log(result.data?.createGame);
          this.playerName = '';
          this.errorMessage.set(null);
        },
        error: (err) => {
          console.error('Mutation error:', err);
          this.errorMessage.set('player name is busy');
        }
      });
    }
  }

  selectGame(game: Game) {
    this.selectedGame.set(game);
    this.playerService.getPlayersByGame(game.id).subscribe(players => {
      this.players.set(players);
    });
  }

  clearGame() {
    this.selectedGame.set(null);
    this.players.set([]);
  }

  onOpen(player: Player) {
    this.playerService.setSelectedPlayer(player);
    this.router.navigate(['/player']);
  }

  onResetSelected() {
    this.selectedForUpdate.set(null);
    this.playerName = '';
  }
  
  onUpdate(player: Player) {
    this.playerName = player.name;
    this.selectedForUpdate.set(player);
  }

  onRequestDelete(player: Player) {
    this.selectedForDelete.set(player);
  }

  onConfirmDelete() {
    const player = this.selectedForDelete();
    if (player) {
      this.playerService.delete(player.gameId, player.id).subscribe({
        error: (err) => {
          console.error('Delete failed', err);
        }
      });
    }
    this.selectedForDelete.set(null);
  }

  onCancelDelete() {
    this.selectedForDelete.set(null);
  }
}

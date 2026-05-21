import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Game } from '../../model/game.model';
import { GameService } from '../../services/gameService';
import { Table } from '../../utils/table/table';
import { Column } from '../../model/column.model';
import { DeleteConfirmModal } from '../../modal/delete-confirm-modal/delete-confirm-modal';


@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, DeleteConfirmModal],
  templateUrl: './games.html',
  styleUrl: './games.css',
})
export class Games {
  private router = inject(Router);
  private gameService = inject(GameService);
  games = signal<Game[]>([]);
  selectedForUpdate = signal<Game | null>(null);
  selectedForDelete = signal<Game | null>(null);
  loading = signal(true);
  error = signal('');
  gameName = '';
  columns: Column<Game>[] = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
  ];

  constructor() {
    this.gameService.getGames().subscribe({
      next: ({ data, dataState, loading }) => {
        this.loading.set(loading);

        if (dataState === 'complete') {
          this.games.set(data.games);
          this.loading.set(false);
          return;
        }

        if (dataState === 'empty') {
          this.games.set([]);
        }
      },
      error: (err) => {
        this.error.set(err.message ?? 'Unknown error');
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.gameName == '') {
      console.error('game name is empty');
      return;
    }
    const game = this.selectedForUpdate();
    if (game) {
      const input = {
        id: game.id,
        name: this.gameName,
      };
      this.gameService.updateGame(input)
      .subscribe({
        error: (err) => {
          console.error('Mutation error:', err);
        }
      });
    }
    else {
      this.gameService.createGame(this.gameName)
      .subscribe({
        next: (result) => {
          // console.log('Mutation result:', result);
          // console.log(result.data?.createGame);
          this.gameName = '';
        },
        error: (err) => {
          console.error('Mutation error:', err);
        }
      });
    }
  }

  onResetSelected() {
    this.selectedForUpdate.set(null);
    this.gameName = '';
  }

  onOpen(game: Game) {
    this.gameService.setSelectedGame(game);
    this.router.navigate(['/players']);
  }

  onUpdate(game: Game) {
    this.gameName = game.name;
    this.selectedForUpdate.set(game);
  }

  onRequestDelete(game: Game) {
    this.selectedForDelete.set(game);
  }

  onConfirmDelete() {
    const game = this.selectedForDelete();
    if (game) {
      this.gameService.deleteGame(game.id).subscribe({
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

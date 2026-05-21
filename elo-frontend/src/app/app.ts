import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Game } from './model/game.model';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { GameService } from './services/gameService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Header, RouterOutlet],
  templateUrl: 'html/app.html',
})
export class App {
  private gamesService = inject(GameService);
  games = signal<Game[]>([]);
  loading = signal(true);
  error = signal('');

  handleSubsrcibe() {
    console.log("all is wotkong");
    this.error.set("all is wotkong");
    alert("all is wotkong");
  }

  showAlert() {
    alert("click");
  }

  constructor(private gameService: GameService) {
    /*this.gamesService.getGames().subscribe({
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
    });*/
  }

  protected get games2() {
    return [];//this.gameService.games2();
  }
}
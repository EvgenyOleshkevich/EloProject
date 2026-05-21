import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormsModule } from '@angular/forms';
import { Game } from '../model/game.model';
import { CREATE_GAME } from '../queries/queries';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [FormsModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private apollo = inject(Apollo);
  @Output() subscribeClicked = new EventEmitter<void>();
  gameName = '';

  onSubscribe() {
    this.subscribeClicked.emit();
    this.apollo.mutate<{ createGame: Game }>({
      mutation: CREATE_GAME,
      variables: {
        name: this.gameName,
      },
      refetchQueries: ['GetGames'],
    }).subscribe({
      next: (result) => {
        console.log('Mutation result:', result);
        console.log(result.data?.createGame);
      },
      error: (err) => {
        console.error('Mutation error:', err);
      }
    });
  }
}

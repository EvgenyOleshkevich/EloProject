import { Component, Input, Output, EventEmitter, computed, signal, ElementRef, HostListener, inject, input } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Game } from '../../model/game.model';

@Component({
  selector: 'app-game-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-picker.html',
  styleUrl: './game-picker.css',
})
export class GamePickerComponent {
  private elRef = inject(ElementRef);
  gameSearch = signal('');
  isGameDropdownOpen = signal(false);
  games = input<Game[]>([]);

  @Output() selectGame = new EventEmitter<Game>();
  @Output() clearGame = new EventEmitter<void>();

  onSelectGame(game: Game) {
    this.gameSearch.set(game.name);
    this.isGameDropdownOpen.set(false);
    this.selectGame.emit(game);
  }

  onClearGame() {
    this.isGameDropdownOpen.set(false);
    this.gameSearch.set('');
    this.clearGame.emit();
  }

  filteredGames = computed(() => {
    const query = this.gameSearch().trim().toLowerCase();

    if (!query) {
      return this.games();
    }

    return this.games().filter((game) =>
      game.name.toLowerCase().includes(query)
    );
  });

  toggleDropdown() {
    this.isGameDropdownOpen.update(v => !v);
  }

  openDropdown() {
    this.isGameDropdownOpen.set(true);
  }

  closeDropdown() {
    this.isGameDropdownOpen.set(false);
  }

  onSearchInput(value: string) {
    this.gameSearch.set(value);
    this.isGameDropdownOpen.set(true);
  }

  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      const clickedInside = this.elRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeDropdown();
      }
  }
}

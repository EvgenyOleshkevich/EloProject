import { Component, inject, computed, signal, ElementRef, HostListener, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { GameService } from '../../services/gameService';
import { MatchService } from '../../services/matchService';
import { Game } from '../../model/game.model';
import { Match } from '../../model/match.model';
import { Table } from '../../utils/table/table';
import { Column } from '../../model/column.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/playerService';
import { Player } from '../../model/player.model';
import { MatchResult } from '../../model/Enums';
import { GamePickerComponent } from '../../utils/game-picker/game-picker';
import { DeleteConfirmModal } from '../../modal/delete-confirm-modal/delete-confirm-modal';
import { renderMatchResult } from '../../utils/renders/columnRender';
import { RadioButtonsComponent } from '../../utils/radio-buttons/radio-buttons';
import { RadioOption } from '../../utils/radio-buttons/radio-option';


@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, GamePickerComponent, DeleteConfirmModal, RadioButtonsComponent],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class Matches {
  private gameService = inject(GameService);
  private playerService = inject(PlayerService);
  private matchService = inject(MatchService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  MatchResult = MatchResult;
  games = signal<Game[]>([]);
  isGameFromService = signal(true);
  selectedGame = signal<Game | null>(null);
  selectedForDelete = signal<Match | null>(null);

  matches = signal<Match[]>([]);
  columns: Column<Match>[] = [
    { key: 'player1', title: 'Player 1' },
    { key: 'player2', title: 'Player 2' },
    { key: 'result', title: 'Result', render:  row => renderMatchResult(row.result) },
  ];


  resultOptions: RadioOption<MatchResult>[] = [
    { id: 1, title: renderMatchResult(MatchResult.Player1Win), value: MatchResult.Player1Win },
    { id: 2, title: renderMatchResult(MatchResult.Draw), value: MatchResult.Draw },
    { id: 3, title: renderMatchResult(MatchResult.Player2Win), value: MatchResult.Player2Win },
  ];

  players = signal<Player[]>([]);
  player1Search = signal('');
  player2Search = signal('');
  selectedPlayer1 = signal<Game | null>(null);
  selectedPlayer2 = signal<Game | null>(null);
  result = signal<MatchResult | null>(null);
  isPlayer1DropdownOpen = signal(false);
  isPlayer2DropdownOpen = signal(false);
  @ViewChild('field1') field1Ref!: ElementRef;
  @ViewChild('field2') field2Ref!: ElementRef;

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
      return;
    }
    if (this.isFormInvalid()) {
      return;
    }
    const player1 = this.selectedPlayer1();
    const player2 = this.selectedPlayer2();
    const result = this.result();
    if (!player1 || !player2 || !result) {
      console.error('player is not selected');
      return;
    }


    
    this.matchService.create(game.id, player1.id, player2.id, result)
    .subscribe({
      next: (result) => {
        this.resetForm();
      },
      error: (err) => {
        console.error('Mutation error:', err);
      }
    });
  }

  resetForm() {
    this.player1Search.set('');
    this.player2Search.set('');
    this.result.set(null);
    this.isPlayer1DropdownOpen.set(false);
    this.isPlayer2DropdownOpen.set(false);
  }

  selectGame(game: Game) {
    this.selectedGame.set(game);
    
    this.playerService.getPlayersByGame(game.id).subscribe(players => {
      this.players.set(players);
    });
    this.matchService.getMatchesByGame(game.id).subscribe(matches => {
      this.matches.set(matches);
    });
  }

  clearGame() {
    this.selectedGame.set(null);
    this.matches.set([]);
  }

  filteredPlayers1 = computed(() => {
    const query = this.player1Search().trim().toLowerCase();
    const secondName = this.selectedPlayer2()?.name.trim().toLowerCase();

    return this.players()
      .filter(player => {
        const name = player.name.toLowerCase();

        if (!query) {
          return name !== secondName;
        }

        return name.includes(query) && name !== secondName;
      })
      .slice(0, 5);
  });

  filteredPlayers2 = computed(() => {
    const query = this.player2Search().trim().toLowerCase();
    const firstName = this.selectedPlayer1()?.name.trim().toLowerCase();

    return this.players()
      .filter(player => {
        const name = player.name.toLowerCase();

        if (!query) {
          return name !== firstName;
        }

        return name.includes(query) && name !== firstName;
      })
      .slice(0, 5);
  });

  isPlayer1Empty = computed(() => this.selectedPlayer1() === null);
  isPlayer2Empty = computed(() => this.selectedPlayer2() === null);
  arePlayersSame = computed(() => this.selectedPlayer1()?.id === this.selectedPlayer2()?.id);
  isResultEmpty = computed(() => this.result() === null);

  isFormInvalid = computed(() => {
    return (
      this.isPlayer1Empty() === null ||
      this.isPlayer2Empty() === null ||
      this.arePlayersSame() ||
      this.isResultEmpty()
    );
  });

  onPlayer1Input(value: string) {
    this.player1Search.set(value);
    this.isPlayer1DropdownOpen.set(true);
    this.isPlayer2DropdownOpen.set(false);
  }

  onPlayer2Input(value: string) {
    this.player2Search.set(value);
    this.isPlayer1DropdownOpen.set(false);
    this.isPlayer2DropdownOpen.set(true);
  }

  selectPlayer1(player: Player) {
    this.selectedPlayer1.set(player);
    this.player1Search.set(player.name);
    this.isPlayer1DropdownOpen.set(false);
  }

  selectPlayer2(player: Player) {
    this.selectedPlayer2.set(player);
    this.player2Search.set(player.name);
    this.isPlayer2DropdownOpen.set(false);
  }

  setResult(result: MatchResult) {
    this.result.set(result);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside1 = this.field1Ref?.nativeElement?.contains(event.target);
    const clickedInside2 = this.field2Ref?.nativeElement?.contains(event.target);

    if (!clickedInside1) {
      this.isPlayer1DropdownOpen.set(false);
    }

    if (!clickedInside2) {
      this.isPlayer2DropdownOpen.set(false);
    }
  }

  onOpen(match: Match) {
    console.log('open', match);
  }

  onRequestDelete(match: Match) {
    this.selectedForDelete.set(match);
  }

  onConfirmDelete() {
    const match = this.selectedForDelete();
    if (match) {
      this.matchService.delete(match.gameId, match.id).subscribe({
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

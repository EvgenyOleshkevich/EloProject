import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { GameService } from '../../services/gameService';
import { TournamentService } from '../../services/tournamentService';
import { Game } from '../../model/game.model';
import { Tournament } from '../../model/tournament.model';
import { Table } from '../../utils/table/table';
import { Column } from '../../model/column.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RadioButtonsComponent } from '../../utils/radio-buttons/radio-buttons';
import { GamePickerComponent } from '../../utils/game-picker/game-picker';
import { TournamentInput } from '../../model/inputs/tournamentInput';
import { TournamentType, CompetitionStatus } from '../../model/Enums';
import { RadioOption } from '../../utils/radio-buttons/radio-option';
import { renderCompetitionStatus, renderTournamentType } from '../../utils/renders/columnRender';
import { DeleteConfirmModal } from '../../modal/delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-tournaments',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, RadioButtonsComponent, GamePickerComponent, DeleteConfirmModal],
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.css',
})
export class Tournaments {
private gameService = inject(GameService);
  private tournamentService = inject(TournamentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  games = signal<Game[]>([]);
  isGameFromService = signal(true);
  selectedGame = signal<Game | null>(null);
  tournaments = signal<Tournament[]>([]);
  selectedForUpdate = signal<Tournament | null>(null);
  selectedForDelete = signal<Tournament | null>(null);
  tournamentInput: TournamentInput = {
    id: '',
    name: '',
    type: TournamentType.SingleElimination,
    status: CompetitionStatus.Planned
  };
  errorMessage = signal<string | null>(null);
  columns: Column<Tournament>[] = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'type', title: 'Type', render:  row => renderTournamentType(row.type) },
    { key: 'status', title: 'Status', render: row => renderCompetitionStatus(row.status) },
    { key: 'createdAt', title: 'Created At' },
  ];
  typeOptions: RadioOption<TournamentType>[] = [
    { id: 1, title: renderTournamentType(TournamentType.SingleElimination), value: TournamentType.SingleElimination },
    { id: 2, title: renderTournamentType(TournamentType.DoubleElimination), value: TournamentType.DoubleElimination },
    { id: 3, title: renderTournamentType(TournamentType.Round), value: TournamentType.Round },
  ];
  statusOptions: RadioOption<CompetitionStatus>[] = [
    { id: 1, title: renderCompetitionStatus(CompetitionStatus.Planned), value: CompetitionStatus.Planned },
    { id: 2, title: renderCompetitionStatus(CompetitionStatus.Ongoing), value: CompetitionStatus.Ongoing },
    { id: 3, title: renderCompetitionStatus(CompetitionStatus.Completed), value: CompetitionStatus.Completed },
    { id: 4, title: renderCompetitionStatus(CompetitionStatus.Canceled), value: CompetitionStatus.Canceled },
  ];

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
    if (this.tournamentInput.name == '') {
      console.error('tournament name is empty');
      this.errorMessage.set('tournament name is empty');
      return;
    }
    
    const tournament = this.selectedForUpdate();
      console.log({ ...this.tournamentInput })
    if (tournament){
      this.tournamentService.updateAndRefetch(this.tournamentInput, game.id)
      .subscribe({
        next: () => {
          this.errorMessage.set(null);
        },
        error: (err) => {
          console.error('Mutation error:', err);
          this.errorMessage.set('tournament name is busy');
        }
      });
    }
    else {
      this.tournamentInput.id = game.id
      this.tournamentService.create(this.tournamentInput)
      .subscribe({
        next: (result) => {
          this.tournamentInput.name = '';
          this.tournamentInput.type = TournamentType.SingleElimination;
          this.tournamentInput.status = CompetitionStatus.Planned;
          this.errorMessage.set(null);
        },
        error: (err) => {
          console.error('Mutation error:', err);
          this.errorMessage.set('tournament name is busy');
        }
      });
    }
  }

  selectGame(game: Game) {
    this.selectedGame.set(game);
    this.tournamentService.getTournamentsByGame(game.id).subscribe(tournaments => {
      this.tournaments.set(tournaments);
    });
  }

  clearGame() {
    this.selectedGame.set(null);
    this.tournaments.set([]);
  }

  onOpen(tournament: Tournament) {
    this.tournamentService.setSelectedTournament(tournament);
    switch (tournament.status) {
      case CompetitionStatus.Planned:
        this.router.navigate(['/tournament']);
        break;
      case CompetitionStatus.Ongoing:
        this.router.navigate(['/ongoingTournament']);
        break;
      case CompetitionStatus.Completed:
        this.router.navigate(['/finishedTournament']);
        break;
    }
  }

  onResetSelected() {
    this.selectedForUpdate.set(null);
    this.tournamentInput.name = '';
    this.tournamentInput.type = TournamentType.SingleElimination;
    this.tournamentInput.status = CompetitionStatus.Planned;
  }
  
  onUpdate(tournament: Tournament) {
    this.tournamentInput.id = tournament.id;
    this.tournamentInput.name = tournament.name;
    this.tournamentInput.type = tournament.type;
    this.tournamentInput.status = tournament.status;
    this.selectedForUpdate.set(tournament);
  }
  
  onRequestDelete(tournament: Tournament) {
    this.selectedForDelete.set(tournament);
  }

  onConfirmDelete() {
    const tournament = this.selectedForDelete();
    if (tournament) {
      this.tournamentService.delete(tournament.gameId, tournament.id).subscribe({
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

  onChangeType(type: TournamentType) {
    this.tournamentInput.type = type;
  }

  onChangeStatus(status: CompetitionStatus) {
    this.tournamentInput.status = status;
  }


}

import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../../services/tournamentService';
import { Player } from '../../../model/player.model';
import { Column } from '../../../model/column.model';
import { Tournament } from '../../../model/tournament.model';
import { TournamentInput } from '../../../model/inputs/tournamentInput';
import { CompetitionStatus, TournamentType, PlayersOrder, MatchResult } from '../../../model/Enums';
import { Table } from '../../../utils/table/table';
import { RadioOption } from '../../../utils/radio-buttons/radio-option';
import { OrderOptions, renderTournamentType, StatusOptions, TypeOptions } from '../../../utils/renders/columnRender';
import { MatchService } from '../../../services/matchService';
import { MatchInput } from '../../../model/inputs/matchInput';
import { EliminationActive } from '../../../utils/brackets/elimination-active/elimination-active';

@Component({
  selector: 'app-finished-tournament',
  standalone: true,
  imports: [CommonModule, Table, EliminationActive],
  templateUrl: './finished.html',
  styleUrl: '../tournament.css',
})
export class TournamentFinishedComponent {
  private tournamentService = inject(TournamentService);
  private matchService = inject(MatchService);
  private router = inject(Router);

  tournament = signal<Tournament | null>(null);
  loading = signal(true);
  notFound = signal(false);
  isSimpleInput = signal(true);

  columns: Column<Player>[] = [
    { key: 'name', title: 'Name' },
    { key: 'elo', title: 'Score' },
  ];
  orderOptions: RadioOption<PlayersOrder>[] = OrderOptions;
  typeOptions: RadioOption<TournamentType>[] = TypeOptions;
  statusOptions: RadioOption<CompetitionStatus>[] = StatusOptions;


  playersInTournament = computed(() => {
    return this.tournament()?.players ?? [];
  });

  tournamentType = computed(() => {
    const tournament = this.tournament();
    return tournament ? renderTournamentType(tournament.type) : '';
  });

  canBeUpdated = computed(() => {
    const tournament = this.tournament();

    return !!tournament &&
      tournament.matches.every(m => m.status === CompetitionStatus.Planned);
  });

  ngOnInit() {
    const tournament = this.tournamentService.selectedTournament();
    if (tournament == null) {
      this.router.navigate(['/404']);
      return;
    }

    this.loading.set(true);
    this.notFound.set(false);

    this.tournamentService.getTournament(tournament.id).subscribe({
      next: (tournament) => {
        if (!tournament) {
          this.tournament.set(null);
          this.notFound.set(true);
          this.loading.set(false);
          return;
        }

        if (tournament.status !== CompetitionStatus.Completed) {
          this.router.navigate(['/404']);
          return;
        }

        this.tournament.set(tournament);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load tournament', err);
        this.tournament.set(null);
        this.notFound.set(true);
        this.loading.set(false);
        this.router.navigate(['/404']);
      }
    });
  }

}

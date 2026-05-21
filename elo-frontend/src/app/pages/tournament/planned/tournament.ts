import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../services/playerService';
import { TournamentService } from '../../../services/tournamentService';
import { Player } from '../../../model/player.model';
import { Column } from '../../../model/column.model';
import { Tournament } from '../../../model/tournament.model';
import { TournamentInput } from '../../../model/inputs/tournamentInput';
import { CompetitionStatus, TournamentType, PlayersOrder } from '../../../model/Enums';
import { Table } from '../../../utils/table/table';
import { RadioOption } from '../../../utils/radio-buttons/radio-option';
import { RadioButtonsComponent } from '../../../utils/radio-buttons/radio-buttons';
import { OrderOptions, StatusOptions, TypeOptions } from '../../../utils/renders/columnRender';
import { isSamePosition, buildOriginalPlayersPosition, isRosterSame, getReorderedMatches } from '../../../utils/functions';
import { BracketSlotRef, PlayerPosition } from '../../../model/bracketSlotRef.model';
import { SingleEliminationBracket } from '../../../utils/brackets/single-elimination-bracket/single-elimination-bracket';
import { DoubleEliminationBracket } from '../../../utils/brackets/double-elimination-bracket/double-elimination-bracket';


@Component({
  selector: 'app-tournament',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, RadioButtonsComponent, SingleEliminationBracket, DoubleEliminationBracket],
  templateUrl: './tournament.html',
  styleUrl: '../tournament.css',
})
export class TournamentPlannedComponent {
  private tournamentService = inject(TournamentService);
  private playerService = inject(PlayerService);
  private router = inject(Router);

  isAddingPlayers = signal<boolean>(false);
  players = signal<Player[]>([]);
  playersInTournament = signal<Player[]>([]);
  playersSearch = signal('');
  playersOrder: PlayersOrder = PlayersOrder.FromList;

  tournament = signal<Tournament | null>(null);
  tournamentType = signal<TournamentType>(TournamentType.SingleElimination);
  loading = signal(true);
  notFound = signal(false);

  tournamentInput: TournamentInput = {
    id: '',
    name: '',
    type: TournamentType.SingleElimination,
    status: CompetitionStatus.Planned
  };
  errorMessage = signal<string | null>(null);
  columns: Column<Player>[] = [
    { key: 'name', title: 'Name' },
    { key: 'elo', title: 'Score' },
  ];
  orderOptions: RadioOption<PlayersOrder>[] = OrderOptions;
  typeOptions: RadioOption<TournamentType>[] = TypeOptions;
  statusOptions: RadioOption<CompetitionStatus>[] = StatusOptions;

  originalPlayersPosition = signal<Map<string, PlayerPosition> | null>(null);
  originalPlayersRoster = signal<Set<string> | null>(null);

  playersNotInTournament = computed(() => {
    const set = new Set(this.playersInTournament().map(player => player.id))
    return this.players().filter(player => !set.has(player.id));
  });

  filteredAvailablePlayers = computed(() => {
    const query = this.playersSearch().trim().toLowerCase();

    if (!query) {
      return this.playersNotInTournament();
    }

    return this.playersNotInTournament().filter(player =>
      player.name.toLowerCase().includes(query)
    );
  });

  arePlayersReordered = computed(() => {
    const tournament = this.tournament();
    const map = this.originalPlayersPosition()
    if (!tournament || !map || tournament.status !== CompetitionStatus.Planned) {
      return false;
    }
    return !isSamePosition(tournament.matches, map);
  });

  isRosterChanged = computed(() => {
    const set = this.originalPlayersRoster();
    if (!set) {
      return false;
    }
    return !isRosterSame(this.playersInTournament(), set);
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
        console.log(tournament)
        if (!tournament) {
          this.tournament.set(null);
          this.notFound.set(true);
          this.loading.set(false);
          return;
        }
        this.tournament.set(tournament);
        this.playersInTournament.set(tournament.players);
        this.originalPlayersRoster.set(new Set(tournament.players.map(p => p.id)));
        this.loading.set(false);
        this.tournamentType.set(tournament.type);
        this.originalPlayersPosition.set(buildOriginalPlayersPosition(tournament.matches));
        this.tournamentInput = {
          id: tournament.id,
          name: tournament.name,
          type: tournament.type,
          status: tournament.status
        }
      },
      error: (err) => {
        console.error('Failed to load tournament', err);
        this.tournament.set(null);
        this.notFound.set(true);
        this.loading.set(false);
        this.router.navigate(['/404']);
      }
    });

    this.playerService.getPlayersByGame(tournament.gameId).subscribe(players => {
      this.players.set(players);
    });
  }

  onSubmitInfo() {
    if (this.tournamentInput.name == '') {
      console.error('tournament name is empty');
      this.errorMessage.set('tournament name is empty');
      return;
    }

    this.tournamentService.update(this.tournamentInput)
    .subscribe({
      next: ({ data }) => {
        this.errorMessage.set(null);
        const updatedTournament = data?.updateTournament ?? null;

        if (!updatedTournament) {
          //this.errorMessage.set('Tournament was not updated');
          //this.saving.set(false);
          return;
        }
        this.tournamentType.set(updatedTournament.type);
        this.tournament.update( current => {
          if (!current || !updatedTournament) {
            return current;
          }
          return {
            ...current,
            name: updatedTournament.name,
            type: updatedTournament.type,
            status: updatedTournament.status,
          };
        });
      },
      error: (err) => {
        console.error('Mutation error:', err);
        this.errorMessage.set('tournament name is busy');
      }
    });
    
  }

  onStartTournament() {
    const tournament = this.tournament();
    if (!tournament) {
      return;
    }

    const input: TournamentInput = {
      id: tournament.id,
      name: tournament.name,
      type: tournament.type,
      status: CompetitionStatus.Ongoing
    }

    this.tournamentService.updateStatus(input)
    .subscribe({
      next: ({ data }) => {
        const updatedTournament = data?.updateTournament ?? null;
        console.log(updatedTournament)
        if (!updatedTournament) {
          return;
        }
        this.router.navigate(['/ongoingTournament']);
      },
      error: (err) => {
        console.error('Mutation error:', err);
      }
    });
    
  }

  onChangeType(type: TournamentType) {
    this.tournamentInput.type = type;
  }

  onChangeStatus(status: CompetitionStatus) {
    this.tournamentInput.status = status;
  }

  onSearchInput(value: string) {
    this.playersSearch.set(value);
  }

  onClearSearchInput() {
    this.playersSearch.set('');
  }

  onPlayerAdd(player: Player) {
    this.playersInTournament.update(players => [...players, player]);
  }

  onPlayerRemove(player: Player) {
    this.playersInTournament.update(players => players.filter(p => p.id !== player.id));
  }

  onChangeOrder(order: PlayersOrder) {
    this.playersOrder = order;
  }

  onRequestAddingPlayers() {
    const tournament = this.tournament()
    if (!tournament) {
      console.error('Failed to load tournament');
      this.router.navigate(['/404']);
      return;
    }
    this.isAddingPlayers.update( value => !value);
  }

  onPlayersSubmit() {
    const tournament = this.tournament()
    if (!tournament) {
      console.error('Failed to load tournament');
      this.router.navigate(['/404']);
      return;
    }

    this.tournamentService.addPlayers(tournament.id, Array.from(this.playersInTournament().map(player => player.id)), this.playersOrder)
    .subscribe({
      next: ({ data }) => {
        const matches = data?.addPlayersToTournament ?? null;
        console.error(data);
        if (!matches) {
          //this.errorMessage.set('Tournament was not updated');
          //this.saving.set(false);
          return;
        }
        
        this.originalPlayersRoster.set(new Set(this.playersInTournament().map(p => p.id)));
        this.tournament.update( current => {
          if (!current) {
            return current;
          }
          this.isAddingPlayers.update( value => !value);

          this.tournamentInput = {
            id: current.id,
            name: current.name,
            type: current.type,
            status: current.status
          }
          return {
            ...current,
            players: this.playersInTournament(),
            matches: matches
          };
        });

      },
      error: (err) => {
        console.error('Mutation error:', err);
      }
    });
  }

  onOrderSubmit() {
    const tournament = this.tournament()
    const map = this.originalPlayersPosition()
    if (!tournament || !map) {
      console.error('Failed to load tournament');
      this.router.navigate(['/404']);
      return;
    }
    
    this.tournamentService.reorderPlayers(tournament.id, getReorderedMatches(tournament.matches, map))
    .subscribe({
      next: ({ data }) => {
        const matches = data?.reorderMatches ?? null;
        if (!matches?.length) {
          //this.errorMessage.set('Tournament was not updated');
          //this.saving.set(false);
          return;
        }
        
        const updatedMatchesById = new Map(matches.map(m => [m.id, m]));
        this.tournament.update( current => {
          if (!current) {
            return current;
          }

          const nextMatches = current.matches.map(match =>
            updatedMatchesById.get(match.id) ?? match
          );

          this.originalPlayersPosition.set(
            buildOriginalPlayersPosition(nextMatches)
          );

          return {
            ...current,
            nextMatches
          };
        });

      },
      error: (err) => {
        console.error('Mutation error:', err);
      }
    });
  }

  onCancelAddingPlayers() {
    const tournament = this.tournament()
    if (!tournament) {
      console.error('Failed to load tournament');
      this.router.navigate(['/404']);
      return;
    }
    this.playersInTournament.set(tournament.players);
    this.isAddingPlayers.update( value => !value);

    this.tournamentInput = {
      id: tournament.id,
      name: tournament.name,
      type: tournament.type,
      status: tournament.status
    }
  }

  onSwapPlayers([source, target]: [BracketSlotRef, BracketSlotRef]) {
    this.tournament.update(current => {
      if (!current) {
        return current;
      }
      const matches = current.matches.map(match => ({ ...match }));

      const sourceMatch = matches.find(m => m.id === source.matchId);
      const targetMatch = matches.find(m => m.id === target.matchId);

      if (!sourceMatch || !targetMatch) {
        return current;
      }

      const sourcePlayerId = source.slot === 1 ? sourceMatch.player1Id : sourceMatch.player2Id;
      const sourcePlayer = source.slot === 1 ? sourceMatch.player1 : sourceMatch.player2;

      const targetPlayerId = target.slot === 1 ? targetMatch.player1Id : targetMatch.player2Id;
      const targetPlayer = target.slot === 1 ? targetMatch.player1 : targetMatch.player2;

      if (source.slot === 1) {
        sourceMatch.player1Id = targetPlayerId;
        sourceMatch.player1 = targetPlayer;
      } else {
        sourceMatch.player2Id = targetPlayerId;
        sourceMatch.player2 = targetPlayer;
      }

      if (target.slot === 1) {
        targetMatch.player1Id = sourcePlayerId;
        targetMatch.player1 = sourcePlayer;
      } else {
        targetMatch.player2Id = sourcePlayerId;
        targetMatch.player2 = sourcePlayer;
      }

      return {
        ...current,
        matches,
      };
    });
  }

}

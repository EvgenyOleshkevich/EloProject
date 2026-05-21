import { Component, computed, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { MatchService } from '../../services/matchService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table } from '../../utils/table/table';
import { PlayerService } from '../../services/playerService';
import { Router } from '@angular/router';
import { Column } from '../../model/column.model';
import { Match } from '../../model/match.model';
import { MatchResult } from '../../model/Enums';
import { Player } from '../../model/player.model';
import { ChartData } from 'chart.js';

function renderPlayerMatchResult(match: Match, playerId: string): string {
  if (!match.result) {
    return '';
  }

  if (match.result === MatchResult.Draw) {
    return 'Draw';
  }

  const isCurrentPlayer1 = match.player1Id === playerId;

  if (match.result === MatchResult.Player1Win) {
    return isCurrentPlayer1 ? 'Win' : 'Lose';
  }

  if (match.result === MatchResult.Player2Win) {
    return isCurrentPlayer1 ? 'Lose' : 'Win';
  }

  return '';
}

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, BaseChartDirective],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class PlayerComponent {
  private playerService = inject(PlayerService);
  private matchService = inject(MatchService);
  private router = inject(Router);

  matches = signal<Match[]>([]);

  player = signal<Player | null>(null);
  loading = signal(true);
  notFound = signal(false);

  
  playerName = '';
  errorMessage = signal<string | null>(null);
  matchColumns = computed<Column<Match>[]>(() => {
    const player = this.player();

    return [
      { key: 'player1', title: 'Player 1' },
      { key: 'player2', title: 'Player 2' },
      {
        key: 'result',
        title: 'Result',
        render: (match: Match) => player
          ? renderPlayerMatchResult(match, player.id)
          : '',
      },
    ];
  });

  ratingChartPoints = computed(() => {
    const player = this.player();
    if (!player) {
      return [];
    }

    const matches = this.matches();

    if (matches.length < 10) {
      return [];
    }

    const chronological = [...matches].reverse().filter(m => m.rating1 && m.rating2).slice(5);

    return chronological
      .map((match, index) => ({
        x: index,
        rating: match.player1Id === player.id ? match.rating1 : match.rating2,
        date: match.playedAt,
      }));
  });

  ratingChartPath = computed(() => {
    const points = this.ratingChartPoints();

    if (points.length < 2) {
      return '';
    }

    const width = 680;
    const height = 220;
    const padding = 24;

    const ratings = points.map(p => p.rating);
    const min = Math.min(...ratings);
    const max = Math.max(...ratings);

    const scaleX = (index: number) =>
      padding + (index / (points.length - 1)) * (width - padding * 2);

    const scaleY = (rating: number) => {
      if (max === min) {
        return height / 2;
      }

      return height - padding - ((rating - min) / (max - min)) * (height - padding * 2);
    };

    return points
      .map((point, index) => {
        const x = scaleX(index);
        const y = scaleY(point.rating);

        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');
  });

  ratingChartData = computed<ChartData<'line'> | undefined>(() => {
    const player = this.player();
    if (!player) {
      return undefined;
    }

    const matches = this.matches();

    if (matches.length < 10) {
      return undefined;
    }

    const chartMatches = [...matches].reverse().filter(m => m.rating1 && m.rating2).slice(5);
    const data = {
          label: 'Rating',
          data: chartMatches.map(match => match.player1Id === player.id ? match.rating1 : match.rating2,), // замени поле
          tension: 0.35,
          fill: false,
        };
    console.log(data);

    return {
      labels: chartMatches.map((_, index) => index + 6),
      datasets: [
        {
          label: 'Rating',
          data: chartMatches.map(match => match.player1Id === player.id ? match.rating1 : match.rating2,), // замени поле
          tension: 0.35,
          fill: false,
        },
      ],
    };
  });

  ratingChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
      },
      line: {
        tension: 0.35,
      },
    },
  };

  ngOnInit() {
    const player = this.playerService.selectedPlayer();
    if (player == null) {
      this.router.navigate(['/404']);
      return;
    }
    this.player.set(player);
    this.playerName = player.name;

    this.loading.set(true);
    this.notFound.set(false);

    this.matchService.getMatchesByPlayer(player.id).subscribe({
      next: (matches) => {
        if (!matches) {
          this.player.set(null);
          this.notFound.set(true);
          this.loading.set(false);
          return;
        }
        this.matches.set(matches);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load player', err);
        this.player.set(null);
        this.notFound.set(true);
        this.loading.set(false);
        this.router.navigate(['/404']);
      }
    });
  }

  onSubmit() {
    if (this.playerName == '') {
      console.error('player name is empty');
      this.errorMessage.set('player name is empty');
      return;
    }

    const player = this.player();
    if (!player) {
      return;
    }

    this.playerService.update(player.gameId, player.id, this.playerName)
    .subscribe({
      next: ({ data }) => {
        this.errorMessage.set(null);
        const updatedPlayer = data?.updatePlayer ?? null;
        if (!updatedPlayer) {
          //this.errorMessage.set('Player was not updated');
          //this.saving.set(false);
          return;
        }
        this.player.set(updatedPlayer);
      },
      error: (err) => {
        console.error('Mutation error:', err);
        this.errorMessage.set('player name is busy');
      }
    });
    
  }



}


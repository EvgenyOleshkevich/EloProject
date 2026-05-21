import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, input, Output, signal } from '@angular/core';
import { BracketSlotRef, SlotNumber } from '../../../model/bracketSlotRef.model';
import { buildConnectorsActive, buildMatchLayouts, buildMatchLayoutsDoubleElimination } from '../../functions';
import { Match } from '../../../model/match.model';
import { CompetitionStatus, MatchResult, TournamentType } from '../../../model/Enums';
import { Tournament } from '../../../model/tournament.model';
import { ConnectorLayout, MatchPath } from '../../../model/connectorLayout.model';
import { MatchInput } from '../../../model/inputs/matchInput';
import { MatchResultDialogComponent } from '../../../modal/match-result-dialog-component/match-result-dialog-component';


@Component({
  selector: 'app-elimination-active',
  standalone: true,
  imports: [CommonModule, MatchResultDialogComponent],
  templateUrl: './elimination-active.html',
  styleUrl: '../bracket.css',
})
export class EliminationActive {
  tournament = input<Tournament | null>(null);
  @Input() isSimpleInput = true;
  @Input() readonly = true;
  @Output() completeMatch = new EventEmitter<MatchInput>();
  
  selectedMatch = signal<Match | null>(null);
  hoveredPlayerId = signal<string | null>(null);
  hoveredMatchPath = signal<MatchPath | null>(null);

  matchLayouts = computed(() => {
    const tournament = this.tournament();
    if (!tournament) {
      return [];
    }

    if (tournament.type === TournamentType.DoubleElimination) {
      const layouts = buildMatchLayoutsDoubleElimination(tournament.matches);
      return [...layouts.winnerLayouts, ...layouts.loserLayouts];
    }
    
    return buildMatchLayouts(tournament.matches);
  });

  connectors = computed(() => buildConnectorsActive(this.matchLayouts()));

  svgWidth = computed(() => {
    const layouts = this.matchLayouts();

    if (!layouts.length) {
      return 24;
    }

    return Math.max(...layouts.map(l => l.x + l.width)) + 24;
  });

  svgHeight = computed(() => {
    const layouts = this.matchLayouts();

    if (!layouts.length) {
      return 200;
    }

    return Math.max(...layouts.map(l => l.y + l.height)) + 24;
  });

  onMatchClick(match: Match, slot: SlotNumber) {
    if (this.readonly) {
      return;
    }
    if (match.status !== CompetitionStatus.Planned ||
      !match.player1Id ||
      !match.player2Id
    ) {
      return;
    }

    if (this.isSimpleInput) {
      this.completeMatch.emit({
        id: match.id,
        score1: null,
        score2: null,
        result: slot === 1 ? MatchResult.Player1Win : MatchResult.Player2Win
      });
      return;
    }
    this.selectedMatch.set(match);
  }

  submitMatchInput(input: MatchInput) {
    this.completeMatch.emit(input);
    this.selectedMatch.set(null);
  }

  closeModal() {
    this.selectedMatch.set(null);
  }

  onSlotRefHover(match: Match, slot: SlotNumber) {
    const playerId = slot === 1 ? match.player1Id : match.player2Id;
    if (playerId !== null) {
      this.hoveredPlayerId.set(playerId);
      this.hoveredMatchPath.set(null);
    }
    else {
      this.hoveredPlayerId.set(null);
      const prevMatchId = slot === 1 ? match.tournamentInfo.previousMatch1Id : match.tournamentInfo.previousMatch2Id;
      this.hoveredMatchPath.set({
        fromMatchId: prevMatchId,
        toMatchId:match.id,
        slot: slot,
      });
    }
  }

  onSlotRefLeave() {
    this.hoveredPlayerId.set(null);
    this.hoveredMatchPath.set(null);
  }

  isBracketSlotHighlighted(match: Match, slot: SlotNumber): boolean {
    const hoveredPlayerId = this.hoveredPlayerId();
    const playerId = slot === 1 ? match.player1Id : match.player2Id;
    if (hoveredPlayerId) {
      return playerId === hoveredPlayerId;
    }

    const path = this.hoveredMatchPath();
    if (!path) {
      return false;
    }
    return match.id === path.toMatchId && slot === path.slot;
  }

  isConnectorHighlighted(connector: ConnectorLayout): boolean {
    const playerId = this.hoveredPlayerId();
    if (playerId) {
      if (connector.passedPlayerId === playerId) {
        return true;
      }
      return false;
    }

    const path = this.hoveredMatchPath();
    if (!path) {
      return false;
    }
    return connector.fromMatchId === path.fromMatchId && connector.toMatchId === path.toMatchId;
  }

  getSlotResultClass(match: Match, slot: SlotNumber): string {
    if (!match.result) {
      return '';
    }

    if (match.result === MatchResult.Draw) {
      return 'match-slot--draw';
    }

    const isPlayer1 = slot === 1;

    if (
      (match.result === MatchResult.Player1Win && isPlayer1) ||
      (match.result === MatchResult.Player2Win && !isPlayer1)
    ) {
      return 'match-slot--winner';
    }

    return 'match-slot--loser';
  }
}

import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragPlaceholder, DragDropModule, } from '@angular/cdk/drag-drop';
import { Component, computed, EventEmitter, input, Output, signal } from '@angular/core';
import { BracketSlotRef, SlotNumber } from '../../../model/bracketSlotRef.model';
import { buildConnectorsDoubleElimination, buildMatchLayoutsDoubleElimination } from '../../functions';
import { Match } from '../../../model/match.model';
import { CompetitionStatus } from '../../../model/Enums';
import { Tournament } from '../../../model/tournament.model';
import { ConnectorLayout, MatchPath } from '../../../model/connectorLayout.model';

@Component({
  selector: 'double-elimination-bracket',
  standalone: true,
  imports: [CommonModule, DragDropModule, CdkDragPlaceholder],
  templateUrl: './double-elimination-bracket.html',
  styleUrl: '../bracket.css',
})
export class DoubleEliminationBracket {
  tournament = input<Tournament | null>(null);
  @Output() swapPlayers = new EventEmitter<[BracketSlotRef, BracketSlotRef]>();

  dragSource: BracketSlotRef | null = null;
  dragTarget: BracketSlotRef | null = null;
  hoveredPlayerId = signal<string | null>(null);
  hoveredMatchPath = signal<MatchPath | null>(null);

  matchLayouts = computed(() => {
    const tournament = this.tournament();
    if (!tournament) {
      return {winnerLayouts: [], loserLayouts: []};
    }

    return buildMatchLayoutsDoubleElimination(tournament.matches);
  });

  connectors = computed(() => buildConnectorsDoubleElimination(this.matchLayouts()));

  svgWidth = computed(() => {
    const { winnerLayouts, loserLayouts } = this.matchLayouts();

    const layouts = [...winnerLayouts, ...loserLayouts];

    if (!layouts.length) {
      return 24;
    }

    return Math.max(...layouts.map(l => l.x + l.width)) + 24;
  });

  svgHeight = computed(() => {
    const { winnerLayouts, loserLayouts } = this.matchLayouts();

    const layouts = [...winnerLayouts, ...loserLayouts];

    if (!layouts.length) {
      return 200;
    }

    return Math.max(...layouts.map(l => l.y + l.height)) + 24;
  });

  canReorderBracket = computed(() => {
    const tournament = this.tournament();
    return !!tournament && tournament.status === CompetitionStatus.Planned;
  });

  onSwapPlayers(source: BracketSlotRef, target: BracketSlotRef) {
    this.swapPlayers.emit([source, target]);
  }
  
  canDragSlot(match: Match, slot: SlotNumber) {
    if (slot === 1) {
      return match.player1Id !== null;
    }
    else {
      return match.player2Id !== null;
    }
  }

  createSlotRef(match: Match, slot: SlotNumber): BracketSlotRef {
    return {
      matchId: match.id,
      slot,
      playerId: slot === 1 ? match.player1Id : match.player2Id,
      playerName: slot === 1 ? match.player1 : match.player2,
    };
  }

  onDrop(event: CdkDragDrop<BracketSlotRef>) {
    const source = event.item.data;      // откуда тащили
    const target = event.container.data; // куда бросили

    this.onSwapPlayers(source, target);
  }

  getSlotDropListId(matchId: string, slot: SlotNumber): string {
    return `slot-${matchId}-${slot}`;
  }

  allSlotDropListIds = computed(() => {
    const tournament = this.tournament();
    if (!tournament || tournament.status != CompetitionStatus.Planned) {
      return [];
    }
    
    return tournament.matches.flatMap(match => {
      const res: string[] = [];
      if (match.player1Id) {
        res.push(this.getSlotDropListId(match.id, 1))
      }
      if (match.player2Id) {
        res.push(this.getSlotDropListId(match.id, 2))
      }
      return res;
    });
  });

  onDropListEntered(event: CdkDragEnter<BracketSlotRef>) {
    this.dragTarget = event.container.data;
  }

  onDropListExited(_: CdkDragExit<BracketSlotRef>) {
    this.dragTarget = null;
  }


  onDragStarted(slotRef: BracketSlotRef): void {
    this.onSlotRefLeave();
    this.dragSource = slotRef;
    this.dragTarget = null;
  }

  onDragEnded(): void {
    this.dragSource = null;
    this.dragTarget = null;
  }

  isRenderExtra(playerId: string): boolean {
    return this.dragSource?.playerId === playerId && this.dragTarget?.playerId !== null && this.dragTarget?.playerId !== playerId;
  }

  getTargetSlotText(): string {
    return this.dragTarget?.playerName || '';
  }

  isDragTarget(matchId: string, slot: SlotNumber): boolean {
    return this.dragTarget?.matchId === matchId
        && this.dragTarget?.slot === slot;
  }

  onSlotRefHover(match: Match, slot: SlotNumber) {
    if (this.dragSource) {
      return;
    }
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
    if (this.dragSource) {
      return;
    }
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
}

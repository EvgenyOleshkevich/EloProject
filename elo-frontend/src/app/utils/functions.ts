import { inject } from "@angular/core";
import { BracketRound } from "../model/bracketRound.model";
import { MatchOrder, PlayerPosition } from "../model/bracketSlotRef.model";
import { ConnectorLayout } from "../model/connectorLayout.model";
import { BracketType } from "../model/Enums";
import { getWinner, Match } from "../model/match.model";
import { DoubleEliminationLayouts, MatchLayout } from "../model/matchLayout.model";
import { Player } from "../model/player.model";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/userService";

export function buildWinnerRounds(matches: Match[]): BracketRound[] {
  const grouped = new Map<number, Match[]>();

  for (const match of matches) {
    if (match.tournamentInfo.bracketType !== BracketType.Winner) {
      continue;
    }

    const round = match.tournamentInfo.round;
    const roundMatches = grouped.get(round) ?? [];
    roundMatches.push(match);
    grouped.set(round, roundMatches);
  }

  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([round, roundMatches]) => ({
      round,
      matches: roundMatches.sort(
        (a, b) => a.tournamentInfo.position - b.tournamentInfo.position
      ),
    }));
}

export function buildMatchLayoutsOld(rounds: BracketRound[]): MatchLayout[] {
  const MATCH_WIDTH = 220;
  const MATCH_HEIGHT = 72;
  const ROUND_GAP = 80;
  const BASE_STEP = MATCH_HEIGHT + 24;
  const START_X = 24;
  const START_Y = 24;

  const layouts: MatchLayout[] = [];

  rounds.forEach((round, roundIndex) => {
    const x = START_X + roundIndex * (MATCH_WIDTH + ROUND_GAP);
    const step = BASE_STEP * Math.pow(2, roundIndex);

    round.matches.forEach((match, index) => {
      const y = START_Y + index * step + (step - MATCH_HEIGHT) / 2;

      layouts.push({
        match,
        round: round.round,
        index,
        x,
        y,
        width: MATCH_WIDTH,
        height: MATCH_HEIGHT,
      });
    });
  });

  return layouts;
}

export function buildMatchLayouts(matches: Match[]): MatchLayout[] {
  const MATCH_WIDTH = 220;
  const MATCH_HEIGHT = 72;
  const ROUND_GAP = 80;
  const VERTICAL_GAP = 24;
  const START_X = 24;
  const START_Y = 160;

  const matchMap = new Map(matches.map(match => [match.id, match]));
  const layouts = new Map<string, MatchLayout>();

  const finalMatch = matches.find(
    match => match.tournamentInfo.nextWinMatchId == null
  );

  if (!finalMatch) {
    return [];
  }

  const rounds = finalMatch.tournamentInfo.round;
  const offsets = Array.from({ length: rounds }, (_, index) =>
    computeOffset(index, MATCH_HEIGHT, VERTICAL_GAP)
  );

  const getX = (round: number) => START_X + (round - 1) * (MATCH_WIDTH + ROUND_GAP);

  const placeMatch = (
    match: Match,
    y: number
  ) => {
    if (layouts.has(match.id)) {
      return;
    }

    const x = getX(match.tournamentInfo.round);

    layouts.set(match.id, {
      match,
      round: match.tournamentInfo.round,
      index: match.tournamentInfo.position, 
      x,
      y,
      width: MATCH_WIDTH,
      height: MATCH_HEIGHT,
    });

    const prev1Id = match.tournamentInfo.previousMatch1Id;
    const prev2Id = match.tournamentInfo.previousMatch2Id;
    const offset = offsets[match.tournamentInfo.round - 1];

    if (prev1Id != null) {
        const prev1 = matchMap.get(prev1Id);
        if (prev1 != null) {
          placeMatch(prev1, y - offset);
        }
    }

    if (prev2Id != null) {
        const prev2 = matchMap.get(prev2Id);
        if (prev2 != null) {
          placeMatch(prev2, y + offset);
        }
    }
  };

  placeMatch(finalMatch, START_Y);

  return Array.from(layouts.values());
}

export function buildMatchLayoutsDoubleElimination(matches: Match[]): DoubleEliminationLayouts {
  const MATCH_WIDTH = 220;
  const MATCH_HEIGHT = 72;
  const ROUND_GAP = 80;
  const VERTICAL_GAP = 24;
  const START_X = 24;
  const START_Y = 160;

  const matchMap = new Map(matches.map(match => [match.id, match]));
  const layouts = [new Map<string, MatchLayout>(), new Map<string, MatchLayout>()];

  const finalMatch = matches.find(
    match => match.tournamentInfo.nextWinMatchId == null
  );

  if (!finalMatch) {
    return {winnerLayouts: [], loserLayouts: []};
  }

  const rounds = finalMatch.tournamentInfo.round;
  const winnerOffsets = Array.from({ length: rounds }, (_, index) =>
    computeOffset(index, MATCH_HEIGHT, VERTICAL_GAP)
  );

  const loserFinalMatch = matchMap.get(finalMatch.tournamentInfo.previousMatch2Id);
  if (!loserFinalMatch) {
    return {winnerLayouts: [], loserLayouts: []};
  }
  const loserOffsets = Array.from({ length: loserFinalMatch.tournamentInfo.round }, (_, index) =>
    computeLoseOffset(index, MATCH_HEIGHT, VERTICAL_GAP)
  );

  const semiFinalMatch = matchMap.get(finalMatch.tournamentInfo.previousMatch1Id);
  if (!semiFinalMatch) {
    return {winnerLayouts: [], loserLayouts: []};
  }

  const offsets = [winnerOffsets, loserOffsets];

  const getX = [
    (round: number) => START_X + (round < 3 ? (round - 1) : (2 * round - 3)) * (MATCH_WIDTH + ROUND_GAP),
    (round: number) => START_X + (round) * (MATCH_WIDTH + ROUND_GAP)];

  const built = new Set();

  const placeMatch = (
    match: Match,
    y: number,
    bracket: number,
  ) => {
    built.add(match.id)
    const x = getX[bracket](match.tournamentInfo.round);

    layouts[bracket].set(match.id, {
      match,
      round: match.tournamentInfo.round,
      index: match.tournamentInfo.position, 
      x,
      y,
      width: MATCH_WIDTH,
      height: MATCH_HEIGHT,
    });

    const prev1Id = match.tournamentInfo.previousMatch1Id;
    const prev2Id = match.tournamentInfo.previousMatch2Id;
    const offset = offsets[bracket][match.tournamentInfo.round - 1];

    if (prev1Id != null && !built.has(prev1Id)) {
        const prev1 = matchMap.get(prev1Id);
        if (prev1 != null) {
          placeMatch(prev1, y - offset, bracket);
        }
    }

    if (prev2Id != null && !built.has(prev2Id)) {
        const prev2 = matchMap.get(prev2Id);
        if (prev2 != null) {
          placeMatch(prev2, y + offset, bracket);
        }
    }
  };

  placeMatch(semiFinalMatch, START_Y, 0);
  placeMatch(loserFinalMatch, START_Y * 3, 1);
  placeMatch(finalMatch, START_Y, 0);

  return {
    winnerLayouts: Array.from(layouts[0].values()),
    loserLayouts: Array.from(layouts[1].values())
  };
}

export function buildConnectors(layouts: MatchLayout[]): ConnectorLayout[] {
  const layoutMap = new Map(layouts.map(layout => [layout.match.id, layout]));
  const connectors: ConnectorLayout[] = [];

  for (const layout of layouts) {
    const nextMatchId = layout.match.tournamentInfo.nextWinMatchId;

    if (!nextMatchId) {
      continue;
    }

    const target = layoutMap.get(nextMatchId);

    if (!target) {
      continue;
    }

    connectors.push(сreateConnector(layout, target));
  }

  return connectors;
}

export function buildConnectorsDoubleElimination(doubleLayouts: DoubleEliminationLayouts): ConnectorLayout[] {
  const winnerLayouts = doubleLayouts.winnerLayouts;
  const loserLayouts = doubleLayouts.loserLayouts

  const layoutMap = new Map([...winnerLayouts.map(layout => [layout.match.id, layout] as [string, MatchLayout]), ...loserLayouts.map(layout => [layout.match.id, layout] as [string, MatchLayout])]);
  const connectors: ConnectorLayout[] = [];

  for (const layout of winnerLayouts) {
    const nextWinMatchId = layout.match.tournamentInfo.nextWinMatchId;
    const nextLoseMatchId = layout.match.tournamentInfo.nextLoseMatchId;

    if (nextWinMatchId) {
      const target = layoutMap.get(nextWinMatchId);
      if (target) {
        connectors.push(сreateConnector(layout, target));
      }
    }

    if (nextLoseMatchId) {
      const target = layoutMap.get(nextLoseMatchId);
      if (target) {
        connectors.push(сreateConnector(layout, target, false));
      }
    }
  }

  for (const layout of loserLayouts) {
    const nextMatchId = layout.match.tournamentInfo.nextWinMatchId;
    if (nextMatchId) {
      const target = layoutMap.get(nextMatchId);
      if (target) {
        connectors.push(сreateConnector(layout, target));
      }
    }
  }
  return connectors;
}

export function buildConnectorsActive(layouts: MatchLayout[]): ConnectorLayout[] {
  const layoutMap = new Map(layouts.map(layout => [layout.match.id, layout]));
  const connectors: ConnectorLayout[] = [];

  for (const layout of layouts) {
    const nextWinMatchId = layout.match.tournamentInfo.nextWinMatchId;
    const nextLoseMatchId = layout.match.tournamentInfo.nextLoseMatchId;

    if (nextWinMatchId) {
      const target = layoutMap.get(nextWinMatchId);
      if (target) {
        connectors.push(сreateConnector(layout, target));
      }
    }

    if (nextLoseMatchId) {
      const target = layoutMap.get(nextLoseMatchId);
      if (target) {
        connectors.push(сreateConnector(layout, target, false));
      }
    }
  }
  return connectors;
}

function сreateConnector(source: MatchLayout, target: MatchLayout, isVisible: boolean = true): ConnectorLayout {
  const fromX = source.x + source.width;
  const fromY = source.y + source.height / 2;

  const toX = target.x;
  const toY = target.y + target.height / 2;

  const midX = fromX + (toX - fromX) / 2;

  const path = [
    `M ${fromX} ${fromY}`,
    `L ${midX} ${fromY}`,
    `L ${midX} ${toY}`,
    `L ${toX} ${toY}`,
  ].join(' ');

  return {
    fromMatchId: source.match.id,
    toMatchId: target.match.id,
    passedPlayerId: getWinner(source.match),
    path,
    isVisible: isVisible
  };
}

function computeOffset(round: number, matchHeight: number, verticalGap: number): number {
  const base = matchHeight + verticalGap;
  return Math.pow(2, round - 2) * base;
}

function computeLoseOffset(round: number, matchHeight: number, verticalGap: number): number {
  const base = matchHeight + verticalGap;
  if (round % 2 === 1) {
    return 0;
  }
  else {
    return Math.pow(2, round / 2 - 2) * base;
  }
}

export function isSamePosition(matches: Match[], players: Map<string, PlayerPosition>) : boolean {
  let currentPlayersCount = 0;
  for (const match of matches) {
    if (match.player1Id !== null) {
      currentPlayersCount++;
      const pos = players.get(match.player1Id);
      if (pos?.matchId !== match.id || pos?.slot !== 1) {
        return false;
      }
    }
    if (match.player2Id !== null) {
      currentPlayersCount++;
      const pos = players.get(match.player2Id);
      if (pos?.matchId !== match.id || pos?.slot !== 2) {
        return false;
      }
    }
  }
  return currentPlayersCount === players.size;
}

export function buildOriginalPlayersPosition(matches: Match[]) : Map<string, PlayerPosition> {
  const map = new Map<string, PlayerPosition>();
  for (const match of matches) {
    if (match.player1Id !== null) {
      map.set(match.player1Id, {matchId: match.id, slot: 1});
    }
    if (match.player2Id !== null) {
      map.set(match.player2Id, {matchId: match.id, slot: 2});
    }
  }
  return map;
}

export function getReorderedMatches(matches: Match[], players: Map<string, PlayerPosition>) : MatchOrder[] {
  return  matches.filter(match => {
    if (match.player1Id !== null) {
      const pos = players.get(match.player1Id);
      if (pos?.matchId !== match.id || pos?.slot !== 1) {
        return true;
      }
    }
    if (match.player2Id !== null) {
      const pos = players.get(match.player2Id);
      if (pos?.matchId !== match.id || pos?.slot !== 2) {
        return true;
      }
    }
    return false;
  }).map(match => ({
    matchId: match.id,
    player1Id: match.player1Id,
    player2Id: match.player2Id,
  }));;
}

export function isRosterSame(players: Player[], set: Set<string>) : boolean {
    if (set.size !== players.length)
      return false;
    for (const player of players) {
      if (!set.has(player.id)) {
        return false;
      }
    }
    return true;
}


export const authGuard: CanActivateFn = (route) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const roles = route.data['roles'] as string[] | undefined;

  if (!roles?.length) {
    return true;
  }

  const userRole = userService.user()?.role;

  if (userRole && roles.includes(userRole)) {
    return true;
  }

  return router.createUrlTree(['/403']);
};
import { MatchLayout } from "./matchLayout.model";

export interface BracketSlotRef {
  matchId: string;
  slot: SlotNumber;
  playerId: string | null;
  playerName: string | null;
}

export  type SlotNumber = 1 | 2;

export type PlayerPosition = {
  matchId: string;
  slot: 1 | 2;
};

export interface MatchOrder {
  matchId: string;
  player1Id: string | null;
  player2Id: string | null;
}

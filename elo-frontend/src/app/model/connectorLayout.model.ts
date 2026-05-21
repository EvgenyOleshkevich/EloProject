import { SlotNumber } from "./bracketSlotRef.model";

export interface ConnectorLayout {
    fromMatchId: string;
    toMatchId: string;
    passedPlayerId: string | null
    path: string;
    isVisible: boolean;
}

export type MatchPath = {
    fromMatchId: string;
    toMatchId: string;
    slot: SlotNumber;
}
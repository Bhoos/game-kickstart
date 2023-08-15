import { AbcdActionConsumer } from './Abcd.js';
import { Card } from '@bhoos/cards';
import { StartGameAction } from './actions/StartGameAction.js';

export interface AbcdStatePlayer {
  id: string;
  name: string;
  picture: string;

  cards: Card[];
  cardsLength: number;
}

export const ABCD_STAGE_START = 1;
export const ABCD_STAGE_PLAY = 2;

export type ABCD_STAGE = typeof ABCD_STAGE_START | typeof ABCD_STAGE_PLAY;

export class AbcdState implements AbcdActionConsumer<void> {
  stage: ABCD_STAGE = ABCD_STAGE_START;
  players: AbcdStatePlayer[] = [];
  userIdx: number = -1;

  turn: number = -1;

  onStartGame(action: StartGameAction): void {
    this.stage = ABCD_STAGE_PLAY;
    this.players = action.players.map(player => ({
      id: player.id,
      name: player.name,
      picture: player.picture,

      cards: [],
      cardsLength: 0,
    }));

    this.userIdx = action.userIdx;
  }
}

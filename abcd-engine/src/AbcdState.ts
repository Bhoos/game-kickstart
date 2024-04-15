import { AbcdActionConsumer } from './Abcd.js';
import { StartGameAction } from './actions/StartGameAction.js';
import { PlayAction } from './actions/PlayAction.js';
import { FinishGameAction } from './actions/FinishGameAction.js';

export interface AbcdStatePlayer {
  id: string;
  name: string;
  picture: string;

  clickCount: number;
}

export const ABCD_STAGE_START = 1;
export const ABCD_STAGE_PLAY = 2;
export const ABCD_STAGE_END = 3;


export type ABCD_STAGE = typeof ABCD_STAGE_START | typeof ABCD_STAGE_PLAY | typeof ABCD_STAGE_END;

export class AbcdState implements AbcdActionConsumer<void> {
  stage: ABCD_STAGE = ABCD_STAGE_START;
  players: AbcdStatePlayer[] = [];
  userIdx: number = -1;

  turn: number = -1;
  winnerIdx: number = -1;

  onStartGame(action: StartGameAction): void {
    this.stage = ABCD_STAGE_PLAY;
    this.players = action.players.map(player => ({
      id: player.id,
      name: player.name,
      picture: player.picture,

      clickCount: 0,
    }));

    this.userIdx = action.userIdx;
    this.turn = 0;
  }

  onPlay(action: PlayAction): void {
    this.players[action.playerIdx].clickCount++;
  }

  onFinishGame(action: FinishGameAction): void {
    this.stage = ABCD_STAGE_END;
    this.winnerIdx = action.winnerIdx;
  }
}

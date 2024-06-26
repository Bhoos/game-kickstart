import { Action, Client, Event, Match, Timer } from '@bhoos/game-kit-engine';
import { Abcd } from './Abcd.js';
import { AbcdState } from './AbcdState.js';
import { PLAY_TIMER } from './AbcdLoop.js';
import { PlayApi } from './apis/PlayApi.js';

export class AbcdBot implements Client<Abcd> {
  playerId: string;
  playerIdx: number;
  state: AbcdState;
  match: Match<Abcd>;

  constructor(playerId: string, match: Match<Abcd>) {
    this.playerId = playerId;
    this.state = match.getState();
    this.playerIdx = match.getPlayers().findIndex(p => p.id === playerId);
    this.match = match;
  }

  end(_code: number): void {}

  dispatch(_action: Action<Abcd>): void {}

  emit(event: Event<Abcd>): void {
    if (event instanceof Timer) {
      if (event.target != this.playerIdx) return;
      if (event.type === PLAY_TIMER) {
        this.match.execute(PlayApi.create(this.playerIdx), this).catch(console.error);
      }
    }
  }
}

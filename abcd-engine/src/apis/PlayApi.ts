import { Api } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd } from '../Abcd.js';
import { ABCD_STAGE_PLAY, AbcdState } from '../AbcdState.js';
import { assert } from '../utils/utils.js';

export class PlayApi extends Api<Abcd> {
  playerIdx!: number;

  serialize(serializer: Serializer): void {
    this.playerIdx = serializer.uint8(this.playerIdx);
  }

  static validate(api: PlayApi, state: AbcdState, playerIdx: number) {
    assert(state.stage === ABCD_STAGE_PLAY, "Current stage is not PLAY");
    assert(playerIdx === api.playerIdx, "playerIdx for Client and API payload don't match");
  }

  static create(playerIdx: number) {
    const instance = new PlayApi();

    instance.playerIdx = playerIdx;
    return instance;
  }
}

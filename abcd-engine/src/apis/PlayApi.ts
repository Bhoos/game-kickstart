import { Card, serializeCard } from '@bhoos/cards';
import { Api } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd } from '../Abcd.js';
import { AbcdState } from '../AbcdState.js';
import { assert } from '../utils/utils.js';

export class PlayApi extends Api<Abcd> {
  playerIdx!: number;
  card!: Card;

  serialize(serializer: Serializer): void {
    this.card = serializeCard(this.card, serializer);
    this.playerIdx = serializer.uint8(this.playerIdx);
  }

  static validate(api: PlayApi, state: AbcdState, playerIdx: number) {
    assert(playerIdx === state.turn % state.players.length, 'It is not your turn');
    assert(playerIdx === api.playerIdx, "playerIdx for Client and API payload don't match");
    assert(
      state.players[playerIdx].cards.findIndex(c => c.is(api.card)) != -1,
      "Player doesn't have this card to play it",
    );
  }

  static create(playerIdx: number, card: Card) {
    const instance = new PlayApi();

    instance.playerIdx = playerIdx;
    instance.card = card;
    return instance;
  }
}

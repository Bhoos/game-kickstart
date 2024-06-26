import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd, AbcdActionConsumer } from '../Abcd.js';

export class PlayAction extends Action<Abcd> {
  playerIdx!: number;

  forwardTo<R>(consumer: AbcdActionConsumer<R>): R {
    return consumer.onPlay(this);
  }

  serialize(serializer: Serializer) {
    this.playerIdx = serializer.uint8(this.playerIdx);
  }

  personalize(_client: Client<Abcd>, _match: Match<Abcd>) {
    return this;
  }

  static create(playerIdx: number) {
    const instance = new PlayAction();
    instance.playerIdx = playerIdx;

    return instance;
  }
}

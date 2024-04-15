import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd, AbcdActionConsumer } from '../Abcd.js';

export class FinishGameAction extends Action<Abcd> {
  winnerIdx!: number;

  forwardTo<R>(consumer: AbcdActionConsumer<R>): R {
    return consumer.onFinishGame(this);
  }

  serialize(serializer: Serializer) {
    this.winnerIdx = serializer.uint8(this.winnerIdx);
  }

  personalize(_client: Client<Abcd>, _match: Match<Abcd>) {
    return this;
  }

  static create(winnerIdx: number) {
    const instance = new FinishGameAction();
    instance.winnerIdx = winnerIdx;

    return instance;
  }
}

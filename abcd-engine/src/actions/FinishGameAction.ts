import { Serializer } from '@bhoos/serialization';
import { Abcd, AbcdActionConsumer } from '../Abcd.js';
import { Action } from '@bhoos/game-kit-engine';
import { Card, serializeCard, serializeCardGroups } from '@bhoos/cards';

export class FinishGameAction extends Action<Abcd> {
  playerCards!: Card[][];
  winnerIdx!: number;

  forwardTo<R>(consumer: AbcdActionConsumer<R>): R {
    return consumer.onFinishGame(this);
  }

  serialize(serializer: Serializer) {
    this.playerCards = serializeCardGroups(this.playerCards, serializer);
    this.winnerIdx = serializer.uint8(this.winnerIdx);
  }

  static create(playerCards: Card[][], winnerIdx: number) {
    const instance = new FinishGameAction();

    instance.playerCards = playerCards;
    instance.winnerIdx = winnerIdx;

    return instance;
  }
}

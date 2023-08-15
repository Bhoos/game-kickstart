import { Card, serializeCard } from '@bhoos/cards';
import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd, AbcdActionConsumer } from '../Abcd.js';

export class PlayAction extends Action<Abcd> {
  card!: Card;
  playerIdx!: number;

  forwardTo<R>(consumer: AbcdActionConsumer<R>): R {
    return consumer.onPlay(this);
  }

  serialize(serializer: Serializer) {
    this.playerIdx = serializer.uint8(this.playerIdx);
    this.card = serializeCard(this.card, serializer);
  }

  personalize(client: Client<Abcd>, match: Match<Abcd>) {
    return this;
  }

  static create(playerIdx: number, card: Card) {
    const instance = new PlayAction();
    instance.card = card;
    instance.playerIdx = playerIdx;

    return instance;
  }
}

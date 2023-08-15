import { Card, serializeCard } from '@bhoos/cards';
import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd, AbcdActionConsumer } from '../Abcd.js';

export class ShuffleDeckAction extends Action<Abcd> {
  deck!: Card[];

  serialize(serializer: Serializer) {
    this.deck = serializer.array(this.deck, c => serializeCard(c, serializer));
  }

  forwardTo<R>(consumer: AbcdActionConsumer<R>): R {
    return consumer.onShuffleDeck(this);
  }

  personalize(client: Client<Abcd>, match: Match<Abcd>) {
    const instance = new ShuffleDeckAction();

    instance.deck = [];
    return instance as this;
  }

  static create(deck: Card[]) {
    const instance = new ShuffleDeckAction();

    instance.deck = deck;
    return instance;
  }
}

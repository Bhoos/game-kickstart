import { Card, serializeCard } from '@bhoos/cards';
import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd, AbcdActionConsumer } from '../Abcd.js';

export class PickAction extends Action<Abcd> {
  card!: Card;
  playerIdx!: number;
  fromDeck!: boolean;

  forwardTo<R>(consumer: AbcdActionConsumer<R>): R {
    return consumer.onPick(this);
  }

  serialize(serializer: Serializer) {
    this.playerIdx = serializer.uint8(this.playerIdx);
    this.card = serializeCard(this.card, serializer);
    this.fromDeck = serializer.bool(this.fromDeck);
  }

  personalize(client: Client<Abcd>, match: Match<Abcd>) {
    const instance = new PickAction();
    const playerIdx = match.getPlayers().findIndex(p => p.id === client.playerId);
    if (this.playerIdx == playerIdx || this.fromDeck == false) {
      instance.card = this.card;
    } else {
      instance.card = Card.Back;
    }
    instance.playerIdx = this.playerIdx;
    instance.fromDeck = this.fromDeck;

    return instance as this;
  }

  static create(playerIdx: number, card: Card, fromDeck: boolean) {
    const instance = new PickAction();
    instance.card = card;
    instance.playerIdx = playerIdx;
    instance.fromDeck = fromDeck;

    return instance;
  }
}

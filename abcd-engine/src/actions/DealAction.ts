import { Card, serializeCard, serializeCardGroups } from '@bhoos/cards';
import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd, AbcdActionConsumer } from '../Abcd.js';

export class DealAction extends Action<Abcd> {
  cardsLength!: number; // initial number of cards; for observer who can't see others cards
  cards!: Card[][];
  dealer!: number;

  joker!: Card;
  deck!: Card[];

  serialize(serializer: Serializer) {
    this.cards = serializeCardGroups(this.cards, serializer);
    this.cardsLength = serializer.uint8(this.cardsLength);
    this.dealer = serializer.uint8(this.dealer);

    this.joker = serializeCard(this.joker, serializer);
    this.deck = serializer.array(this.deck, c => serializeCard(c, serializer));
  }

  forwardTo<R>(consumer: AbcdActionConsumer<R>): R {
    return consumer.onDeal(this);
  }

  personalize(client: Client<Abcd>, match: Match<Abcd>) {
    const instance = new DealAction();
    const playerIdx = match.getPlayers().findIndex(p => p.id == client.playerId);
    instance.cards = this.cards.map((cards, idx) => (idx == playerIdx ? cards : []));
    instance.dealer = this.dealer;
    instance.cardsLength = this.cardsLength;

    instance.joker = this.joker;
    instance.deck = [];

    return instance as this;
  }

  static create(cards: Card[][], dealer: number, joker: Card, deck: Card[]) {
    const instance = new DealAction();

    instance.cardsLength = cards[0].length;
    instance.cards = cards;
    instance.dealer = dealer;

    instance.joker = joker;
    instance.deck = deck;
    return instance;
  }
}

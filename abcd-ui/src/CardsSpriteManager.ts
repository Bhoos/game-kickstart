import { CoordinateSystem, SpriteManager } from '@bhoos/game-kit-ui';
import { CardSprite } from './sprites';
import { Card } from '@bhoos/cards';

export class CardsSpriteManager extends SpriteManager {
  cardSprites: CardSprite[] = [];

  constructor(layout: CoordinateSystem) {
    super(layout);
  }

  findCard(card: Card) {
    const sp = this.cardSprites.find(c => c.card.is(card));
    if (!sp) {
      throw new Error(`Couldn't find card ${card.code}`);
    }
    return sp;
  }

  registerCardSprite(sprite: CardSprite) {
    this.cardSprites.push(sprite);
    return this.registerSprite(sprite);
  }
}

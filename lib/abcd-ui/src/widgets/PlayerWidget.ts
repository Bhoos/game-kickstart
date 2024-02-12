import { Widget, animateLayout, timingAnim } from '@bhoos/game-kit-ui';
import { CardsSpriteManager } from '../CardsSpriteManager';
import { CardSprite, ProfileSprite, ProfileSpriteProfile } from '../sprites';

type State = {
  color: string;
  profile: ProfileSpriteProfile;
};

type Layout = {
  x: number;
  y: number;
  zIndex: number;
  scale: number;
};

export class PlayerWidget extends Widget<Layout, State, CardsSpriteManager> {
  cardSprites: CardSprite[] = [];
  profileSprite: ProfileSprite;
  constructor(s: CardsSpriteManager, computeLayout: () => Layout, computeState: () => State) {
    super(s, computeLayout, computeState);
    this.profileSprite = s.registerSprite(new ProfileSprite());
    this.onLayoutUpdate();
  }

  protected onLayoutUpdate(): void {
    animateLayout(this.profileSprite, this.layout, timingAnim({ duration: 300, useNativeDriver: true }));
  }

  protected onDraw() {
    const state = this.state;
    this.profileSprite.profile.setValue(state.profile);
    this.profileSprite.color.setValue(state.color);
  }

  updateTurn() {
    const state = this.computeState();
    this.profileSprite.color.setValue(state.color);
  }
}

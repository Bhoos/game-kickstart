import { CoordinateSystem, Environment, SpriteManager, UI, animateLayout, delay, timingAnim } from '@bhoos/game-kit-ui';
import {
  DealAction,
  FinishGameAction,
  Abcd,
  AbcdState,
  PickAction,
  PickApi,
  PlayAction,
  PlayApi,
  StartGameAction,
} from '@bhoos/abcd-engine';
import { CardsSpriteManager } from './CardsSpriteManager';
import { CardSprite } from './sprites';
import { AbcdLayouts, computeLayouts, createWidgets } from './AbcdWidgets';
import { Card } from '@bhoos/cards';
import { arrangeCardsAbcd, computePileCards, playerOffset } from './utils';
import { ConfigOf } from '@bhoos/game-kit-engine/src/Game';

const ANIMATION_SPEED = 1;
const FLIP_SPEED_300 = ANIMATION_SPEED * 300;
const timing500 = timingAnim({ duration: ANIMATION_SPEED * 500, useNativeDriver: true });
const timing300 = timingAnim({ duration: ANIMATION_SPEED * 300, useNativeDriver: true });
const timing200 = timingAnim({ duration: ANIMATION_SPEED * 200, useNativeDriver: true });

export type AbcdUIEnv = Environment<Abcd>;

export class AbcdUI implements UI<Abcd, AbcdUIEnv> {
  protected sm: CardsSpriteManager;
  public state!: AbcdState;
  protected env!: AbcdUIEnv;

  public layouts: AbcdLayouts;
  private _layout: CoordinateSystem;
  private widgets;

  constructor(layout: CoordinateSystem, config: ConfigOf<Abcd>) {
    console.log('Creating UI');
    this._layout = layout;
    this.sm = new CardsSpriteManager(layout);
    this.layouts = computeLayouts(layout);
    this.widgets = createWidgets(this, this.sm, config);
    return this;
  }

  /// INTERACTION WITH GAME CLIENT
  onMatchEnd(): void {}

  onBackLog(backLog: number, catchup: () => Promise<void>): void {
    if (backLog > 20) {
      console.log('BackLog:', backLog, 'Catching Up');
      catchup();
    }
  }

  async onStateUpdate() {
    this.widgets.profiles.forEach(p => p.draw());
  }

  getSpriteManager(): SpriteManager {
    return this.sm;
  }

  onLayoutUpdate(layout: CoordinateSystem) {
    if (layout != this._layout) {
      this.widgets.profiles.forEach(p => p.updateLayout());
    }
  }

  onAttach(env: AbcdUIEnv) {
    console.log('Attaching UI');
    this.state = env.client.getState();
    this.env = env;
    return true;
  }

  onDetach(): void {}

  /// EVENT CONSUMER
  onTimer(): void {}

  onConnectionStatus(): void {}

  // USER INTERACTION
  async onUserPlay(card: CardSprite) {} // TODO

  // ACTION HANDLERS
  async onStartGame(action: StartGameAction) {
    return async () => {
      this.widgets.profiles.forEach(p => p.draw());
    };
  }
}

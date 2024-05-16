import { CoordinateSystem, Environment, SpriteManager, UI, UIActionReturn, timingAnim } from '@bhoos/game-kit-ui';
import {
  FinishGameAction,
  Abcd,
  AbcdState,
  PlayAction,
  PlayApi,
  StartGameAction,
} from '@bhoos/abcd-engine';
import { AbcdLayouts, computeLayouts, createWidgets } from './AbcdWidgets';
import { ConfigOf } from '@bhoos/game-kit-engine';

const ANIMATION_SPEED = 1;
const FLIP_SPEED_300 = ANIMATION_SPEED * 300;
const timing500 = timingAnim({ duration: ANIMATION_SPEED * 500, useNativeDriver: true });
const timing300 = timingAnim({ duration: ANIMATION_SPEED * 300, useNativeDriver: true });
const timing200 = timingAnim({ duration: ANIMATION_SPEED * 200, useNativeDriver: true });

export type AbcdUIEnv = Environment<Abcd>;

export class AbcdUI implements UI<Abcd, AbcdUIEnv> {
  protected sm: SpriteManager;
  public state!: AbcdState;
  protected env!: AbcdUIEnv;

  public layouts: AbcdLayouts;
  private _layout: CoordinateSystem;
  private widgets;

  constructor(layout: CoordinateSystem, config: ConfigOf<Abcd>) {
    console.log('Creating UI');
    this._layout = layout;
    this.sm = new SpriteManager(layout);
    this.layouts = computeLayouts(layout);
    this.widgets = createWidgets(this, this.sm, config);
    return this;
  }

  /// INTERACTION WITH GAME CLIENT
  onMatchEnd(): void {}

  onBackLog(backLog: number, catchup: () => Promise<void>): void {}

  async onStateUpdate() {
    for (let i = 0; i < this.state.players.length; i++) {
      this.widgets.profiles[i].draw();
    }
    this.widgets.playButton.draw();
  }

  getSpriteManager(): SpriteManager {
    return this.sm;
  }

  onLayoutUpdate(layout: CoordinateSystem) {
    this.widgets.profiles.forEach(p => p.updateLayout());
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
  async onUserPlay() {
    this.env.client.execute(PlayApi.create(this.state.userIdx)).catch(console.error);
  }

  // ACTION HANDLERS
  async onStartGame(action: StartGameAction) {
    return async () => {
      for (let i = 0; i < this.state.players.length; i++) {
        this.widgets.profiles[i].draw();
      }
      this.widgets.playButton.draw();
    };
  }

  onPlay(action: PlayAction): UIActionReturn {
    return () => {
      const offset = (action.playerIdx - this.state.userIdx + this.state.players.length) % this.state.players.length;
      this.widgets.profiles[offset].draw();
    }
  }

  onFinishGame(action: FinishGameAction): UIActionReturn {
    () => {
      const offset = (action.winnerIdx - this.state.userIdx + this.state.players.length) % this.state.players.length;
      this.widgets.profiles[offset].draw();
      this.widgets.playButton.draw();
    }
  }

}

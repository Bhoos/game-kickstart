import { CoordinateSystem, ReferenceMultiple, UI } from '@bhoos/game-kit-ui';
import { JUT_STAGE_END, Jut } from '@bhoos/jut-engine';
import { JutUI } from '@bhoos/jut-ui';
import { Prefs, RoomConfig, SuperUIEnv } from '@bhoos/super-app-interface';
import {
  CoinsPlugin,
  GameOverlayPlugin,
  UITestPlugin,
  pluginToUI,
} from '@bhoos/super-components';
import { UIPlugin } from '@bhoos/super-components/src/widgets/UIPlugin';
import { computeJutWinnings } from './JutWinnings';

export class SuperJutUI extends JutUI implements UI<Jut, SuperUIEnv<Jut>> {
  constructor(layout: CoordinateSystem, roomConfig: RoomConfig<Jut>, prefs: ReferenceMultiple<Prefs>) {
    super(layout, roomConfig.config, prefs);
    const ui = this;
    function plug(plugin: UIPlugin<Jut, SuperUIEnv<Jut>>) {
      pluginToUI<Jut, SuperUIEnv<Jut>>(ui, plugin, 'onStartGame', 'onFinishGame');
    }

    plug(
      new CoinsPlugin(layout, this.getSpriteManager(), () => {
        return computeJutWinnings(this.state, roomConfig, this.state.userIdx);
      }),
    );
    plug(
      new GameOverlayPlugin({
        layout,
        sm: this.getSpriteManager(),
        gameEnded: () => this.state && this.state.stage === JUT_STAGE_END,
      }),
    );
    plug(new UITestPlugin());
  }
}

import { CoordinateSystem, ReferenceMultiple, UI, UIActionReturn } from '@bhoos/game-kit-ui';
import { ABCD_STAGE_END, Abcd, FinishGameAction } from '@bhoos/abcd-engine';
import { AbcdUI } from '@bhoos/abcd-ui';
import { Prefs, RoomConfig, SuperUIEnv, UIPlugin, UIPlugins, pluginToUI } from '@bhoos/super-app-interface';
import { UITestPlugin } from '@bhoos/super-components';
import { computeAbcdWinnings } from './AbcdWinnings';

export class SuperAbcdUI extends AbcdUI implements UI<Abcd, SuperUIEnv<Abcd>> {
  constructor(
    layout: CoordinateSystem,
    roomConfig: RoomConfig<Abcd>,
    plugins: UIPlugins<Abcd>,
  ) {
    super(layout, roomConfig.config);
    const ui = this;
    function plug(plugin: UIPlugin<Abcd, SuperUIEnv<Abcd>>) {
      pluginToUI<Abcd, SuperUIEnv<Abcd>>(ui, plugin, 'onStartGame', 'onFinishGame');
    }

    const sm = this.getSpriteManager();
    if (plugins.coins) {
      plug(plugins.coins(sm, () => computeAbcdWinnings(this.state, roomConfig, this.state.userIdx)));
    }

    if (plugins.hotspotPin) {
      plug(plugins.hotspotPin(sm));
    }

    if (plugins.menu) {
      plug(plugins.menu(sm, () => this.state && this.state.stage === ABCD_STAGE_END));
    }

    if (plugins.leaderboard) {
      plug(plugins.leaderboard(sm));
    }

    plug(new UITestPlugin());
  }
}

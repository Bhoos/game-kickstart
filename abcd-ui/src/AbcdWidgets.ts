import { ABCD_STAGE_PLAY, AbcdConfig } from '@bhoos/abcd-engine';
import { CoordinateSystem, SpriteManager } from '@bhoos/game-kit-ui';
import { AbcdUI } from './AbcdUI';
import { PlayerWidget } from './widgets/PlayerWidget';
import { PlayWidget } from './widgets';

export function computeLayouts(dimensions: CoordinateSystem) {
  const profiles: PlayerWidget['layout'][] = [
    { x: 0, y: 0 }, // 1
    { x: 50, y: 0 }, // 2
    { x: 100, y: 0 }, // 3
    { x: 150, y: 0 }, // 4
  ];

  const playButton: PlayWidget['layout'] = {
    x: -100,
    y: 0,
    zIndex: 500
  }
  return {
    profiles,
    playButton,
  };
}

export type AbcdLayouts = ReturnType<typeof computeLayouts>;

function createPlayerWidget(sm: SpriteManager, ui: AbcdUI, offset: number) {
  return new PlayerWidget(
    sm,
    () => {
      return ui.layouts.profiles[offset];
    },
    () => {
      const state = ui.state;
      const playerIdx = (offset + state.userIdx) % state.players.length;
      const player = state.players[playerIdx];
      if (!player) {
        console.log(ui.state);
        throw new Error(`Invalid playerIdx ${playerIdx} ${ui.state}`);
      }
      return {
        isWinner: state.winnerIdx === playerIdx,
        profile: player,
      } as PlayerWidget['state'];
    },
  );
}

export function createWidgets(ui: AbcdUI, sm: SpriteManager, config: AbcdConfig) {
  return {
    profiles: [
      createPlayerWidget(sm, ui, 0),
      createPlayerWidget(sm, ui, 1),
      createPlayerWidget(sm, ui, 2),
      createPlayerWidget(sm, ui, 3),
    ],
    playButton: new PlayWidget(
      sm,
      () => ui.layouts.playButton,
      () => {
        return {
          active: ui.state.stage === ABCD_STAGE_PLAY
        }
      },
      {
        onPlay: ui.onUserPlay
      })
  };
}

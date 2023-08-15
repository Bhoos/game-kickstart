import { ABCD_STAGE_PLAY, AbcdConfig } from '@bhoos/abcd-engine';
import { CoordinateSystem } from '@bhoos/game-kit-ui';
import { CardsSpriteManager } from './CardsSpriteManager';
import { AbcdUI } from './AbcdUI';
import { PlayerWidget } from './widgets/PlayerWidget';

export const DIRECTIONS_IDX = { me: 0, east: 1, north: 2, west: 3 };
export const DIRECTIONS = ['me', 'east', 'north', 'west'];

export function computeLayouts(dimensions: CoordinateSystem) {
  const profiles: PlayerWidget['layout'][] = [
    {
      x: dimensions.xRight(50),
      y: dimensions.yBottom(90),
      zIndex: 500,
      scale: 1,
    },
    {
      x: dimensions.xRight(120),
      y: dimensions.yCentre(-70),
      zIndex: 500,
      scale: 1,
    },
    {
      x: dimensions.xCentre(0),
      y: dimensions.yTop(50),
      zIndex: 500,
      scale: 1,
    },
    {
      x: dimensions.xLeft(80),
      y: dimensions.yCentre(-70),
      zIndex: 500,
      scale: 1,
    },
  ];

  return {
    profiles,
  };
}

export type AbcdLayouts = ReturnType<typeof computeLayouts>;

function createPlayerWidget(sm: CardsSpriteManager, ui: AbcdUI, offset: number) {
  return new PlayerWidget(
    sm,
    () => {
      return ui.layouts.profiles[offset];
    },
    () => {
      const state = ui.state;
      const playerIdx = (offset + state.userIdx) % 4;
      const player = state.players[playerIdx];
      if (!player) {
        console.log(ui.state);
        throw new Error(`Invalid playerIdx ${playerIdx} ${ui.state}`);
      }
      return {
        color: state.turn % state.players.length === playerIdx && state.stage === ABCD_STAGE_PLAY ? 'green' : 'blue',
        cardsCount: offset === 0 ? 0 : player.cardsLength,
        isWinner: state.winnerIdx === playerIdx,
        profile: player,
      } as PlayerWidget['state'];
    },
  );
}

export function createWidgets(ui: AbcdUI, sm: CardsSpriteManager, config: AbcdConfig) {
  return {
    profiles: [
      createPlayerWidget(sm, ui, 0),
      createPlayerWidget(sm, ui, 1),
      createPlayerWidget(sm, ui, 2),
      createPlayerWidget(sm, ui, 3),
    ],
  };
}

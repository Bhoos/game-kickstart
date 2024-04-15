import { ABCD_STAGE_END, ABCD_STAGE_PLAY, ABCD_STAGE_START, Abcd, AbcdState } from '@bhoos/abcd-engine';
import { GameAppAnalyticsInterface, AnalyticsGameStageIdentifiers } from '@bhoos/super-app-interface';

export const AbcdAnalytics: GameAppAnalyticsInterface<Abcd> = {
  gameConfigId: room => `timer:${room.config.playTimer}`,
  gameExitStage: state => `st:${formatStage(state.stage)}`,
};

function formatStage(stage: AbcdState['stage']) {
  if (stage === ABCD_STAGE_END) return AnalyticsGameStageIdentifiers.matchEnd;
  if (stage === ABCD_STAGE_START) return AnalyticsGameStageIdentifiers.matchStart;
  return AnalyticsGameStageIdentifiers.failSafe;
}

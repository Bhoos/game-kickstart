import { JUT_STAGE_DEAL, JUT_STAGE_END, JUT_STAGE_PLAY, JUT_STAGE_START, Jut, JutState } from '@bhoos/jut-engine';
import { GameAppAnalyticsInterface, AnalyticsGameStageIdentifiers } from '@bhoos/super-app-interface';

export const JutAnalytics: GameAppAnalyticsInterface<Jut> = {
  gameConfigId: room => `cp:${room.config.cardsPerPlayer},bk:${room.config.books}`,
  gameExitStage: state => `st:${formatStage(state.stage)}`,
};

function formatStage(stage: JutState['stage']) {
  if (stage === JUT_STAGE_END) return AnalyticsGameStageIdentifiers.matchEnd;
  if (stage === JUT_STAGE_START) return AnalyticsGameStageIdentifiers.matchStart;
  if (stage === JUT_STAGE_DEAL) return AnalyticsGameStageIdentifiers.roundStart;
  if (stage === JUT_STAGE_PLAY) return AnalyticsGameStageIdentifiers.play;
  return AnalyticsGameStageIdentifiers.failSafe;
}

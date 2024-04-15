import { Timer, Match } from '@bhoos/game-kit-engine';
import { FinishGameAction, StartGameAction } from './actions/index.js';
import { ABCD_STAGE_PLAY, ABCD_STAGE_START } from './AbcdState.js';
import { PlayApi } from './apis/index.js';
import { Abcd } from './Abcd.js';
import { AbcdConfig } from './AbcdConfig.js';
import { validateConfig } from './utils/validateConfig.js';
import { PlayAction } from './actions/PlayAction.js';

export const PLAY_TIMER = 3000;

export async function AbcdLoop(match: Match<Abcd>, config: AbcdConfig) {
  // Initialization
  if (match.getEndingCode() !== null) return match;
  if (!validateConfig(match.getPlayers().length, config)) {
    console.error(`Invalid config`);
    return match.end(1);
  }

  const state = match.getState();

  const playTimer = match.createPersistentEvent(() => {
    return Timer.create(state.turn, PLAY_TIMER, state.turn % state.players.length, config.playTimer);
  });

  // Stage 1: GAME START
  if (state.stage === ABCD_STAGE_START) {
    match.dispatch(StartGameAction.create(match.getPlayers()));
  }

  // Stage 2: PLAY
  if (state.stage === ABCD_STAGE_PLAY) {
    await match.wait(playTimer, ({ onTimeout, on }) => {
      on(PlayApi, PlayApi.validate, api => {
        match.dispatch(PlayAction.create(api.playerIdx));
      });

      onTimeout(() => {});
    });

    const maxCount = state.players.reduce((acc, p) => Math.max(acc, p.clickCount), 0);
    const winnerIdx = state.players.findIndex(p => p.clickCount === maxCount);
    match.dispatch(FinishGameAction.create(winnerIdx));
  }

  match.end(0);
}

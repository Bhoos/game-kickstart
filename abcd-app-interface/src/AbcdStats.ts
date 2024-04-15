import { AbcdConfig, AbcdState } from '@bhoos/abcd-engine';
import { StatId } from '@bhoos/super-app-interface';

export function computeAbcdStats(state: AbcdState, config: AbcdConfig, playerIdx: number) {
  const stats = new Map<StatId | number, number>();
  stats.set(StatId.GamesPlayed, 1);

  const playerWon = state.winnerIdx != -1 && playerIdx === state.winnerIdx;
  stats.set(StatId.Rank1, playerWon ? 1 : 0);
  return stats;
}

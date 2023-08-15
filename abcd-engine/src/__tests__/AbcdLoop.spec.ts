import { Match } from '@bhoos/game-kit-engine';
import { testGameLoop } from '@bhoos/game-kit-tests';
import { AbcdState } from '../AbcdState';
import { Abcd, AbcdPlayer, AbcdBot, AbcdConfig, AbcdLoop, registerToOracle } from '..';
import { describe, test, expect } from 'vitest';
import { Oracle } from '@bhoos/serialization';

const DEFAULT_CONFIG: AbcdConfig = {
  playTimer: -1,
};

function createAbcdMatch(playersCount: number = 4) {
  const players: AbcdPlayer[] = [];
  for (var idx = 0; idx < playersCount; idx++) {
    players.push({
      id: `${idx}`,
      name: `player${idx}`,
      picture: `${idx}`,
    });
  }

  const match = new Match<Abcd>(players, AbcdState);
  players.map(p => {
    const bot = new AbcdBot(p.id, match);
    match.join(bot);
    return bot;
  });
  return match;
}

describe('Game Loop runs correctly', () => {
  test('game-kit-test succeeds', async () => {
    const oracle = new Oracle();
    registerToOracle(oracle);

    const out = await testGameLoop<Abcd>(
      AbcdState,
      () => createAbcdMatch(),
      match => AbcdLoop(match, DEFAULT_CONFIG),
      oracle,
      10,
    );
    if (out != null) console.log(out);
    expect(out).toBeNull();
  });
});

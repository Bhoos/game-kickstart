import { EventConsumer, Game, Timer } from '@bhoos/game-kit-engine';
import { AbcdState } from './AbcdState.js';
import { StartGameAction } from './actions';
import { Oracle } from '@bhoos/serialization';
import { PlayApi } from './apis';
import { AbcdConfig } from './AbcdConfig.js';

export interface AbcdActionConsumer<Return> {
  onStartGame(action: StartGameAction): Return;
}

export interface AbcdEventConsumer extends EventConsumer {}

export type AbcdPlayer = {
  id: string;
  name: string;
  picture: string;
};

export type Abcd = Game<AbcdActionConsumer<never>, AbcdState, AbcdEventConsumer, AbcdPlayer, AbcdConfig>;

export function registerToOracle(oracle: Oracle): Oracle {
  const actions = [StartGameAction];

  const apis = [PlayApi];
  const timers = [Timer];

  timers.forEach((timer, idx) => oracle.register(0x1000 + idx, timer, () => new timer()));
  apis.forEach((api, idx) => oracle.register(0x2000 + idx, api, () => new api()));
  actions.forEach((action, idx) => oracle.register(0x4000 + idx, action, () => new action()));

  return oracle;
}

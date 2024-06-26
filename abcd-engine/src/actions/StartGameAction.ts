import { Action, ActionConsumerOf, Client } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Abcd, AbcdPlayer } from '../Abcd.js';

export class StartGameAction extends Action<Abcd> {
  players!: AbcdPlayer[];
  userIdx!: number;

  serialize(serializer: Serializer) {
    this.players = serializer.array(this.players, profile => {
      return (profile = serializer.obj(profile, profile => {
        profile.id = serializer.string(profile.id);
        profile.name = serializer.string(profile.name);
        profile.picture = serializer.string(profile.picture);
      }));
    });
    this.userIdx = serializer.int8(this.userIdx);
  }

  forwardTo<R>(consumer: ActionConsumerOf<Abcd, R>): R {
    return consumer.onStartGame(this);
  }

  personalize(client: Client<Abcd>) {
    const instance = StartGameAction.create(this.players);
    instance.userIdx = this.players.findIndex(p => p.id === client.playerId);
    return instance as this;
  }

  static create(players: AbcdPlayer[]) {
    const instance = new StartGameAction();

    instance.players = players;
    instance.userIdx = -1;

    return instance;
  }
}

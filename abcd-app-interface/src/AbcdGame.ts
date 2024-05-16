import { Abcd, AbcdBot, AbcdConfig, AbcdLoop, AbcdPlayer, AbcdState, registerToOracle } from '@bhoos/abcd-engine';
import {
  GameAppInterface,
  Prefs,
  RoomConfig,
  RoomType,
  SuperAppInterfaceVersion,
  UIPlugins,
  UserProfile,
  versionLt,
} from '@bhoos/super-app-interface';
import { CoordinateSystem, ReferenceMultiple } from '@bhoos/game-kit-ui';
import { Match } from '@bhoos/game-kit-engine';
import { HotspotRoomConfig, SinglePlayerRoomConfig } from '@bhoos/super-app-interface';
import { AbcdRoomEditor } from './AbcdRoomEditor';
import { SuperAbcdUI } from './SuperAbcdUI';
import { BOTS } from './bots';
import { AbcdRoomViewer } from './AbcdRoomViewer.js';
import { AbcdAnalytics } from './AbcdAnalytics.js';
import { AbcdHelp } from './AbcdHelp';
import { computeAbcdStats } from './AbcdStats';
import { computeAbcdWinnings } from './AbcdWinnings';

const pkg = require('../package.json');

const DEFAULT_CONFIG: AbcdConfig = {
  playTimer: -1,
};

const SINGLE_PLAYER_DEFAULT_ROOM: SinglePlayerRoomConfig<Abcd> = {
  id: 'abcd-sp-default',
  name: 'Default',
  config: DEFAULT_CONFIG,
  roomType: RoomType.Single,
  minPlayers: 2,
  maxPlayers: 4,
  boot: 10,
  buyIn: 10,
};

const HOTSPOT_DEFAULT_ROOM: HotspotRoomConfig<Abcd> = {
  id: 'abcd-hot-default',
  name: 'Default',
  config: DEFAULT_CONFIG,
  roomType: RoomType.Hotspot,
  minPlayers: 2,
  maxPlayers: 4,
  boot: 10,
  buyIn: 10,
};

export type AbcdPrefs = {
  sound: boolean;
  vibration: boolean;
};

export function initializeAbcdGame(): GameAppInterface<Abcd> {
  return {
    gameId: pkg.bhoos.gameId,
    displayName: 'Abcd',
    name: 'Abcd',
    version: pkg.version,
    interfaceVersion: SuperAppInterfaceVersion,
    developer: 'Bibek Panthi',
    isHostSupported: (version: string) => {
      return !versionLt(version, '1.0.0');
    },
    isClientSupported: (version: string) => {
      return !versionLt(version, '1.0.0');
    },
    reloadStorage: (version: string) => {
      return versionLt(version, '1.0.0');
    },
    description: 'Click as fast as you can',
    supportedBots: Object.keys(BOTS),
    initialSPBots: ['babita', 'pramod'],

    initializeStorage: () => {
      return {
        rooms: [SINGLE_PLAYER_DEFAULT_ROOM, HOTSPOT_DEFAULT_ROOM],
      };
    },

    isValidProfile: (_player: AbcdPlayer, _room: RoomConfig<Abcd>) => true,

    prefs: {
      sound: true,
      vibration: true,
    },

    getPlayer: (profile: UserProfile) => {
      return {
        id: profile.id,
        name: profile.name,
        picture: profile.picture,
      } as AbcdPlayer;
    },

    getBotPlayer: (id: string) => {
      const player = BOTS[id];
      if (player) return player;

      return {
        id: id,
        name: `id`,
        picture: `${id}`,
      };
    },

    defaultRooms: {
      singleplayer: SINGLE_PLAYER_DEFAULT_ROOM,
      hotspot: HOTSPOT_DEFAULT_ROOM,
    },

    RoomEditorComponent: AbcdRoomEditor,
    RoomViewerComponent: AbcdRoomViewer,
    HelpComponent: AbcdHelp,
    analytics: AbcdAnalytics,

    getConfigSummary(room: RoomConfig<Abcd>) {
      const config = room.config;
      if (room.roomType === RoomType.Multi) {
        return {
          short: '',
          details: [
            ['Stakes', `${room.boot}`, 'coins'],
          ],
        };
      }
      return {
        short: `${config.playTimer / 1000} secs`,
        details: [['Time', `${config.playTimer / 1000} secs`, 'time']],
      };
    },

    ui: {
      layoutProps: () => {
        return {
          bgImage: '/backgrounds/table/default',
        };
      },

      createUI: (
        layout: CoordinateSystem,
        roomConfig: RoomConfig<Abcd>,
        _prefs: ReferenceMultiple<Prefs>,
        plugins: UIPlugins<Abcd>,
      ) => {
        return new SuperAbcdUI(layout, roomConfig, plugins);
      },

      orientation: 'landscape',
      testEquality: (_u, _v) => true,
      startGameMethod: 'onStartGame',
      finishGameMethod: 'onFinishGame',
    },

    engine: {
      gameConfig: (room: RoomConfig<Abcd>, players: AbcdPlayer[], _prev?: { match: Match<Abcd>; config: AbcdConfig }) => {
        return {
          config: room.config,
          players: players,
        };
      },

      State: AbcdState,
      gameLoop: AbcdLoop,

      registerToOracle: registerToOracle,

      createBot: (match: Match<Abcd>, player: AbcdPlayer) => {
        return new AbcdBot(player.id, match)
      },
    },

    stats: {
      matchWinnings: computeAbcdWinnings,

      matchStats: computeAbcdStats,

      engineModeId: (_room: RoomConfig<Abcd>) => {
        return 1;
      },

      timezone: 'UTC',

      statFullId: [],
      descriptions: new Map(),

      formatters: new Map(),
    },

    achievements: [],

    assets: {
      pathTranslations: [],
      assets: require('./assetsManifest.json')
    }
  }
}

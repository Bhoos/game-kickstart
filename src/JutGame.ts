import { Jut, JutBot, JutConfig, JutLoop, JutPlayer, JutState, registerToOracle } from '@bhoos/jut-engine';
import {
  GameAppInterface,
  Prefs,
  RoomConfig,
  RoomType,
  SuperAppInterfaceVersion,
  UserProfile,
  versionLt,
} from '@bhoos/super-app-interface';
import { CoordinateSystem, ReferenceMultiple } from '@bhoos/game-kit-ui';
import { Match, StateOf } from '@bhoos/game-kit-engine';
import { HotspotRoomConfig, SinglePlayerRoomConfig } from '@bhoos/super-app-interface';
import { JutRoomEditor } from './JutRoomEditor';
import { SuperJutUI } from './SuperJutUI';
import { BOTS } from './bots';
import { JutRoomViewer } from './JutRoomViewer.js';
import { equalArray } from './utils';
import { JutAnalytics } from './JutAnalytics.js';
import { JutHelp } from './JutHelp';
import { JutStats, computeJutStats } from './JutStats';
import { computeJutWinnings } from './JutWinnings';
import { version } from '../package.json';

const DEFAULT_CONFIG: JutConfig = {
  playTimer: -1,
  pickTimer: -1,
  submitTimer: -1,
  cardsPerPlayer: 7,
  books: 1,
};

const SINGLE_PLAYER_DEFAULT_ROOM: SinglePlayerRoomConfig<Jut> = {
  id: 'jut-sp-default',
  name: 'Default',
  config: DEFAULT_CONFIG,
  roomType: RoomType.Single,
  minPlayers: 2,
  maxPlayers: 5,
  boot: 10,
  buyIn: 10,
};

const HOTSPOT_DEFAULT_ROOM: HotspotRoomConfig<Jut> = {
  id: 'jut-hot-default',
  name: 'Default',
  config: DEFAULT_CONFIG,
  roomType: RoomType.Hotspot,
  minPlayers: 2,
  maxPlayers: 5,
  boot: 10,
  buyIn: 10,
};

export type JutPrefs = {
  sound: boolean;
  vibration: boolean;
  cardsLayout: 'fan' | 'hidden';
};

export function initializeJutGame(): GameAppInterface<Jut> {
  return {
    gameId: 1,
    displayName: 'Jut Patti',
    name: 'jutpatti',
    version,
    interfaceVersion: SuperAppInterfaceVersion,
    developer: 'Bibek Panthi',
    isHostSupported: (version: string) => {
      return !versionLt(version, '2.4.0');
    },
    isClientSupported: (version: string) => {
      return !versionLt(version, '2.3.0');
    },
    reloadStorage: (version: string) => {
      return versionLt(version, '2.4.0');
    },
    description: 'A popular card game where you have to make pairs',
    supportedBots: Object.keys(BOTS),
    initialSPBots: ['babita', 'pramod'],

    initializeStorage: () => {
      return {
        rooms: [SINGLE_PLAYER_DEFAULT_ROOM, HOTSPOT_DEFAULT_ROOM],
      };
    },

    isValidProfile: (player: JutPlayer, room: RoomConfig<Jut>) => true,

    prefs: {
      sound: true,
      vibration: true,
      cardsLayout: 'hidden',
    },

    getPlayer: (profile: UserProfile) => {
      return {
        id: profile.id,
        name: profile.name,
        picture: profile.picture,
      } as JutPlayer;
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

    RoomEditorComponent: JutRoomEditor,
    RoomViewerComponent: JutRoomViewer,
    HelpComponent: JutHelp,
    analytics: JutAnalytics,

    getConfigSummary(room: RoomConfig<Jut>) {
      const config = room.config;
      if (room.roomType === RoomType.Multi) {
        return {
          short: '',
          details: [
            ['Stakes', `${room.boot}`, 'coins'],
            ['Cards', `${room.config.cardsPerPlayer}`, 'cards'],
          ],
        };
      }
      return {
        short: `${config.cardsPerPlayer} cards`,
        details: [['Cards', `${config.cardsPerPlayer}`, 'cards']],
      };
    },

    ui: {
      layoutProps: () => {
        return {
          bgImage: '/backgrounds/table/default',
        };
      },

      createUI: (layout: CoordinateSystem, roomConfig: RoomConfig<Jut>, prefs: ReferenceMultiple<Prefs>) => {
        return new SuperJutUI(layout, roomConfig, prefs);
      },

      orientation: 'landscape',
      testEquality: (u, v) => true,
    },

    engine: {
      gameConfig: (room: RoomConfig<Jut>, players: JutPlayer[], prev?: { match: Match<Jut>; config: JutConfig }) => {
        if (prev && equalArray(prev.match.getPlayers(), players, (a, b) => a.id === b.id)) {
          const winnerIdx = prev.match.getState().winnerIdx;
          if (winnerIdx != -1) {
            return {
              config: {
                ...room.config,
                dealerIdx: winnerIdx,
              },
              players: players,
            };
          }
        }

        return {
          config: room.config,
          players: players,
        };
      },

      State: JutState,
      gameLoop: JutLoop,

      registerToOracle: registerToOracle,

      createBot: (match: Match<Jut>, player: JutPlayer) => {
        return new JutBot(player.id, match);
      },
    },

    stats: {
      matchWinnings: computeJutWinnings,

      matchStats: computeJutStats,

      engineModeId: (room: RoomConfig<Jut>) => {
        return 1;
      },

      timezone: 'UTC',

      statFullId: [
        [1, 1, 1, 2, 1],
        [2, 1, 1, 1, 1],
        [11, 2, 1, 2, 1],
        [12, 2, 1, 1, 1],
        [21, 3, 1, 2, 1],
        [22, 3, 1, 1, 1],
        [31, 1, 1, 3, 1],
        [32, 2, 1, 3, 1],
        [33, 3, 1, 3, 1],
        [47, 1, 1, 1, 6],
        [49, 2, 1, 1, 6],
        [51, 3, 1, 1, 6],
        [76, 1, 1, 2, 5],
        [77, 1, 1, 2, 6],
        [78, 2, 1, 2, 5],
        [79, 2, 1, 2, 6],
        [80, 3, 1, 2, 5],
        [81, 3, 1, 2, 6],
        [106, 1, 1, 4, 1],
        [107, 2, 1, 4, 1],
        [108, 3, 1, 4, 1],
        [109, 1, 1, 5, 1],
        [110, 2, 1, 5, 1],
        [111, 3, 1, 5, 1],
        [112, 1, 1, 6, 1],
        [113, 2, 1, 6, 1],
        [114, 3, 1, 6, 1],
        [115, 1, 1, 7, 1],
        [116, 2, 1, 7, 1],
        [117, 3, 1, 7, 1],
        [118, 1, 1, 8, 1],
        [119, 2, 1, 8, 1],
        [120, 3, 1, 8, 1],
        [121, 1, 1, 9, 1],
        [122, 2, 1, 9, 1],
        [123, 3, 1, 9, 1],
      ],
      descriptions: new Map([
        [JutStats.FirstRoundWin, 'Win game on first round'],
        [JutStats.Jut_GotFourPair, 'Get four pair of cards'],
        [JutStats.Jut_FourJokerWin, 'Win with a combination of four Joker cards'],
        [JutStats.Jut_NoJokerWin, 'Win without using any Joker cards'],
        [JutStats.Jut_GotFourOfAKind, 'Form a set of four cards of the same rank'],
        [JutStats.Jut_Pellan, 'Throw card thrown by next player in last round'],
      ]),

      formatters: new Map(),
    },

    achievements: [
      {
        id: 1,
        statFullId: 1,
        threshold: 1,
        inverted: false,

        name: 'Win Count',
        description: 'Win First Game',
        baseline: 0,
        rewardType: 'silverCoin',
        amount: 25,
      },

      {
        id: 2,
        statFullId: 11,
        threshold: 1,
        inverted: false,

        name: 'Win Count',
        description: 'Win First Multiplayer Game',
        baseline: 0,
        rewardType: 'goldCoin',
        amount: 50,
      },

      {
        id: 3,
        statFullId: 1,
        threshold: 10,
        inverted: false,

        name: 'Win Count',
        description: 'Win 10 Games',
        baseline: 0,
        rewardType: 'silverCoin',
        amount: 250,
      },

      {
        id: 4,
        statFullId: 11,
        threshold: 10,
        inverted: false,

        name: 'Win Count',
        description: 'Win 10 Multiplayer Game',
        baseline: 0,
        rewardType: 'goldCoin',
        amount: 500,
      },

      {
        id: 5,
        statFullId: 109,
        threshold: 1,
        inverted: false,

        name: 'Four Pairs',
        description: 'Get 4 Pairs',
        baseline: 0,
        rewardType: 'silverCoin',
        amount: 200,
      },

      {
        id: 6,
        statFullId: 115,
        threshold: 1,
        inverted: false,

        name: 'No Joker Win',
        description: 'Win without Jokers',
        baseline: 0,
        rewardType: 'silverCoin',
        amount: 100,
      },
      {
        id: 7,
        statFullId: 115,
        threshold: 10,
        inverted: false,

        name: 'No Joker Win',
        description: 'Win 10 games without jokers',
        baseline: 0,
        rewardType: 'silverCoin',
        amount: 1000,
      },
    ],

    assets: {
      pathTranslations: [],
      assets: require('./assetsManifest.json')
    }
  };
}

// Guest Avatars
const king = require('./king.png');
const queen = require('./queen.png');
const joker = require('./joker.png');
const neytri = require('./neytri.png');
const holmes = require('./holmes.png');
const monalisa = require('./monalisa.png');
const tyrion = require('./tyrion.png');
const hermoini = require('./hermoini.png');

const avatars: { [id: string]: any } = {
  // Guest avatars
  '1': king,
  '2': queen,
  '3': joker,
  '4': neytri,
  '5': holmes,
  '6': monalisa,
  '7': tyrion,
  '8': hermoini,

  // Bots
  '1b': require('./bots/bustin_jieber.png'),
  '2b': require('./bots/belly_dancer.png'),
  '3b': require('./bots/aqwomen.png'),
  '4b': require('./bots/ullu.png'),
  '5b': require('./bots/paakhe.png'),
  '6b': require('./bots/laati.png'),
  '7b': require('./bots/speed_racer.png'),
  '8b': require('./bots/blue_omen.png'),
  '9b': require('./bots/tedd.png'),
  '10b': require('./bots/sudan.png'),
  '11b': require('./bots/runche.png'),
  '12b': require('./bots/dariwal.png'),
  '13b': require('./bots/star_lady.png'),
  '14b': require('./bots/dejavu.png'),
  '15b': require('./bots/professor_virus.png'),
  '16b': require('./bots/mr_mean.png'),
  '17b': require('./bots/bokso.png'),
  '18b': require('./bots/yoga.png'),
  '19b': require('./bots/pk.png'),
  '20b': require('./bots/moto_moto.png'),
  '21b': require('./bots/gabbar.png'),
  '22b': require('./bots/senor_cruz.png'),
  '23b': require('./bots/jaggu.png'),
  '24b': require('./bots/guruji.png'),
  '25b': require('./bots/eku.png'),
  '26b': require('./bots/vasuli.png'),
  '27b': require('./bots/red_star.png'),
  '28b': require('./bots/g1.png'),
  '29b': require('./bots/mr_india.png'),
  '30b': require('./bots/gogo.png'),
  '31b': require('./bots/hounddog.png'),
  '32b': require('./bots/dollarwise.png'),
  '33b': require('./bots/mogambo.png'),
  '34b': require('./bots/sailor_man.png'),
  '35b': require('./bots/pataka.png'),
  '36b': require('./bots/circuit.png'),

  // "37b": require('./bots/q_pid.png'),
  // "38b": require('./bots/mumble_jumble.png'),
  // "39b": require('./bots/lovely_knight.png'),
};

const getAvatarIds = (): Array<string> => ['1', '2', '3', '4', '5', '6', '7', '8'];
const getAvatarById = (id: string) => avatars[id];

export { getAvatarIds, getAvatarById };

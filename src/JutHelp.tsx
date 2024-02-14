import { GameHelp, HowToPlayProps } from '@bhoos/super-components';

export function JutHelp() {
  return <GameHelp data={data} />;
}

const data: HowToPlayProps = [
  {
    title: 'objective',
    component: [
      {
        hero: null,
        content: 'Create *pairs* meaning two cards of the same rank.',
      },
    ],
  },
  {
    title: 'joker',
    component: [
      {
        hero: null,
        content:
          '*Joker card* are one rank higher than the flipped card that can be matched with any card to form pairs.',
      },
    ],
  },
  {
    title: 'gameplay',
    component: [
      {
        hero: null,
        content:
          "\u2022 On each turn, pick a *choice card (previous player's discard)* or a card from the deck to form a pair and throw a card from your hand.\n\u2022 The game continues until a player pairs all their cards before others.",
      },
    ],
  },
  {
    title: 'winning',
    component: [
      {
        hero: null,
        content: 'Victory is achieved by pairing all yours cards before anyone else.',
      },
    ],
  },
];

import { Card, Rank } from '@bhoos/cards';
import { AbcdState } from '@bhoos/abcd-engine';
import { MoveType } from '@bhoos/abcd-engine/src/AbcdState';

export function arrangeCardsAbcd(cards: Card[], joker: Rank) {
  const counts = Array(13).fill(0);
  for (var i = 0; i < cards.length; i++) {
    counts[cards[i].rank.id]++;
  }

  let nonJokerSingles = 0;
  for (var i = 0; i < 13; i++) {
    if (i != joker.id && counts[i] % 2 == 1) nonJokerSingles++;
  }

  let unusedJokers = counts[joker.id] - nonJokerSingles;
  let doubles: Card[] = [];
  let singles: Card[] = [];
  let jokers: Card[] = [];
  for (var i = 0; i < cards.length; i++) {
    const c = cards[i];

    if (c.rank == joker) {
      if (unusedJokers == 0) {
        jokers.push(c);
      } else {
        unusedJokers--;
        doubles.push(c);
      }
    } else {
      const count = counts[c.rank.id];
      if (count % 2 === 0) {
        doubles.push(c);
      } else {
        singles.push(c);
        counts[c.rank.id]--;
      }
    }
  }

  doubles.sort((a, b) => {
    if (a.rank.isEqual(b.rank)) return 0;
    return a.isHigh(b) ? 1 : -1;
  });

  singles.sort((a, b) => {
    if (a.rank.isEqual(b.rank)) return 0;
    return a.isHigh(b) ? 1 : -1;
  });

  let results: Card[] = [];
  doubles.forEach(c => results.push(c));
  for (var i = 0; i < singles.length; i++) {
    results.push(singles[i]);
    results.push(jokers[i]);
  }
  return results;
}

export function computePileCards(state: AbcdState): Card[] {
  let cards: Array<Card> = [];
  for (const move of state.moves) {
    if (move.type === MoveType.play) {
      cards.push(move.card as Card);
    } else {
      // move is pick move
      if (move.card && cards.length != 0 && move.card.is(cards[cards.length - 1])) {
        cards.pop();
      }
    }
  }
  return cards;
}

export function playerOffset(state: AbcdState, playerIdx: number) {
  return (4 - state.userIdx + playerIdx) % 4;
}

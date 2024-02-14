import { DealAction, Jut, JutConfig, JutState } from '@bhoos/jut-engine';
import { StatId } from '@bhoos/super-app-interface';
import { Card } from '@bhoos/cards';
import { assort, countIf, reduce } from './utils';
import { Action } from '@bhoos/game-kit-engine';
import { MoveType } from '@bhoos/jut-engine';

export enum JutStats {
  FirstRoundWin = 4,
  Jut_GotFourPair = 5,
  Jut_FourJokerWin = 6,
  Jut_NoJokerWin = 7,
  Jut_GotFourOfAKind = 8,
  Jut_Pellan = 9,
}

export function computeJutStats(state: JutState, config: JutConfig, playerIdx: number, actions: Action<Jut>[]) {
  const stats = new Map<StatId | number, number>();
  stats.set(StatId.GamesPlayed, 1);
  // Deal related stats
  const dealAction = actions.find(a => a instanceof DealAction) as DealAction | undefined;
  if (dealAction) {
    const dealtCards = dealAction.cards[playerIdx];
    const ranks = assort(dealtCards, c => c.rank.code);

    // 1. Got 4 Pairs in the beginning
    const pairsCount = reduce(
      ranks.values(),
      (acc, cards) => {
        return acc + Math.floor(cards.length / 2);
      },
      0,
    );
    if (pairsCount >= 4) {
      stats.set(JutStats.Jut_GotFourPair, 1);
    }

    // 2. Got 4 cards of same rank e.g. 2 2 2 2
    const fourOfAKind = countIf(ranks.values(), cards => cards.length === 4);
    if (fourOfAKind >= 1) {
      stats.set(JutStats.Jut_GotFourOfAKind, fourOfAKind);
    }
  }

  // Winning Related stats
  // 3. Won the game
  const playerWon = state.winnerIdx != -1 && playerIdx === state.winnerIdx;
  stats.set(StatId.Rank1, playerWon ? 1 : 0);
  if (playerWon) {
    const player = state.players[playerIdx];
    const jokerCount = countIf(player.cards, (card: Card) => card.rank.isEqual(state.joker.rank.next));
    if (jokerCount === 4) {
      // 4. Won with 4 Jokers
      stats.set(JutStats.Jut_FourJokerWin, 1);
    } else if (jokerCount === 0) {
      // 5. Won without Jokers
      stats.set(JutStats.Jut_NoJokerWin, 1);
    }

    // 6. Won on the first round (i.e. the player picked a card only once)
    const myPickCount = countIf(state.moves, m => m.playerIdx === playerIdx && m.type === MoveType.pick);
    if (myPickCount === 1) {
      stats.set(JutStats.FirstRoundWin, 1);
    }
  }

  // Gameplay related
  // 7. Pellan: Throwing cards that the next player had thrown in last round
  const pellan = pellanCount(state, playerIdx);
  if (pellan > 0) {
    stats.set(JutStats.Jut_Pellan, pellan);
  }
  return stats;
}

function pellanCount(state: JutState, playerIdx: number) {
  let pellanCount = 0;
  const nextPlayer = (playerIdx + 1) % state.players.length;
  let nextPlayerPlayed: Card | null = null;
  for (const move of state.moves) {
    if (move.playerIdx === nextPlayer && move.type === MoveType.play) {
      nextPlayerPlayed = move.card;
    }

    if (move.playerIdx === playerIdx && move.type === MoveType.play) {
      if (nextPlayerPlayed) {
        if (move.card && nextPlayerPlayed.rank.isEqual(move.card.rank)) {
          pellanCount++;
        }
      }
      nextPlayerPlayed = null;
    }
  }
  return pellanCount;
}

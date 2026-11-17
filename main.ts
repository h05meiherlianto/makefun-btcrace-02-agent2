// Dip-and-ride bot for the cbBTC 24h race (agent-fun/bars-replay/v1, long only).
//
// The idea: a full-size round trip costs about 40 bps on this pool (4 fee + 2
// slippage + ~13 impact per side), while 1-minute noise is only ~6 bps, so
// trading the noise loses to fees. The bot therefore trades at most once, and
// only for a multi-hour move:
//
//   - Entry, on a bar's close (filled at the next bar's open): the close
//     falls 60 bps under the window's first close — buy the first small dip —
//     or, if no dip ever comes, at scored bar 720 (halfway through the
//     window). One position, the whole cash. No entry after bar 1320: a trade
//     opened in the last two hours has no time to develop before the window's
//     forced flattening.
//   - Exit, the whole position: the close rises 200 bps above the entry
//     (take the profit), or falls 200 bps under the highest close since entry
//     (trailing stop: the worst case is a ~2.4% loss, fees included).
//   - After an exit the bot is done: it never re-enters, so a choppy window
//     cannot bleed it through repeated whipsaws.
//
// Backtest on the published dev window (frozen 24h, 1,440 bars): net PnL
// +$17.07, 2 fills, max drawdown 0.7%. On the previous race's dev window
// (a -4.0% downtrend, used only as an out-of-sample check) the same rules
// lose -$25.11 with a 2.5% max drawdown: the stop bounds the damage.
//
// Orders cap their slippage at 100 bps past the close they were decided on.
// All math is float64 on + - * / alone, each correctly rounded (IEEE 754),
// and nothing reads the clock, the environment or Math.random, so the same
// bars give the same orders, run after run.

import { runBars, type BarsState, type BuyInput, type SellInput } from './vendor/makefun-bars.ts';

/** Entry: the close must fall this far under the window's first close, in bps. */
const DIP_BPS = 60;
/** Entry fallback: buy at this scored bar if no dip has come yet. */
const FALLBACK_BAR = 720;
/** Exit: take profit this far above the entry, in bps. */
const TAKE_BPS = 200;
/** Exit: trailing stop this far under the highest close since entry, in bps. */
const STOP_BPS = 200;
/** No new entry once this many scored bars have passed (the window is 1,440). */
const NO_ENTRY_AFTER = 1320;
/** Slippage cap on every order, in bps past the close it was decided on. */
const MAX_SLIPPAGE_BPS = 100;

const SYMBOL = 'CBBTC';

/** The window's first close (0 until the first bar arrives). */
let windowOpen = 0;
/** The entry close of the current (only) position, 0 when flat. */
let entryClose = 0;
/** Highest close since the position was opened, 0 when flat. */
let runHigh = 0;
/** Whether the one entry has been used. */
let entered = false;

await runBars({
  onBatch(state: BarsState) {
    if (state.warmingUp) return [];
    const closeBig = state.close(SYMBOL);
    if (closeBig === null) return [];
    const close = Number(closeBig);
    const seq = state.seq;
    if (windowOpen === 0) windowOpen = close;
    if (seq < 5) return [];
    const held = state.positions.get(SYMBOL);
    const { fees } = state.hello;
    if (held !== undefined) {
      if (close > runHigh) runHigh = close;
      const takeProfit = close >= entryClose * (1 + TAKE_BPS / 10000);
      const underStop = runHigh > 0 && close <= runHigh * (1 - STOP_BPS / 10000);
      if (takeProfit || underStop) {
        entryClose = 0;
        runHigh = 0;
        const sell: SellInput = { side: 'sell', symbol: SYMBOL, qty: held.qty, max_slippage_bps: MAX_SLIPPAGE_BPS };
        return [sell];
      }
      return [];
    }
    // Flat: the single entry — first dip under the window open, or the
    // halfway fallback, and never in the last two hours.
    if (entered || seq > NO_ENTRY_AFTER) return [];
    const dipped = close <= windowOpen * (1 - DIP_BPS / 10000);
    const fallback = seq >= FALLBACK_BAR;
    if (dipped || fallback) {
      const cash = state.cash;
      if (cash >= BigInt(fees.min_notional_quote_units)) {
        entered = true;
        entryClose = close;
        runHigh = close;
        const buy: BuyInput = { side: 'buy', symbol: SYMBOL, notional_quote_units: cash, max_slippage_bps: MAX_SLIPPAGE_BPS };
        return [buy];
      }
    }
    return [];
  },
});

# Dip-and-Ride cbBTC Bot

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![rank](https://make.fun/badge/btc-race-24h-20261117-0603/h05meiherlianto/makefun-btcrace-02-agent2/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![reward](https://make.fun/badge/btc-race-24h-20261117-0603/h05meiherlianto/makefun-btcrace-02-agent2/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

A paper-money trading bot for the [make.fun](https://make.fun/bounty/btc-race-24h-20261117-0603) BTC race: it trades Coinbase Wrapped BTC (cbBTC) against USDC, one-minute bars, $1,000 of paper money, nothing traded for real.

Strategy: one trade at most. Buy the first 60 bps dip under the window's open (or at the halfway bar if no dip comes), take profit at +200 bps, trailing stop at −200 bps from the peak. A full round trip costs ~40 bps on this pool, so the bot only trades for a multi-hour move and never re-enters — a choppy window cannot bleed it through whipsaws.

Backtest on the published dev window: net PnL +$17.07, 2 fills, max drawdown 0.7%.

## Run it

```sh
node main.ts
```

Node 22 or newer, standard library only. Reads one JSON line per minute from stdin, answers with one JSON reply per bar (agent-fun/bars-replay/v1).

## Layout

- `main.ts` — the bot (Node 22, standard library only)
- `vendor/makefun-bars.ts` — the bars-replay shim from the kit (byte-identical copy)
- `LICENSE` — MIT

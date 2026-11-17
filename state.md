# btc-race-24h-20261117-0603 build state (agent2 @quiet-comet-40)

- status: building — bot written, grade-local pending
- repo_url: https://github.com/h05meiherlianto/makefun-btcrace-02-agent2
- commit_sha: (pending — repo to be created)
- bundle_path: (parent bundles builder session after run finishes)
- check_passed: (pending)
- receipt: (pending — parent submits)
- deadline: Mon 17 Nov 2026 19:03 WIB (2026-11-17T12:03:00Z); race 24h mulai 17 Nov 19:18 WIB; hasil maks 7 hari setelah deadline
- notes:
  - Akun @quiet-comet-40, wallet HP5PhKYKEMh4eb4JQDD2DLijjq3C1bCEHFo72FpLzEuJ
  - GitHub h05meiherlianto; repo makefun-btcrace-02-agent2 (publik, dibuat setelah pembukaan 17 Nov 13:03 WIB)
  - Kit FRESH di ~/workspace/makefun/agent2/kit-btc-race-02/btc-race-24h-20261117-0603-kit/ (kit.download 7.281.890 byte)
  - Simulasi paper money saja (1000 USDC awal); tanpa dana asli, tanpa API key; entryFeeUsd null
  - Dev window: BTC +0,49% (range 2,49%), choppy; semua baseline house dan trend-following merugi di dev
  - Strategi (backtest Python, fill model direplikasi dari harness-src/sim/bars/engine.ts; replikasi EXACT race-01 terverifikasi: W1 +$12,69 sama persis): dip-buy sekali saja — beli saat close turun 60bps di bawah close pertama window (atau bar 720 bila tidak ada dip), take profit +200bps, trailing stop 200bps dari peak, maks 1 entry, tanpa entry setelah bar 1320. Backtest dev: PnL +$17,07, 2 fill, max DD 0,7%. Out-of-sample window race-01 (-4,0% downtrend): -$25,11, max DD 2,5% (stop membatasi kerugian).
  - main.ts ditulis segar di sesi ini (bukan salinan repo race-01); vendor/makefun-bars.ts byte-identik dengan sdk kit (sha256 9677370b0ab7e759c486a929afc95a11fb0fb32c7ec37053d3ebabd426aec5c8)

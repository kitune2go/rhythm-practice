# Web App Architecture

## 目的

リズムの発音時刻を変えずに機能を追加できるよう、DOM描画・音声・時計・状態遷移を分離する。
`app.mjs` は各モジュールを接続するが、個別の音声生成・時刻補正・図形描画は持たない。

## Module map

| Module | 責務 |
| --- | --- |
| `index.html` | DOM skeletonとES Module entry |
| `styles.css` | Grid / Orbit / controlsを含む全スタイル |
| `app.mjs` | DOM event、アプリ状態、各モジュールの接続 |
| `pattern-model.mjs` | Pattern schema、event正規化、拍子・step計算 |
| `core/audio-engine.mjs` | AudioContext、part gain bus、click生成 |
| `core/visual-clock.mjs` | output latency推定、平滑化、Visual Offset |
| `core/scheduler.mjs` | AudioContext時刻基準の20ms先読みscheduler |
| `modes/ghost-mode.mjs` | 4小節単位の消音状態と表示queue |
| `views/grid-view.mjs` | 複数小節Gridの構築・step highlight |
| `views/orbit-view.mjs` | 1周1小節Orbitの構築・playhead |

## Dependency rules

- `core/` と `modes/` はDOMを参照しない。
- `views/` はWeb Audio、scheduler、練習モードを参照しない。
- `pattern-model.mjs` は他のアプリモジュールへ依存しない。
- 音声と表示は同じscheduled event timeを受け取り、表示側だけがoutput latencyとVisual Offsetを適用する。
- Ghostの発音状態はscheduler時刻で更新し、表示状態は同じevent timeをvisual clockが通過した時点で更新する。

## Preserved timing contract

- scheduler interval: 20ms
- schedule-ahead horizon: 0.20s
- start delay: 0.08s
- `getOutputTimestamp()` を優先し、取得できない場合だけ `baseLatency + outputLatency` を使う
- Visual Offset: −150ms〜+150ms
- Orbit: 1周 = 1小節
- Rhythm eventの `velocity` / `accent` / `ghostNote` はstep時刻を変更しない

## Validation

```bash
node --test
```

schema・旧Pattern timing・event expressionに加え、scheduler、visual clock、audio engine、Ghost状態機械、module境界を単体検証する。

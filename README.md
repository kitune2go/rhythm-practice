# rhythm-practice

口・手・足で別々のリズムを維持するための独立性トレーニング用リポジトリ。

## 目的

- 拍子ごとの基礎パルスを身体に固定する
- 口・右手・左手・足で異なる分割を同時に維持する
- 「考えて合わせる」から「各パートを独立して走らせる」へ移行する
- テンポを上げるより、崩れずに反復できることを優先する

## 構成

- `exercises/` : MuseScore等で開ける MusicXML 譜面
- `logs/` : 練習記録
- `docs/` : 練習ルール・追加課題

## Exercise 001

`exercises/001_basic_independence.musicxml`

4小節の基礎課題。

- Voice: 4分音符
- Right hand: 8分音符
- Left hand: 2拍3連
- Foot: 2分音符

最初は BPM 50〜60 程度から。4小節を8周、崩れなければ +5 BPM。

## ルール

1. まず各パートを単独で叩く。
2. 次に2パートずつ組み合わせる。
3. 最後に4パート同時。
4. 崩れたテンポでは続けず、直前の安定テンポへ戻す。
5. 成功基準は「1回通る」ではなく「8周連続で崩れない」。

## 次に追加する候補

- 3:2 ポリリズム
- 4:3 ポリリズム
- 16分音符 + 3連符
- アクセント位置の循環
- 片手だけ休符を入れる独立課題
- 足だけ裏拍にする課題


## Web App

`index.html` にスマホ向けリズム練習アプリがあります。

### 機能

- BPM 40〜200
- Start / Stop
- Voice / Right Hand / Left Hand / Foot の4パート
- 12種類のPatternプリセット（4/4・12/8を含む）
- Patternごとの meter / BPM基準pulse / subdivisions / bars から内部step数を導出
- Rhythm eventは `step` と独立した `velocity` / `accent` expressionを持てる（発音時刻は変更しない）
- Grid表示（複数小節は小節ごとに分離） / Orbit表示（1周 = 1小節、現在小節を表示）。velocityは濃淡/markerサイズ、accentは強調枠で識別
- Ghost Mode（実際の小節境界を基準に4小節ごとに変化）
- Visual Offset（−150〜+150ms）と出力latency補正
- Web Audio APIによるクリック音
- 外部ライブラリ不要

### GitHub Pages

GitHubのリポジトリ画面で:

1. Settings
2. Pages
3. Build and deployment
4. Source を **Deploy from a branch**
5. Branch を **main / root**
6. Save

設定後は GitHub Pages のURLからスマホで直接使えます。

# AI会話保存アプリ

## プロジェクト概要
iPhone向けのAI会話保存アプリ。ユーザーがAIへの質問と回答をローカルに保存・管理できる。

## 技術スタック
- Expo (React Native)
- TypeScript
- expo-router（ナビゲーション）
- AsyncStorage（ローカルデータ保存）
- react-native-markdown-display（Markdown表示）

## 現在の状態
**基本実装完了** - 2026/02/10

### 実装済み機能
- [x] フォルダによる会話の整理（作成/編集/削除）
- [x] 会話の保存・編集・削除
- [x] Markdown表示対応（コードブロック、リスト、見出し等）
- [x] 全文検索機能
- [x] ダーク/ライトモード（システム連動）
- [x] AsyncStorageによるデータ永続化

### 画面構成
1. ホーム（`app/index.tsx`）- フォルダのリスト、検索への入口
2. フォルダ内（`app/folder/[id].tsx`）- 題と日付の一覧。`all` は全回答
3. 会話詳細（`app/conversation/[id].tsx`）- 題や本文をタップすると編集、右上のチェックで読む表示に戻る、自動保存（基本はiPhoneのメモと同じ使用感。スクロールではキーボードを下げない。本文はMarkdownのまま編集）
4. 新規作成（`app/conversation/[id].tsx` を `id=new` で開く。専用の画面は持たない）- 題と本文を1枚で入力（題はユーザーが書く）。チェックを押すと画面を切り替えずにそのまま読む表示になる。戻るだけでも保存し、空なら作らない
一覧のフォルダと回答は左スワイプで削除する（長押しの操作は置かない。フォルダ名の変更はフォルダ内の右上「…」から）。「…」はボタンのすぐ下に小さなメニュー（`components/PopoverMenu.tsx`）を開く。iPhoneのメモと同じ型で、画面中央の確認ダイアログ（Alert）をメニュー代わりに使わない。名前の変更は文字を全選択した状態で始める。
動きの方針: すぐ切り替えるより、少しゆとりを持たせる。行の増減は `utils/motion.ts` の `easeListChange` でゆっくり詰め、詳細から削除するときは一覧に戻りきってから消す。行を押した感じは半透明ではなく背景色で出す（半透明だと裏の削除ボタンが透ける）。
5. 検索（`app/search.tsx`）- 全文検索

## ファイル構造
```
app/                    # 画面（expo-router）
components/             # 再利用可能なコンポーネント
contexts/DataContext.tsx # データ管理（CRUD操作）
hooks/useTheme.ts       # テーマ管理
types/index.ts          # 型定義（Folder, Conversation）
utils/storage.ts        # AsyncStorage操作
```

## 画面確認用の一時パッケージ
画面確認（スクショ）のために、Web版用の `react-native-web` `@expo/metro-runtime` `react-dom` を `npm install --no-save` で入れている。
- 作業のたびに `npm ci` で消さない。入れたままでよい
- `npm install` や `expo install` で消えることがあるので、消えていたら入れ直す
- **リリース（EASビルド）の前に `npm ci` を実行して消す**

## 起動方法
```bash
npx expo start
```
Expo GoアプリでQRコードをスキャンして実機確認

## 今後の改善案（未実装）
- 会話のエクスポート機能（JSON/テキスト）
- 会話のコピー機能（ワンタップでクリップボードへ）
- フォルダの並び替え
- 会話の移動（別フォルダへ）
- アプリアイコンとスプラッシュ画面のカスタマイズ
- iCloud同期（オプション）

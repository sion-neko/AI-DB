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
1. ホーム（`app/index.tsx`）- フォルダ一覧、検索バー
2. フォルダ内（`app/folder/[id].tsx`）- 会話一覧
3. 会話詳細（`app/conversation/[id].tsx`）- Markdown表示、編集/削除
4. 新規作成（`app/conversation/new.tsx`）- 質問入力、回答ペースト
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

## 起動方法
```bash
cd ai-conversation-saver
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

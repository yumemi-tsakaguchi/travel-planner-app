```markdown
### 1. プロジェクトの概要と目的

- **プロジェクト名**: (当日決定)
- **目的**: 30分の制限時間内に、当日発表されるテーマに基づいたアプリのプロトタイプを作成し、デモを行うこと。
- **コア機能**: ユーザーの課題を解決する、最も重要な1つの機能に絞る。

### 2. 技術スタック

- **フレームワーク**: React (Viteでセットアップ)
- **言語**: JavaScript (JSX)
- **スタイリング**: CSS Modules
- **ルーティング**: react-router-dom (必要に応じて)

### 3. 画面とコンポーネント構成

デモで必須となる主要な画面と、それに必要なコンポーネントを定義します。これにより、Claude Codeは一貫したコンポーネント設計を最初から行うことができます。

- **App.jsx**: メインコンポーネント。ルーティングを管理し、主要なレイアウトを定義します。
- **Headerコンポーネント**: アプリのヘッダー。
- **Footerコンポーネント**: アプリのフッター（任意）。
- **ページコンポーネント**:
    - **HomePage.jsx**: アプリのトップページ。
    - **DetailPage.jsx**: 特定の項目や商品の詳細ページ。

### 4. 実装のステップ（優先順位順）

Claude Codeに、何をどの順番で実装してほしいかを明確に伝えます。これにより、時間内にデモに必要な最低限の機能が確実に完成します。

1. **環境構築**: `npm create vite@latest`を使ってReactプロジェクトをセットアップし、必要な依存関係をインストールする。
   - **Vite設定**: `vite.config.js`に以下の設定を追加すること：
     ```javascript
     export default defineConfig({
       plugins: [react()],
       server: {
         port: 5173,
         host: 'localhost',
         open: true
       },
       resolve: {
         alias: {
           '@': '/src',
         },
       },
     })
     ```
2. **基本コンポーネントの実装**: `App.jsx`, `Header.jsx`, `HomePage.jsx`などの空のコンポーネントファイルを作成し、それぞれのコンポーネントを簡単なJSXで記述する。
3. **ルーティングの設定**: `react-router-dom`を使って、トップページ (`/`) と詳細ページ (`/details/:id`) のルーティングを設定する。
4. **UIの実装**: Figmaのスクリーンショットを基に、`HomePage.jsx`と`DetailPage.jsx`のUIを実装する。スタイリングにはCSS Modulesを使用する。
5. **データ表示**: 必要に応じて、ダミーデータ（例: 商品リストの配列）を作成し、`HomePage.jsx`に表示する。
6. **インタラクションの実装**: 商品カードをクリックすると詳細ページに遷移する機能を実装する。

### 5. コードスタイルのガイドライン

AIが生成するコードの品質を一定に保つための簡単な指示です。

- **命名規則**: コンポーネントはパスカルケース（`MyComponent`）、変数や関数はキャメルケース（`myVariable`）で記述すること。
- **コードの整形**: 常に Prettier などを使ってコードを整形し、可読性を高く保つこと。

### 6. 開発サーバー起動とトラブルシューティング

**開発サーバー起動コマンド:**
```bash
npm run dev
```

**よくある問題と解決方法:**
- **サーバーが起動しない場合**: `vite.config.js`の設定を確認し、上記の設定が含まれていることを確認
- **ブラウザが自動で開かない場合**: 手動で `http://localhost:5173/` にアクセス
- **ポート競合の場合**: 別のポート（例：3000）を指定して起動
- **スタンドアロン版の作成**: サーバー起動に問題がある場合は、単一HTMLファイルとして作成可能

**代替起動方法:**
```bash
npm run preview  # プレビューサーバー（port 4173）
npm run build && npx serve dist  # ビルド後にサーブ
```

### 7. GitHub Pagesデプロイ設定

**設定済み項目:**
1. `vite.config.js`に`base: '/praise-kids-app/'`を設定
2. GitHub Actions workflow (`.github/workflows/deploy.yml`) を作成
3. `gh-pages`パッケージをインストール済み

**デプロイ手順:**
1. GitHubリポジトリを作成
2. コードをプッシュ
3. GitHub > Settings > Pages > Source を "GitHub Actions" に設定
4. 自動デプロイ開始

**手動デプロイ:**
```bash
npm run deploy
```

**アクセスURL:**
`https://[username].github.io/[repository-name]/`

### 8. GitHub Actions ワークフロー設定のポイント

**プロジェクト構造がサブディレクトリの場合:**
```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./[project-directory]
    
    steps:
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        # npmキャッシュは無効化（lockファイルパス問題回避）
```

**よくある問題と解決方法:**
- **Dependencies lock file not found エラー**: npmキャッシュを無効化する
- **Build失敗**: working-directory設定でサブディレクトリを指定
- **GitHub Pages設定**: Settings > Pages > Source を "GitHub Actions" に設定必須

**成功例:**
- リポジトリ: `chilprize`
- プロジェクトパス: `praise-kids-app/`
- デプロイURL: `https://yumemi-tsakaguchi.github.io/chilprize/`
```
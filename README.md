# 昭和学院 パソコン部 ホームページ

## 構成
- 静的サイトジェネレーター: Jekyll(GitHub Pagesが標準対応・追加設定不要)
- デザイン: Material 3 Expressive(青系)/ Noto Sans JP / Material Symbols
- 管理画面: Decap CMS(`/admin`。GitHubアカウントでログインした共同編集者だけが利用可能)

## ページ構成
- `index.html` … ホーム(写真スライダー / キャッチコピー / 制作物 / ブログ抜粋)
- `intro.html` … 紹介(活動内容・活動日時)
- `blog.html` … ブログ一覧(タグ絞り込み・日付ソート)
- `works.html` … 制作物一覧
- `_posts/` … ブログ記事(Markdown)
- `_data/home.yml` `_data/intro.yml` `_data/works.yml` … 各ページの内容データ(Decap CMSから編集される)

---

## 公開までの手順

### 1. GitHubリポジトリを作る
1. GitHubで新しいリポジトリを作成(例: `pc-club-site`)
2. このフォルダの中身をリポジトリにpushする

### 2. GitHub Pagesを有効化する
1. リポジトリの `Settings` → `Pages`
2. `Build and deployment` を `Deploy from a branch` にし、`main` ブランチ・`/(root)` を選択
3. しばらくすると `https://ユーザー名.github.io/リポジトリ名/` で公開されます

### 3. 部員をリポジトリの共同編集者に追加する
1. `Settings` → `Collaborators` → `Add people`
2. 管理画面(`/admin`)を使わせたい部員のGitHubアカウントを招待
3. これにより、招待されていない人は管理画面にログインできません

### 4. Decap CMSのログイン機能を有効にする(OAuth設定)
Decap CMSがGitHubにログインするには、小さな「仲介サーバー(OAuthプロバイダ)」が必要です。Netlifyの無料プランで簡単に用意できます。

1. [Netlify](https://www.netlify.com/)に無料登録
2. 公式の「netlify-cms-oauth-provider」または同等のテンプレートをNetlifyにデプロイ(検索すると手順付きのテンプレートが見つかります)
3. GitHub側で「OAuth Apps」を1つ作成し、そのClient ID・Secretを2で作ったNetlifyのサイトに設定
4. 発行されたNetlifyのURL(例: `https://xxxx.netlify.app`)を控える

### 5. `admin/config.yml` を書き換える
```yaml
backend:
  name: github
  repo: あなたのGitHubユーザー名/リポジトリ名
  branch: main
  base_url: https://xxxx.netlify.app   # 手順4で控えたURL
```

### 6. 使ってみる
1. `https://ユーザー名.github.io/リポジトリ名/admin/` にアクセス
2. 「Login with GitHub」でログイン(共同編集者のみ成功します)
3. 「ブログ記事」「紹介タブ」「制作物」「ホームタブ設定」から編集・投稿すると、自動的にGitHubへコミットされ、サイトに反映されます

---

## 画像について
- 通常の写真は `assets/images/uploads/` に保存されます(管理画面からアップロード可)
- 動画はリポジトリに直接置かず、YouTube限定公開+埋め込みを推奨します
- 画像は容量削減のため、アップロード前に圧縮しておくと長期運用しやすくなります

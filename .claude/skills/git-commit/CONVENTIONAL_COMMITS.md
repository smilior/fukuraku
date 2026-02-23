# Conventional Commits 仕様

## フォーマット

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## コミットタイプ一覧

| Type       | 用途                              |
| ---------- | --------------------------------- |
| `feat`     | 新機能追加                        |
| `fix`      | バグ修正                          |
| `docs`     | ドキュメントのみの変更            |
| `style`    | フォーマット・スタイル（ロジック変更なし） |
| `refactor` | リファクタリング（機能追加・バグ修正なし） |
| `perf`     | パフォーマンス改善                |
| `test`     | テストの追加・修正                |
| `build`    | ビルドシステム・依存関係の変更    |
| `ci`       | CI設定の変更                      |
| `chore`    | その他のメンテナンス              |
| `revert`   | コミットの取り消し                |

## Breaking Changes

```
# 感嘆符でBreaking Changeを示す
feat!: remove deprecated endpoint

# またはBREAKING CHANGEフッターを使用
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

## 具体例

```
feat(auth): add Google OAuth login
fix(receipt): correct OCR amount parsing for ¥ symbol
docs(readme): update deployment instructions
refactor(tax): extract 20万円 threshold calculation
test(stripe): add webhook signature verification test
ci: add GitHub Actions test workflow
chore(deps): bump next from 15.0.0 to 15.1.0
```

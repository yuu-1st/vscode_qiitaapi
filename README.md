[vscode marketplace](https://marketplace.visualstudio.com/items?itemName=yuuyu.vscode-qiitaapi)

# vscode-qiitaapi README

vscodeからqiitaに投稿することができる拡張機能です。

現在は、markdown(.md)、orgmode(.org)、html(.html)の３種類のファイルから投稿することが可能です。

<br>

# コマンド一覧

コマンドパレットから、qiitaに記事を投稿することができます。

現在使用できるコマンドは以下の通りです。

|コマンド名|コマンド内容|
|-|-|
| qiitaに投稿する | qiitaに投稿、もしくは記事の更新を行います。 |
| qiita テンプレートを付与する | 現在のアクティブファイルに、投稿に関する情報を記述するテンプレートを付与します。 |
---

<br>

# qiita テンプレート

qiitaに投稿するための付加情報として、ファイルの先頭に「qiita テンプレート」を用意する必要があります。

qiita テンプレートはスラッシュとアスタリスク10個からなるラインで囲まれ、以下の情報を保持します。

|情報名|必要度|情報内容|
|-|-|-|
|ID|-|qiitaの記事IDです。新規投稿の際はIDは存在していないため空白であり、記事の更新の場合はIDが存在しているため必須になります。
|title|必須|記事のタイトルです。|
|private|必須|記事を全体公開にするか限定投稿にするかです。true/falseの記述のみ受け付け、trueの場合は限定投稿、falseの場合は全体公開になります。
|istweet|任意|記事を新規投稿した際に、ツイートするかどうかです。記事の更新の場合はこの値は無視されます。また、qiitaがtwitterと連携していない場合も無視されます。|
|tags|必須|記事につけるタグです。","区切りで最大5つまで指定することが出来ます。|
---

<br>

# 要件

- Markdown(.md)以外の拡張子から投稿する場合は、Pandocのインストールが必要です。

- qiitaのアクセストークンが必要です。

    qiitaの設定→アプリケーション→個人用アクセストークン→新しくトークンを発行する
    を選択し、スコープに「read_qiita」「write_qiita」をオンにした上で発行し、表示されたアクセストークンを、拡張設定から設定してください。

<br>

# 拡張設定

Preferences : Open user settingsから開くユーザー設定の項目で設定できる内容です。

|設定項目名|内容|
|-|-|
|vscode_qiitaapi.accesstoken|qiitaのアクセストークンを設定します。settings.jsonに記述される値のため、ワークスペースに保存する場合はgit等の扱いに注意する必要があります。|
|vscode_qiitaapi.templetedefault|qiita テンプレートのデフォルト値を設定します。|
|vscode_qiitaapi.geturl|mdファイルに設定されているqiita テンプレートを元に記事のurlを取得し、クリップボードに貼り付けます。urlはurl単体と、markdownに直接貼り付けることができる２種類が取得できます。|
---

<br>

# 既知の問題点

・記事内に埋め込まれたローカル画像を投稿できない。
これは、qiita側が画像を投稿するAPIを提供していないため、現状対応することは不可能です。

・"template"のスペルが"templete"になっている。
これは、内部コードを含む全てのコードに影響範囲があるため、修正するか検討中です。

<br>

# 予定

※追加は未定です。使う人次第で増やしたいなとも思っている項目

- IDから投稿記事のダウンロード

- タグ候補の表示

- テンプレートの開始/終了記号を`//**********`から`---`に変更。これはqiitaのMarkdownにも使われている方法で、かつMarkdown的にはテーブルとして認識されるため、邪魔になりにくいと推測できるため。

<br>

# リリースノート

## 0.4.0

### 変更機能

・qiita テンプレートに含まれるタグが、","以外にも空白区切りを使用出来るようになりました。
これは、qiitaのタグに空白が使用できないことが原因で、403エラーが返されるのを防ぐためです。


## 0.3.0

### 新規機能

・qiita テンプレートを元に、urlを取得できるようになりました。urlのみと、markdownに最適化されたurlの2通り取得できます。

### 修正機能

・v0.2.1にて、記事のidが取得できず、保存されない不具合を修正

## 0.2.1

### その他

・コードの一部修正
・githubに公開

## 0.2.0

### 新規機能

・qiita テンプレートを付与する際に、boolean値のデフォルトを設定できるようになりました。デフォルトは`vscode_qiitaapi.templetedefault`にて設定できます。

### 変更機能

・送信するタグにバージョン情報を付与しないように変更

・投稿/更新する際に表示される"qiita ID「xx」に投稿します。"を、メッセージ表示からステータスバーに表示に変更。
これは、メッセージ表示を自動的に非表示にする方法が存在しないために変更されます。

・上記メッセージの表示タイミングを変更

### 修正機能

・投稿に成功した際に表示される「表示」が、シェル実行できない環境の場合動作しない不具合の修正。
※この修正は、シェル実行できない環境でのテストができていないため、修正されていない可能性があります。その場合はフィードバックをお願い致します。

・IDが正しい値ではない時にqiita テンプレートを付与すると、コマンドが失敗したというエラーが表示される不具合の修正。

・tag数、タイトルが制限を超えてqiita テンプレートに記述していても、投稿を試みることが出来る不具合の修正。
（この時、通信が拒否されるエラーが出力されていました。）

### その他

・CHANGELOG.mdを記述

## 0.1.0

テストリリース


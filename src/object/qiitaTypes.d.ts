/* eslint-disable @typescript-eslint/naming-convention */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * このスキーマ定義では、Qiita API v2 のインターフェースをJSON Hyper Schema draft v4形式で表現しています。
 */
export interface QiitaAPIV2JSONSchema {
  access_token: AccessToken;
  authenticated_user: AuthenticatedUser;
  comment: Comment;
  expanded_template: ExpandedTemplate;
  group: Group;
  item: Item;
  like: LGTM;
  project: Project;
  reaction: EmojiReaction;
  remove_team_member: RemoveTeamMember;
  tag: Tag;
  tagging: Tagging;
  team: Team;
  team_access_token: TeamAccessToken;
  team_invitation: InvitedMember;
  template: Template;
  user: User4;
  [k: string]: unknown;
}
/**
 * Qiita API v2で認証・認可を行うためのアクセストークンを表します。
 */
export interface AccessToken {
  /**
   * 登録されたAPIクライアントを特定するためのID
   */
  client_id: string;
  /**
   * アクセストークンに許された操作の一覧
   */
  scopes: string[];
  /**
   * アクセストークンを表現する文字列
   */
  token: string;
  [k: string]: unknown;
}
/**
 * 現在のアクセストークンで認証中のユーザを表します。通常のユーザ情報よりも詳細な情報を含んでいます。
 */
export interface AuthenticatedUser {
  /**
   * 自己紹介文
   */
  description: null | string;
  /**
   * Facebook ID
   */
  facebook_id: null | string;
  /**
   * このユーザがフォローしているユーザの数
   */
  followees_count: number;
  /**
   * このユーザをフォローしているユーザの数
   */
  followers_count: number;
  /**
   * GitHub ID
   */
  github_login_name: null | string;
  /**
   * ユーザID
   */
  id: string;
  /**
   * このユーザが qiita.com 上で公開している記事の数 (Qiita Teamでの記事数は含まれません)
   */
  items_count: number;
  /**
   * LinkedIn ID
   */
  linkedin_id: null | string;
  /**
   * 居住地
   */
  location: null | string;
  /**
   * 設定している名前
   */
  name: null | string;
  /**
   * 所属している組織
   */
  organization: null | string;
  /**
   * ユーザごとに割り当てられる整数のID
   */
  permanent_id: number;
  /**
   * 設定しているプロフィール画像のURL
   */
  profile_image_url: string;
  /**
   * Qiita Team専用モードに設定されているかどうか
   */
  team_only: boolean;
  /**
   * Twitterのスクリーンネーム
   */
  twitter_screen_name: null | string;
  /**
   * 設定しているWebサイトのURL
   */
  website_url: null | string;
  /**
   * 1ヶ月あたりにQiitaにアップロードできる画像の総容量
   */
  image_monthly_upload_limit: number;
  /**
   * その月にQiitaにアップロードできる画像の残りの容量
   */
  image_monthly_upload_remaining: number;
  [k: string]: unknown;
}
/**
 * 記事やプロジェクトに付けられたコメントを表します。プロジェクトへのコメントはQiita Teamでのみ有効です。
 */
export interface Comment {
  /**
   * コメントの内容を表すMarkdown形式の文字列
   */
  body: string;
  /**
   * データが作成された日時
   */
  created_at: string;
  /**
   * コメントの一意なID
   */
  id: string;
  /**
   * コメントの内容を表すHTML形式の文字列
   */
  rendered_body: string;
  /**
   * データが最後に更新された日時
   */
  updated_at: string;
  user: User;
  [k: string]: unknown;
}
/**
 * Qiita上のユーザを表します。
 */
export interface User {
  /**
   * 自己紹介文
   */
  description: null | string;
  /**
   * Facebook ID
   */
  facebook_id: null | string;
  /**
   * このユーザがフォローしているユーザの数
   */
  followees_count: number;
  /**
   * このユーザをフォローしているユーザの数
   */
  followers_count: number;
  /**
   * GitHub ID
   */
  github_login_name: null | string;
  /**
   * ユーザID
   */
  id: string;
  /**
   * このユーザが qiita.com 上で公開している記事の数 (Qiita Teamでの記事数は含まれません)
   */
  items_count: number;
  /**
   * LinkedIn ID
   */
  linkedin_id: null | string;
  /**
   * 居住地
   */
  location: null | string;
  /**
   * 設定している名前
   */
  name: null | string;
  /**
   * 所属している組織
   */
  organization: null | string;
  /**
   * ユーザごとに割り当てられる整数のID
   */
  permanent_id: number;
  /**
   * 設定しているプロフィール画像のURL
   */
  profile_image_url: string;
  /**
   * Qiita Team専用モードに設定されているかどうか
   */
  team_only: boolean;
  /**
   * Twitterのスクリーンネーム
   */
  twitter_screen_name: null | string;
  /**
   * 設定しているWebサイトのURL
   */
  website_url: null | string;
  [k: string]: unknown;
}
/**
 * テンプレートを保存する前に変数展開後の状態をプレビューできます。Qiita Teamでのみ有効です。
 */
export interface ExpandedTemplate {
  /**
   * 変数を展開した状態の本文
   */
  expanded_body: string;
  /**
   * 変数を展開した状態のタグ一覧
   */
  expanded_tags: {
    name: string;
    versions?: string[];
    [k: string]: unknown;
  }[];
  /**
   * 変数を展開した状態のタイトル
   */
  expanded_title: string;
  [k: string]: unknown;
}
/**
 * Qiita Teamのグループを表します。
 */
export interface Group {
  /**
   * データが作成された日時
   */
  created_at: string;
  /**
   * グループの一意なIDを表します。
   */
  id: number;
  /**
   * グループに付けられた表示用の名前を表します。
   */
  name: string;
  /**
   * 非公開グループかどうかを表します。
   */
  private: boolean;
  /**
   * データが最後に更新された日時
   */
  updated_at: string;
  /**
   * グループのチーム上での一意な名前を表します。
   */
  url_name: string;
  [k: string]: unknown;
}
/**
 * ユーザからの投稿を表します。
 */
export interface Item {
  /**
   * HTML形式の本文
   */
  rendered_body: string;
  /**
   * Markdown形式の本文
   */
  body: string;
  /**
   * この記事が共同更新状態かどうか (Qiita Teamでのみ有効)
   */
  coediting: boolean;
  /**
   * この記事へのコメントの数
   */
  comments_count: number;
  /**
   * データが作成された日時
   */
  created_at: string;
  group: Group1;
  /**
   * 記事の一意なID
   */
  id: string;
  /**
   * この記事への「LGTM！」の数（Qiitaでのみ有効）
   */
  likes_count: number;
  /**
   * 限定共有状態かどうかを表すフラグ (Qiita Teamでは無効)
   */
  private: boolean;
  /**
   * 絵文字リアクションの数（Qiita Teamでのみ有効）
   */
  reactions_count: number;
  /**
   * 記事に付いたタグ一覧
   */
  tags: {
    name: string;
    versions?: string[];
    [k: string]: unknown;
  }[];
  /**
   * 記事のタイトル
   */
  title: string;
  /**
   * データが最後に更新された日時
   */
  updated_at: string;
  /**
   * 記事のURL
   */
  url: string;
  user: User1;
  /**
   * 閲覧数
   */
  page_views_count: null | number;
  /**
   * Qiita Team のチームメンバー情報を表します。
   */
  team_membership: {
    /**
     * チームに登録しているユーザー名
     */
    name: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
/**
 * Qiita Teamのグループを表します。
 */
export interface Group1 {
  /**
   * データが作成された日時
   */
  created_at: string;
  /**
   * グループの一意なIDを表します。
   */
  id: number;
  /**
   * グループに付けられた表示用の名前を表します。
   */
  name: string;
  /**
   * 非公開グループかどうかを表します。
   */
  private: boolean;
  /**
   * データが最後に更新された日時
   */
  updated_at: string;
  /**
   * グループのチーム上での一意な名前を表します。
   */
  url_name: string;
  [k: string]: unknown;
}
/**
 * Qiita上のユーザを表します。
 */
export interface User1 {
  /**
   * 自己紹介文
   */
  description: null | string;
  /**
   * Facebook ID
   */
  facebook_id: null | string;
  /**
   * このユーザがフォローしているユーザの数
   */
  followees_count: number;
  /**
   * このユーザをフォローしているユーザの数
   */
  followers_count: number;
  /**
   * GitHub ID
   */
  github_login_name: null | string;
  /**
   * ユーザID
   */
  id: string;
  /**
   * このユーザが qiita.com 上で公開している記事の数 (Qiita Teamでの記事数は含まれません)
   */
  items_count: number;
  /**
   * LinkedIn ID
   */
  linkedin_id: null | string;
  /**
   * 居住地
   */
  location: null | string;
  /**
   * 設定している名前
   */
  name: null | string;
  /**
   * 所属している組織
   */
  organization: null | string;
  /**
   * ユーザごとに割り当てられる整数のID
   */
  permanent_id: number;
  /**
   * 設定しているプロフィール画像のURL
   */
  profile_image_url: string;
  /**
   * Qiita Team専用モードに設定されているかどうか
   */
  team_only: boolean;
  /**
   * Twitterのスクリーンネーム
   */
  twitter_screen_name: null | string;
  /**
   * 設定しているWebサイトのURL
   */
  website_url: null | string;
  [k: string]: unknown;
}
/**
 * <strong>Qiita TeamのLGTMAPIは2020年11月4日より廃止となりました。今後は絵文字リアクションAPIをご利用ください。</strong> 記事につけられた「LGTM！」を表します。
 */
export interface LGTM {
  /**
   * データが作成された日時
   */
  created_at: string;
  user: User2;
  [k: string]: unknown;
}
/**
 * Qiita上のユーザを表します。
 */
export interface User2 {
  /**
   * 自己紹介文
   */
  description: null | string;
  /**
   * Facebook ID
   */
  facebook_id: null | string;
  /**
   * このユーザがフォローしているユーザの数
   */
  followees_count: number;
  /**
   * このユーザをフォローしているユーザの数
   */
  followers_count: number;
  /**
   * GitHub ID
   */
  github_login_name: null | string;
  /**
   * ユーザID
   */
  id: string;
  /**
   * このユーザが qiita.com 上で公開している記事の数 (Qiita Teamでの記事数は含まれません)
   */
  items_count: number;
  /**
   * LinkedIn ID
   */
  linkedin_id: null | string;
  /**
   * 居住地
   */
  location: null | string;
  /**
   * 設定している名前
   */
  name: null | string;
  /**
   * 所属している組織
   */
  organization: null | string;
  /**
   * ユーザごとに割り当てられる整数のID
   */
  permanent_id: number;
  /**
   * 設定しているプロフィール画像のURL
   */
  profile_image_url: string;
  /**
   * Qiita Team専用モードに設定されているかどうか
   */
  team_only: boolean;
  /**
   * Twitterのスクリーンネーム
   */
  twitter_screen_name: null | string;
  /**
   * 設定しているWebサイトのURL
   */
  website_url: null | string;
  [k: string]: unknown;
}
/**
 * Qiita Team上でのプロジェクトを表します。Qiita Teamでのみ有効です。
 */
export interface Project {
  /**
   * HTML形式の本文
   */
  rendered_body: string;
  /**
   * このプロジェクトが進行中かどうか
   */
  archived: boolean;
  /**
   * Markdown形式の本文
   */
  body: string;
  /**
   * データが作成された日時
   */
  created_at: string;
  /**
   * プロジェクトのチーム上での一意なID
   */
  id: number;
  /**
   * プロジェクト名
   */
  name: string;
  /**
   * 絵文字リアクション数
   */
  reactions_count: number;
  /**
   * データが最後に更新された日時
   */
  updated_at: string;
  [k: string]: unknown;
}
/**
 * Qiita Team上での絵文字リアクションを表します。Qiita Teamでのみ有効です。
 */
export interface EmojiReaction {
  /**
   * データが作成された日時
   */
  created_at: string;
  /**
   * 絵文字画像のURL
   */
  image_url: string;
  /**
   * 絵文字の識別子
   */
  name: string;
  user: User3;
  [k: string]: unknown;
}
/**
 * Qiita上のユーザを表します。
 */
export interface User3 {
  /**
   * 自己紹介文
   */
  description: null | string;
  /**
   * Facebook ID
   */
  facebook_id: null | string;
  /**
   * このユーザがフォローしているユーザの数
   */
  followees_count: number;
  /**
   * このユーザをフォローしているユーザの数
   */
  followers_count: number;
  /**
   * GitHub ID
   */
  github_login_name: null | string;
  /**
   * ユーザID
   */
  id: string;
  /**
   * このユーザが qiita.com 上で公開している記事の数 (Qiita Teamでの記事数は含まれません)
   */
  items_count: number;
  /**
   * LinkedIn ID
   */
  linkedin_id: null | string;
  /**
   * 居住地
   */
  location: null | string;
  /**
   * 設定している名前
   */
  name: null | string;
  /**
   * 所属している組織
   */
  organization: null | string;
  /**
   * ユーザごとに割り当てられる整数のID
   */
  permanent_id: number;
  /**
   * 設定しているプロフィール画像のURL
   */
  profile_image_url: string;
  /**
   * Qiita Team専用モードに設定されているかどうか
   */
  team_only: boolean;
  /**
   * Twitterのスクリーンネーム
   */
  twitter_screen_name: null | string;
  /**
   * 設定しているWebサイトのURL
   */
  website_url: null | string;
  [k: string]: unknown;
}
/**
 * 指定のユーザーをチームから離脱させます(自身とチームのオーナーはこのAPIでは離脱させられません。)。
 */
export interface RemoveTeamMember {
  [k: string]: unknown;
}
/**
 * 記事に付けられた個々のタグを表します。
 */
export interface Tag {
  /**
   * このタグをフォローしているユーザの数
   */
  followers_count: number;
  /**
   * このタグに設定されたアイコン画像のURL
   */
  icon_url: null | string;
  /**
   * タグを特定するための一意な名前
   */
  id: string;
  /**
   * このタグが付けられた記事の数
   */
  items_count: number;
  [k: string]: unknown;
}
/**
 * 記事とタグとの関連を表します。
 */
export interface Tagging {
  /**
   * タグを特定するための一意な名前
   */
  name: string;
  versions: string[];
  [k: string]: unknown;
}
/**
 * Qiita Team上で所属しているチームを表します。Qiita Teamでのみ有効です。
 */
export interface Team {
  /**
   * チームが利用可能な状態かどうか
   */
  active: boolean;
  /**
   * チームの一意なID
   */
  id: string;
  /**
   * チームに設定されている名前を表します。
   */
  name: string;
  [k: string]: unknown;
}
/**
 * Qiita API v2で認証・認可を行うためのチーム別アクセストークンを表します。Qiita Teamでのみ有効です。
 */
export interface TeamAccessToken {
  /**
   * 登録されたAPIクライアントを特定するためのID
   */
  client_id: string;
  /**
   * アクセストークンに許された操作の一覧
   */
  scopes: string[];
  /**
   * アクセストークンを表現する文字列
   */
  token: string;
  [k: string]: unknown;
}
/**
 * Qiita Teamでの招待中のメンバーを表します。(Qiita Teamでのみ有効。管理者権限が必要。)
 */
export interface InvitedMember {
  /**
   * 招待中のメンバーのemailアドレスです。
   */
  email: string;
  /**
   * 招待用URLです。有効期限は1日です。
   */
  url: string;
  [k: string]: unknown;
}
/**
 * 記事のひな形に利用できるテンプレートを表します。Qiita Teamでのみ有効です。
 */
export interface Template {
  /**
   * テンプレートの本文
   */
  body: string;
  /**
   * テンプレートの一意なID
   */
  id: number;
  /**
   * テンプレートを判別するための名前
   */
  name: string;
  /**
   * 変数を展開した状態の本文
   */
  expanded_body: string;
  /**
   * 変数を展開した状態のタグ一覧
   */
  expanded_tags: {
    name: string;
    versions?: string[];
    [k: string]: unknown;
  }[];
  /**
   * 変数を展開した状態のタイトル
   */
  expanded_title: string;
  /**
   * タグ一覧
   */
  tags: {
    name: string;
    versions?: string[];
    [k: string]: unknown;
  }[];
  /**
   * 生成される記事のタイトルの雛形
   */
  title: string;
  [k: string]: unknown;
}
/**
 * Qiita上のユーザを表します。
 */
export interface User4 {
  /**
   * 自己紹介文
   */
  description: null | string;
  /**
   * Facebook ID
   */
  facebook_id: null | string;
  /**
   * このユーザがフォローしているユーザの数
   */
  followees_count: number;
  /**
   * このユーザをフォローしているユーザの数
   */
  followers_count: number;
  /**
   * GitHub ID
   */
  github_login_name: null | string;
  /**
   * ユーザID
   */
  id: string;
  /**
   * このユーザが qiita.com 上で公開している記事の数 (Qiita Teamでの記事数は含まれません)
   */
  items_count: number;
  /**
   * LinkedIn ID
   */
  linkedin_id: null | string;
  /**
   * 居住地
   */
  location: null | string;
  /**
   * 設定している名前
   */
  name: null | string;
  /**
   * 所属している組織
   */
  organization: null | string;
  /**
   * ユーザごとに割り当てられる整数のID
   */
  permanent_id: number;
  /**
   * 設定しているプロフィール画像のURL
   */
  profile_image_url: string;
  /**
   * Qiita Team専用モードに設定されているかどうか
   */
  team_only: boolean;
  /**
   * Twitterのスクリーンネーム
   */
  twitter_screen_name: null | string;
  /**
   * 設定しているWebサイトのURL
   */
  website_url: null | string;
  [k: string]: unknown;
}

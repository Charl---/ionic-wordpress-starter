export * from './comment-model';
export * from './comment-store';
export * from './comment-api-http';
export * from './comment-api-sql';

import { CommentStore, CommentHttpApi, CommentSqlApi } from './index';

export const COMMENT_PROVIDERS = [
  CommentHttpApi,
  CommentSqlApi,
  CommentStore
]

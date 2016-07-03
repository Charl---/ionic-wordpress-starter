export * from './comment-model';
export * from './comment-store';
export * from './comment-api-http';

import {CommentStore, CommentHttpApi} from './index';

export const COMMENT_PROVIDERS = [
  CommentStore,
  CommentHttpApi
]

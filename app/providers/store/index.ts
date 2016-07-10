import {EventQueue} from 'sparix';
import {ARTICLE_PROVIDERS} from './article';
import {CATEGORY_PROVIDERS} from './category';
import {USER_PROVIDER} from './user';
import {COMMENT_PROVIDERS} from './comment';

export * from './article';
export * from './category';
export * from './user';
export * from './comment';

export const STORE_PROVIDERS = [
  EventQueue,
  ...ARTICLE_PROVIDERS,
  ...CATEGORY_PROVIDERS,
  ...USER_PROVIDER,
  ...COMMENT_PROVIDERS
]

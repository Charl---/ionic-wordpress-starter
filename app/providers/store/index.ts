import {EventQueue} from 'sparix';
import {ARTICLE_PROVIDERS} from './article';
import {CATEGORY_PROVIDERS} from './category';
import {USER_PROVIDER} from './user';
import {COMMENT_PROVIDERS} from './comment';

export * from './article';
export * from './category';
export * from './user';
export * from './comment';

console.log(COMMENT_PROVIDERS);

export const STORE_PROVIDERS = [
  EventQueue,
  ...COMMENT_PROVIDERS,
  ...ARTICLE_PROVIDERS,
  ...CATEGORY_PROVIDERS,
  ...USER_PROVIDER
]

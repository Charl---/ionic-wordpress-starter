import {ARTICLE_PROVIDERS} from './article';
import {CATEGORY_PROVIDERS} from './category';
import {USER_PROVIDER} from './user';

export * from './article';
export * from './category';
export * from './user';

export const STORE_PROVIDERS = [
  ...ARTICLE_PROVIDERS,
  ...CATEGORY_PROVIDERS,
  ...USER_PROVIDER
]
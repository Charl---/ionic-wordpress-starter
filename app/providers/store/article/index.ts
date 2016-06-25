export *  from './article-api';
export * from './article-api-sql';
export * from './article-store';
export * from './article-model';

import {ArticleApi, ArticleSqlApi, ArticleStore} from './index';

export const ARTICLE_PROVIDERS = [
  ArticleApi,
  ArticleSqlApi,
  ArticleStore
]

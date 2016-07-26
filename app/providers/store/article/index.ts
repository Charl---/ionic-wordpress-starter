export *  from './article-api-http';
export * from './article-api-sql';
export * from './article-store';
export * from './article-model';

import { ArticleHttpApi, ArticleSqlApi, ArticleStore } from './index';

export const ARTICLE_PROVIDERS = [
  ArticleHttpApi,
  ArticleSqlApi,
  ArticleStore
]

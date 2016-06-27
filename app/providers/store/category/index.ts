export * from './category-api-sql';
export * from './category-api-http';
export * from './category-store';
export * from './category-model';

import {CategoryHttpApi, CategorySqlApi, CategoryStore} from './index';

export const CATEGORY_PROVIDERS = [
  CategoryHttpApi,
  CategorySqlApi,
  CategoryStore
]

export * from './category-api';
export * from './category-api-sql';
export * from './category-store';
export * from './category-model';

import {CategoryApi, CategorySqlApi, CategoryStore} from './index';

export const CATEGORY_PROVIDERS = [
  CategoryApi,
  CategorySqlApi,
  CategoryStore
]
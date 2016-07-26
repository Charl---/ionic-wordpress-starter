export * from './user-api-sql';
export * from './user-store';
export * from './user-model';

import { UserSqlApi, UserStore } from './index';

export const USER_PROVIDER = [
  UserSqlApi,
  UserStore
]

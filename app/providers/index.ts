import {STORE_PROVIDERS} from './store';
import {Config} from './config';
import {Connectivity} from './connectivity';

export const APP_PROVIDERS = [
  ...STORE_PROVIDERS,
  Config,
  Connectivity,
];

export const APP_DIRECTIVES = [];

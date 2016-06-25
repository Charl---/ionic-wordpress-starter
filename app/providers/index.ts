import {STORE_PROVIDERS} from './store';
import {Config} from './config';
import {Connectivity} from './connectivity';
// import {ImageCache} from './image-cache';

export const APP_PROVIDERS = [
  ...STORE_PROVIDERS,
  Config,
  Connectivity,
  // ImageCache
]

export const APP_DIRECTIVES = [
  // ImgCache,
]

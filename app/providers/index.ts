import {EventQueue} from 'sparix';
import {STORE_PROVIDERS} from './store';
import {Connectivity} from './connectivity';
import {FORM_PROVIDERS, FORM_DIRECTIVES} from '@angular/common';

export const APP_PROVIDERS = [
  ...STORE_PROVIDERS,
  ...FORM_PROVIDERS,
  Connectivity,
  EventQueue
];

export const APP_DIRECTIVES = [
  ...FORM_DIRECTIVES
];

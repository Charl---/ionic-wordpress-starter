import { STORE_PROVIDERS } from './store';
import { IONIC_PROVIDERS } from './ionic';
import { APP_PIPES } from '../pipes';

import { FORM_PROVIDERS } from '@angular/common';

export const APP_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...IONIC_PROVIDERS,
  ...STORE_PROVIDERS,
  ...APP_PIPES
];

import { STORE_PROVIDERS } from './store';
import { IONIC_PROVIDERS } from './ionic';
import { APP_DIRECTIVES } from './directives';
import { APP_PIPES } from './pipes';

import { FORM_PROVIDERS } from '@angular/common';

const APP_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...IONIC_PROVIDERS,
  ...STORE_PROVIDERS,
  ...APP_PIPES
];

export {
APP_PROVIDERS,
APP_DIRECTIVES,
APP_PIPES
};

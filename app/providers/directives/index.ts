export * from './user-widget';
export * from './search-widget';
export * from './article-widget';
export * from './article-widget-footer';

import {FORM_DIRECTIVES} from '@angular/common'

import {
  UserWidget,
  SearchWidget,
  ArticleWidget,
  ArticleWidgetFooter
} from './';

export const APP_DIRECTIVES = [
  FORM_DIRECTIVES,
  UserWidget,
  SearchWidget,
  ArticleWidget,
  ArticleWidgetFooter
]

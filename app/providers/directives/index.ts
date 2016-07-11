import {FORM_DIRECTIVES} from '@angular/common'

export * from './user-widget';
export * from './search-widget';
export * from './article-widget';
export * from './article-widget-footer';
export * from './comment-counter'

import {
  UserWidget,
  SearchWidget,
  ArticleWidget,
  ArticleWidgetFooter,
  CommentCounter
} from './';

export const APP_DIRECTIVES = [
  FORM_DIRECTIVES,
  UserWidget,
  SearchWidget,
  ArticleWidget,
  ArticleWidgetFooter,
  CommentCounter
]

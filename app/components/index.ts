import { FORM_DIRECTIVES } from '@angular/common';

export * from './user-widget';
export * from './search-widget';
export * from './article-widget';
export * from './article-widget-footer';
export * from './comment-counter'
export * from './comment-widget';
export * from './article-share-button'
export * from './elastic-header';

import {
  UserWidgetComponent,
  SearchWidgetComponent,
  ArticleWidgetComponent,
  ArticleWidgetFooterComponent,
  CommentCounterComponent,
  ArticleShareButtonComponent,
  CommentWidgetComponent,
  ElasticHeaderDirective
} from './';

export const APP_DIRECTIVES = [
  FORM_DIRECTIVES,
  UserWidgetComponent,
  SearchWidgetComponent,
  ArticleWidgetComponent,
  ArticleWidgetFooterComponent,
  CommentCounterComponent,
  CommentWidgetComponent,
  ArticleShareButtonComponent,
  ElasticHeaderDirective
];

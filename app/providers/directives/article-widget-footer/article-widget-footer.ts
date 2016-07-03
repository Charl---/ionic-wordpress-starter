import {Component, Input, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Article} from '../../store/article'

export interface ArticleWidgetFooterOptions {
  comments?: number;
  date?: Date;
  social: boolean;
}

@Component({
  selector: 'article-widget-footer',
  templateUrl: 'build/providers/directives/article-widget-footer/article-widget-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleWidgetFooter implements OnInit{
  @Input() options: ArticleWidgetFooterOptions;

  ngOnInit() {

  }
}

import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Article } from '../../providers/store/article';
import { UserWidgetOptions } from '../user-widget';

export interface ArticleWidgetOptions {
  preview?: boolean;
}

@Component({
  selector: 'wp-article-widget',
  templateUrl: 'build/components/article-widget/article-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleWidgetComponent implements OnInit {
  @Input() article: Article;
  @Input() options: ArticleWidgetOptions;

  ngOnInit() {
    this.options = this.options ? this.options : [];
    this.article.body = this.options.preview ? this.article.preview : this.article.body;
  }
}

import {Component, Input, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Article} from '../../store/article'
import {UserWidgetOptions} from '../user-widget';

export interface ArticleWidgetOptions {
  preview?: boolean;
}

@Component({
  selector: 'article-widget',
  templateUrl: 'build/providers/directives/article-widget/article-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleWidget implements OnInit{
  @Input() article: Article;
  @Input() options: ArticleWidgetOptions;

  ngOnInit() {
    this.options = this.options ? this.options : [];
    this.article.body = this.options.preview ? this.article.preview : this.article.body;
  }
}

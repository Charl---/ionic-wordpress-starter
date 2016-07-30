import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Article, Comment } from '../../store';
import { ArticlePageComponent } from '../../../pages/article/article';

export interface ArticleWidgetFooterOptions {
  comments?: boolean;
  article?: Article;
  social?: boolean;
  navigate?: boolean;
  date?: boolean;
}

@Component({
  selector: 'wp-article-widget-footer',
  templateUrl: 'build/providers/directives/article-widget-footer/article-widget-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleWidgetFooterComponent {
  @Input() options: ArticleWidgetFooterOptions;
  comments: Comment[] = [];

  constructor(
    private nav: NavController
  ) { }

  goToArticlePage(article: Article): void {
    this.nav.push(ArticlePageComponent, {
      article
    });
  }

  commentsLoadHandler(comments): void {
    this.comments = comments;
  }
}

import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Article, Comment } from '../../providers/store';
import { ArticlePageComponent } from '../../pages/article/article';

export interface ArticleWidgetFooterOptions {
  comments?: boolean;
  article?: Article;
  social?: boolean;
  navigate?: boolean;
  date?: boolean;
}

@Component({
  selector: 'wp-article-widget-footer',
  templateUrl: 'build/components/article-widget-footer/article-widget-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleWidgetFooterComponent {
  @Input() options: ArticleWidgetFooterOptions;
  @Output() onComments: EventEmitter<Comment[]> = new EventEmitter<Comment[]>();
  comments: Comment[] = [];

  constructor(
    private nav: NavController
  ) { }

  goToArticlePage(article: Article): void {
    this.nav.rootNav.push(ArticlePageComponent, {
      article
    });
  }
}

import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {SocialSharing} from 'ionic-native';
import {NavController} from 'ionic-angular';
import {Article} from '../../store/article'
import {Config} from '../../../config';
import {ArticlePage} from '../../../pages/article/article';

export interface ArticleWidgetFooterOptions {
  comments?: number;
  article?: Article;
  social?: boolean;
  navigate?: boolean;
}

@Component({
  selector: 'article-widget-footer',
  templateUrl: 'build/providers/directives/article-widget-footer/article-widget-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleWidgetFooter {
  @Input() options: ArticleWidgetFooterOptions;

  constructor(
    private config: Config,
    private nav: NavController
  ) {}

  shareArticle(article?: Article) {
    SocialSharing.share(
      this.config.social.message,
      this.config.social.subject,
      article.picture,
      'http://www.google.com'
    );
  }

  goToArticlePage(article: Article): void {
    this.nav.push(ArticlePage, {
      article
    });
  }
}

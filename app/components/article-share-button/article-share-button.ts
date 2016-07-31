import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SocialSharing } from 'ionic-native';
import { Article } from '../../providers/store';
import { Config } from '../../config';

@Component({
  selector: 'wp-article-share-button',
  templateUrl: 'build/components/article-share-button/article-share-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleShareButtonComponent {
  @Input() article: Article;

  constructor(
    private config: Config
  ) { }


  shareArticle(article?: Article) {
    SocialSharing.share(
      this.config.social.message,
      this.config.social.subject,
      this.article.picture,
      'http://www.google.com'
    );
  }
}

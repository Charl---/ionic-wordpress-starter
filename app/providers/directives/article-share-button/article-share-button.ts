import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {SocialSharing} from 'ionic-native';
import {Article} from '../../store'
import {Config} from '../../../config';

@Component({
  selector: 'article-share-button',
  templateUrl: 'build/providers/directives/article-share-button/article-share-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleShareButton {
  @Input() article: Article;

  constructor(
    private config: Config
  ) {}


  shareArticle(article?: Article) {
    SocialSharing.share(
      this.config.social.message,
      this.config.social.subject,
      article.picture,
      'http://www.google.com'
    );
  }
}

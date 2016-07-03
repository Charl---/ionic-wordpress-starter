import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {SocialSharing} from 'ionic-native';
import {NavController} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {Article, CommentStore} from '../../store'
import {Config} from '../../../config';
import {ArticlePage} from '../../../pages/article/article';

export interface ArticleWidgetFooterOptions {
  comments?: boolean;
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
  commentLength$: Observable<number>;
  @Input() options: ArticleWidgetFooterOptions;

  constructor(
    private config: Config,
    private nav: NavController,
    private commentStore: CommentStore
  ) {}

  ngOnInit() {
    if(this.options.comments) {
      this.commentStore.findByArticle(this.options.article);
      this.commentLength$ = this.commentStore
        .map(state => state.comments.get(this.options.article))
        .filter(comments => !!comments)
        .map(comments => comments.length)
    }
  }

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

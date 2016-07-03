import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {Article} from '../../providers/store'
import {ArticleWidgetFooterOptions} from '../../providers/directives/article-widget-footer';

@Component({
  templateUrl: 'build/pages/article/article.html',
})
export class ArticlePage {
  article: Article;
  footerOptions: ArticleWidgetFooterOptions;

  constructor(
    navParams: NavParams
  ) {
    this.article = navParams.get('article');
  }

  ngOnInit() {
    this.footerOptions = {
      social: true,
      comments: 5,
      article: this.article
    }
  }
}

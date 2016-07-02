import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {Article} from '../../providers/store'
import {articleWidgetOptions} from '../../providers/directives/article-widget';

@Component({
  templateUrl: 'build/pages/article/article.html',
})
export class ArticlePage {
  article: Article;
  articleOptions: articleWidgetOptions = {
    footer: true
  }

  constructor(
    navParams: NavParams
  ) {
    this.article = navParams.get('article');
  }
}

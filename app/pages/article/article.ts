import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {Article} from '../../providers/store'

@Component({
  templateUrl: 'build/pages/article/article.html',
})
export class ArticlePage {
  article: Article;

  constructor(
    navParams: NavParams
  ) {
    this.article = navParams.get('article')
  }
}

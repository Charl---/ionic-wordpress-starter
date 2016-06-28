import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {Article} from '../../providers/store'
import {UserWidgetOptions} from '../../providers/directives/user-widget';

@Component({
  templateUrl: 'build/pages/article/article.html',
})
export class ArticlePage {
  article: Article;
  userWidgetOptions: UserWidgetOptions = {
    avatarWidth: 36,
    avatarHeight: 36,
    fontSize: '1em',
    color: 'black'
  }

  constructor(
    navParams: NavParams
  ) {
    this.article = navParams.get('article');
  }
}

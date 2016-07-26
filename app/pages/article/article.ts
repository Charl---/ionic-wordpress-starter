import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Article, CommentStore, Comment } from '../../providers/store'
import { ArticleWidgetFooterOptions } from '../../providers/directives/article-widget-footer';

@Component({
  templateUrl: 'build/pages/article/article.html',
})
export class ArticlePageComponent implements OnInit {
  article: Article;
  footerOptions: ArticleWidgetFooterOptions;

  constructor(
    private commentStore: CommentStore,
    navParams: NavParams
  ) {
    this.article = navParams.get('article');
  }

  ngOnInit() {
    this.footerOptions = {
      social: true,
      comments: true,
      article: this.article
    }
  }
}

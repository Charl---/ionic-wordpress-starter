import { Component, OnInit } from '@angular/core';
import { NavParams, InfiniteScroll, Refresher } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { Config } from '../../../config';
import { ArticleStore, Article } from '../../../providers/store';
import { Connectivity } from '../../../providers/ionic';

@Component({
  templateUrl: 'build/pages/profile/articles/articles.html',
})
export class ArticlesPage implements OnInit {
  articles: Article[];
  connec$: Observable<boolean>;
  isLoading: boolean = true;

  constructor(
    private articleStore: ArticleStore,
    private navParams: NavParams,
    private config: Config,
    private connectivity: Connectivity
  ) { }

  ngOnInit(): void {
    this.articleStore.load({ author: this.navParams.data })
      .then(articles => this.articles = articles)
      .catch(err => console.error(err));

    this.connec$ = this.connectivity
      .map(state => state.isOnline);
  }

  loadMore(infiniteScroll: InfiniteScroll): void {
    this.articleStore
      .loadMore({ author: this.navParams.data })
      .then(articles => {
        console.log(articles)
        this.articles = [...this.articles, ...articles];
        infiniteScroll.complete();
        if (articles.length < this.config.articlePerPage)
          infiniteScroll.enable(false);
      })
      .catch(() => infiniteScroll.complete());
  }

  doRefresh(refresher: Refresher): void {
    this.articleStore
      .refresh({
        author: this.navParams.data
      })
      .then(articles => {
        this.articles = [...articles, ...this.articles];
        refresher.complete();
      })
      .catch(() => refresher.complete());
  }
}

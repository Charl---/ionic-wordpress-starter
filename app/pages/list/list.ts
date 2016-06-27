import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController, NavParams, Loading, Refresher, InfiniteScroll, Modal} from 'ionic-angular';
import {Observable, Subscription} from 'rxjs/Rx';
import {Category, ArticleStore, Article} from '../../providers/store';
import {SearchPage} from '../search/search';
import {ArticlePage} from '../article/article';
import {Config} from '../../providers/config';
import {Connectivity} from '../../providers/connectivity';

@Component({
  templateUrl: 'build/pages/list/list.html'
})
export class ListPage implements OnInit, OnDestroy{
  category: Category;
  articles: Article[];
  subscription: Subscription;
  Search: any;
  // displayInfiniteScroll: boolean;

  constructor(private nav: NavController,
              private navParams: NavParams,
              private config: Config,
              public connectivity: Connectivity,
              public articleStore: ArticleStore
  ) {
    this.category = this.navParams.get('category');
    this.articles = [];
    this.Search = SearchPage;
  }

  ngOnInit(): void {
    this.subscription = this.articleStore
      .state$
      .filter(state => state.articles.get(this.category).length > this.articles.length)
      .subscribe(state => {
        state.articles
          .get(this.category)
          .slice(this.articles.length)
          .forEach(article => this.articles.push(article));
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  goToArticlePage(article: Article): void {
    this.nav.push(ArticlePage, {
      article
    });
  }

  loadMore(infiniteScroll: InfiniteScroll): void {
    const config = this.config.data$.getValue();
    this.articleStore
      .loadMore(this.category)
      .then((articles: Article[]) => {
        infiniteScroll.complete();
        if(articles.length < config.articlePerPage)
          infiniteScroll.enable(false);
      })
  }

  doRefresh(refresher: Refresher): void {
    this.articleStore
      .refresh()
      .then(() => refresher.complete())
      .catch((err: any) => console.error(err))
  }
}

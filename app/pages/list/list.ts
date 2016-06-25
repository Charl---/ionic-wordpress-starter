import {Component} from '@angular/core';
import {NavController, NavParams, Loading, Refresher, InfiniteScroll, Modal} from 'ionic-angular';
import {OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Category, ArticleStore, Article, ArticleState} from '../../providers/store';
import {SearchPage} from '../search/search';
import {ArticlePage} from '../article/article';
import {Config} from '../../providers/config';
import {Connectivity} from '../../providers/connectivity';

@Component({
  templateUrl: 'build/pages/list/list.html'
})
export class ListPage implements OnInit{
  category: Category;
  articles: Article[];
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
    this.articleStore
      .state$
      .subscribe((state: ArticleState) => {
        console.log(state.articles)
        state.articles.get(this.category)
          .slice(this.articles.length)
          .forEach((article: Article) => {
            this.articles.push(article);
          })
      });
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

import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController, NavParams, Loading, Refresher, InfiniteScroll, Modal} from 'ionic-angular';
import {Observable, Subscription} from 'rxjs/Rx';
import {Category, ArticleStore, Article} from '../../providers/store';
import {ArticlePage} from '../article/article';
import {Config} from '../../config';
import {Connectivity} from '../../providers/ionic';
import {UserWidgetOptions} from '../../providers/directives/user-widget';
import {SearchWidgetOptions} from '../../providers/directives/search-widget';

@Component({
  templateUrl: 'build/pages/list/list.html'
})
export class ListPage implements OnInit {
  category: Category;
  articles$: Observable<Article[]>;
  connec$: Observable<boolean>;
  displayFilter: boolean = false;
  filter: string = '';
  searchWidgetOptions: SearchWidgetOptions = {
    class: 'list-filter',
    placeholder: 'filter the articles...'
  }
  userWidgetOptions: UserWidgetOptions = {
    avatarWidth: 26,
    avatarHeight: 26,
    fontSize: '0.7em',
    color: 'grey'
  }

  constructor(
    private nav: NavController,
    private config: Config,
    public connectivity: Connectivity,
    public articleStore: ArticleStore,
    navParams: NavParams
  ) {
    this.category = navParams.get('category');
  }

  ngOnInit(): void {
    this.articles$ = this.articleStore
      .map(state => state.articles.get(this.category))

    this.connec$ = this.connectivity
      .map(state => state.isOnline);
  }

  goToArticlePage(article: Article): void {
    this.nav.push(ArticlePage, {
      article
    });
  }

  loadMore(infiniteScroll: InfiniteScroll): void {
    this.articleStore
      .loadMore(this.category)
      .then((articles: Article[]) => {
        infiniteScroll.complete();
        if(articles.length < this.config.articlePerPage)
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Loading, NavController, NavParams, Toast } from 'ionic-angular';
import { ArticleStore, Article, ArticleState } from '../../providers/store';
import { ArticlePageComponent } from '../article/article';
import { UserWidgetOptions } from '../../providers/directives/user-widget';
import { SearchWidgetOptions } from '../../providers/directives/search-widget';

@Component({
  templateUrl: 'build/pages/search/search.html'
})
export class SearchPageComponent implements OnInit {
  articles: Article[] = null;
  query: string;
  userWidgetOptions: UserWidgetOptions = {
    fontSize: '1em',
    color: 'black'
  }
  searchWidgetOptions: SearchWidgetOptions = {
    placeholder: 'filter the articles...',
    autofocus: true
  }

  constructor(
    public articleStore: ArticleStore,
    private nav: NavController,
    private navParams: NavParams
  ) { }

  private displayToast(message): void {
    this.nav.present(Toast.create({
      message: message,
      duration: 3000
    }));
  }

  ngOnInit(): void {
    this.query = this.navParams.get('query')
    this.query ? this.searchHandler(this.query) : null;
  }

  searchHandler(query: string): void {
    if (query.length > 1) {
      this.articles = null;
      this.articleStore.search({ search: query })
        .do(articles => articles.length === 0 ? this.displayToast('no results :(') : null)
        .toPromise()
        .then(articles => this.articles = articles)
        .catch(err => this.displayToast('something wrong happen'));
    }
  }

  goToArticlePage(article: Article): void {
    this.nav.push(ArticlePageComponent, { article });
  }
}

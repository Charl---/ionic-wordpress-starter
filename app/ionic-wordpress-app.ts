import { Component, ViewChild, OnInit } from '@angular/core';
import { App, Platform, Nav, Modal, Loading, MenuController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { Observable } from 'rxjs/Rx';

import { Config } from './config'
import { CategoryStore, Category, CategoryState, ArticleStore, Article } from './providers/store';
import { HomePageComponent } from './pages/home/home';
import { ListPageComponent } from './pages/list/list';
import { SettingsPageComponent } from './pages/settings/settings';
import { SearchPageComponent } from './pages/search/search';
import { Connectivity } from './providers/ionic'
import { SearchWidgetOptions } from './providers/directives/search-widget';

@Component({
  templateUrl: 'build/ionic-wordpress-app.html'
})
export class WordpressAppComponent implements OnInit {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePageComponent;
  listPage: any = ListPageComponent;
  settingsPage: any = SettingsPageComponent;
  searchPage: any = SearchPageComponent;
  categories$: Observable<Category[]>;
  query: string;
  searchWidgetOptions: SearchWidgetOptions = {
    placeholder: 'Search...',
    autofocus: true
  }

  constructor(
    private platform: Platform,
    private config: Config,
    private articleStore: ArticleStore,
    public menu: MenuController,
    public categoryStore: CategoryStore,
    private connec: Connectivity
  ) { }

  private loading(): Loading {
    const loading = Loading.create({
      content: 'loading page'
    });
    this.nav.present(loading);
    return loading;
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      this.categoryStore.initialLoad();
      this.categories$ = this.categoryStore
        .filter(state => state.categories.length > 0)
        .map(state => {
          const articlesFromSqlPromises: Promise<Article[]>[] = state.categories
            .map(category => this.articleStore.initialLoad({ filters: { category } }));

          Promise.all(articlesFromSqlPromises)
            .catch(err => console.error('error loading sql articles', err));
          return state.categories;
        })
    });
  }

  navigateTo(page: any, params?: any, setRoot?: boolean): Promise<any> {
    return setRoot ? this.nav.setRoot(page, params) : this.nav.push(page, params);
  }

  goToListPage(page: any, params: any): void {
    const loading = this.loading();
    this.articleStore
      .load(params.category)
      .then(() => this.navigateTo(page, params, true))
      .then(() => loading.dismiss())
      .catch(err => console.error(err));
  }

  searchHandler(query: string): void {
    if (query.length > 2) {
      this.query = '';
      this.navigateTo(SearchPageComponent, { query }, true);
      this.menu.close();
    }
  }
}

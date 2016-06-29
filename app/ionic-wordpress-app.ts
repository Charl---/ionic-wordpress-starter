import {Component, ViewChild, OnInit} from '@angular/core';
import {App, Platform, Nav, Modal, Loading, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Observable} from 'rxjs/Rx';
import {Splashscreen} from 'ionic-native';

import {Config} from './config'
import {CategoryStore, Category, CategoryState, ArticleStore} from './providers/store';
import {HomePage} from './pages/home/home';
import {ListPage} from './pages/list/list';
import {SettingsPage} from './pages/settings/settings';
import {SearchPage} from './pages/search/search';
import {Connectivity} from './providers/ionic'
import {SearchWidgetOptions} from './providers/directives/search-widget';

@Component({
  templateUrl: 'build/ionic-wordpress-app.html'
})
export class WordpressApp implements OnInit{
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  listPage: any = ListPage;
  settingsPage: any = SettingsPage;
  searchPage: any = SearchPage;
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
  ) {}

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
      this.categories$ = this.categoryStore
        .filter(state => state.categories.length > 0)
        .map(state => {
          Promise.all(
            state.categories
              .map((category: Category) => this.articleStore.loadFromSql({filters: {category}}))
            )
            // .then(() => Splashscreen.hide())
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
    if(query.length > 2) {
      this.query = '';
      this.navigateTo(SearchPage, {query}, true);
      this.menu.close();
    }
  }
}

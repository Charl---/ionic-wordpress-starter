import { Component, ViewChild, OnInit, Type } from '@angular/core';
import { App, Platform, Nav, Modal, Loading, MenuController, Toast } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Observable } from 'rxjs/Rx';

import { Config } from './config';
import { CategoryStore, Category, CategoryState, ArticleStore, Article } from './providers/store';
import { HomePageComponent } from './pages/home/home';
import { ListPageComponent } from './pages/list/list';
import { SettingsPageComponent } from './pages/settings/settings';
import { SearchPageComponent } from './pages/search/search';
import { SearchWidgetOptions } from './components/search-widget';

@Component({
  templateUrl: 'build/ionic-wordpress-app.html'
})
export class WordpressAppComponent implements OnInit {
  @ViewChild(Nav) nav: Nav;
  rootPage: Type = HomePageComponent;
  listPage: Type = ListPageComponent;
  settingsPage: Type = SettingsPageComponent;
  searchPage: Type = SearchPageComponent;
  categories$: Observable<Category[]>;
  query: string;
  searchWidgetOptions: SearchWidgetOptions = {
    placeholder: 'Search...',
    autofocus: true
  };

  constructor(
    private platform: Platform,
    private config: Config,
    private articleStore: ArticleStore,
    public menu: MenuController,
    public categoryStore: CategoryStore
  ) { }

  private loading(): Loading {
    const loading = Loading.create({
      content: 'loading page'
    });
    this.nav.present(loading);
    return loading;
  }

  private displayToast(message): Toast {
    const toast = Toast.create({
      message,
      duration: 3000
    });
    this.nav.present(toast);
    return toast;
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      this.categoryStore.initialLoad();
      this.categories$ = this.categoryStore
        .filter(state => state.categories.length > 0)
        .first()
        .map(state => {
          const articlesFromSqlPromises: Promise<Article[]>[] = state.categories
            .map(category => this.articleStore.initialLoad({ category }));

          Promise.all(articlesFromSqlPromises)
            .then(() => Splashscreen.hide())
            // .catch(() => this.displayToast('something wrong happen'));
            .catch(err => console.log(err))
          return state.categories;
        });
    });
  }

  navigateTo(page: any, params?: any, setRoot?: boolean): Promise<any> {
    return setRoot ? this.nav.setRoot(page, params) : this.nav.push(page, params);
  }

  goToListPage(page: any, params: any): void {
    const loading = this.loading();
    this.articleStore
      .load(params)
      .then(() => this.navigateTo(page, params, false))
      .then(() => loading.dismiss())
      .catch(err => {
        loading.dismiss();
        this.displayToast('something wrong happen');
      });
  }

  searchHandler(query: string): void {
    if (query.length > 2) {
      this.query = '';
      this.navigateTo(SearchPageComponent, { query }, true);
      this.menu.close();
    }
  }
}

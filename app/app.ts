import 'rxjs/Rx';
import {Component} from '@angular/core';
import {ViewChild} from '@angular/core';
import {App, Platform, Nav, Modal, Loading, MenuController, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {EventQueue} from 'sparix';
import {Observable} from 'rxjs/Rx';
import {Config} from './providers/config'
import {CategoryStore, Category, CategoryState, ArticleStore} from './providers/store';
import {HomePage} from './pages/home/home';
import {ListPage} from './pages/list/list';
import {SettingsPage} from './pages/settings/settings';
import {APP_DIRECTIVES, APP_PROVIDERS} from './providers'



@Component({
  templateUrl: 'build/app.html',
  directives: [APP_DIRECTIVES]
})
export class WordpressApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  listPage: any = ListPage;
  settingsPage: any = SettingsPage;
  categories$: Observable<Category[]>;


  constructor(private platform: Platform,
              private config: Config,
              private articleStore: ArticleStore,
              public menu: MenuController,
              public categoryStore: CategoryStore
  ) {
    this.initializeApp();
  }

  private loading(): Loading {
    const loading = Loading.create({
      spinner: 'bubbles',
      content: 'loading page'
    });
    this.nav.present(loading);
    return loading;
  }

  private initializeApp(): void {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      // const loading = this.loading();
      this.config.load();
      this.categoryStore.load();
      this.categories$ = this.categoryStore
        .map((state: CategoryState) => {
          // state.categories.forEach((category: Category) => {
          //   this.articleStore.currentState.articles.set(category, []);
          // })
          Promise.all(state.categories
            .map((category: Category) => this.articleStore.loadFromSql({filters: {category}}))
          )
            // .then(() => loading.dismiss())
            .catch((err: Error) => console.error('error loading sql articles', err));
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
      .catch((err: Error) => console.error(err));
  }

  presentModal(page: any): void {
    this.nav.present(Modal.create(page));
  }
}


ionicBootstrap(WordpressApp, [
  ...APP_PROVIDERS,
  EventQueue
], {});

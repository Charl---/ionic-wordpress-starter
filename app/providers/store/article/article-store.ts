import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Store, EventQueue, Updater } from 'sparix';
import { ArticleHttpApi, ArticleSqlApi, Article, ArticleState } from './index';
import { ApiFindAllOptions, ApiCrudAdapter } from '../_api/api-common';
import { Category, CategoryStore } from '../category';
import { User } from '../user';
import { Connectivity } from '../../ionic';
import { Config } from '../../../config';
import { ListFilter } from '../../../pipes';

interface StoreLoadOptions {
  author?: User;
  category?: Category;
}

const initialState: ArticleState = {
  currentCategory: null,
  currentAuthor: null,
  currentPage: 1,
  mostRecentDate: null,
  articles: new Map<string, Article[]>()
};


@Injectable()
export class ArticleStore extends Store<ArticleState> {
  private api: ApiCrudAdapter<Article>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private config: Config,
    private platform: Platform,
    private connectivity: Connectivity,
    private articlesFilter: ListFilter,
    private categoryStore: CategoryStore,
    private sqlApi: ArticleSqlApi,
    private httpApi: ArticleHttpApi,
    eventQueue: EventQueue
  ) {
    super(new EventQueue, initialState);
    this.api = httpApi;
    this.connectivity.state$.subscribe(state => {
      this.api = state.isOnline ? httpApi : sqlApi;
    });
  }

  /**
   * [findAllApiCall description]
   * @param  {StoreLoadOptions}   options [description]
   * @param  {boolean}            refresh [description]
   * @return {Promise<Article[]>}         [description]
   */
  private findAllApiCall(options: StoreLoadOptions, refresh?: boolean): Promise<Article[]> {
    const apiOptions: ApiFindAllOptions = {
      page: this.currentState.currentPage,
      filters: options
    };

    if (refresh)
      apiOptions.after = this.currentState.mostRecentDate;

    return this.api.findAll(apiOptions)
      .then(articles => this.complexUpdate(options, articles))
      .then(articles => this.api === this.httpApi ? this.sqlApi.insertAll(articles) : articles)
      .catch(err => console.error(err));
  }

  /**
   * [resetState description]
   * @param {StoreLoadOptions} options  [description]
   * @param {Article[]}        articles [description]
   */
  private resetState(options: StoreLoadOptions, articles?: Article[]): void {
    this.update(state => ({
      currentAuthor: options.author,
      currentCategory: options.category,
      currentPage: articles ? Math.ceil(articles.length / this.config.articlePerPage) + 1 : 1,
      mostRecentDate: articles ? articles[0].date.toISOString() : state.mostRecentDate
    }));
  }

  /**
   * [simpleUpdate description]
   * @param  {Category}  category [description]
   * @param  {Article[]} articles [description]
   * @return {[type]}             [description]
   */
  private simpleUpdate(category: Category, articles: Article[]) {
    this.update(state => {
      state.articles.set(category.name, articles);
      return {};
    });
    return articles;
  }

  /**
   * [complexUpdate description]
   * @param  {StoreLoadOptions} options  [description]
   * @param  {Article[]}        articles [description]
   * @param  {boolean}          reverse  [description]
   * @return {Article[]}                 [description]
   */
  private complexUpdate(options: StoreLoadOptions, articles: Article[], reverse?: boolean): Article[] {
    if (articles.length > 0) {
      let stateArticles: Article[];
      this.update((state: ArticleState) => {
        if (options.category) {
          stateArticles = state.articles.get(options.category.name) || [];
          reverse
            ? state.articles.set(options.category.name, [...articles, ...stateArticles])
            : state.articles.set(options.category.name, [...stateArticles, ...articles]);
        }

        if (options.author) {
          articles.reverse().forEach(article => {
            stateArticles = state.articles.get(article.category.name) || [];
            if (stateArticles.indexOf(article) === -1) {
              reverse
                ? state.articles.set(article.category.name, [article, ...stateArticles])
                : state.articles.set(article.category.name, [...stateArticles, article]);
            }
          });
        }

        return {
          mostRecentDate: stateArticles[0] ? stateArticles[0].date.toISOString() : null,
          currentPage: reverse ? state.currentPage : state.currentPage + 1
        };
      });
    }
    return articles;
  }

  /**
   * [getByAuthor description]
   * @param  {User}      author [description]
   * @return {Article[]}        [description]
   */
  private getByAuthor(author: User): Article[] {
    let articles = [];
    this.categoryStore.currentState.categories.forEach(category => {
      articles = [...articles, ...this.currentState.articles.get(category.name)
        .filter(article => article.author.id === author.id)];
    });

    articles.sort((a: Article, b: Article) => {
      if (a.date < b.date)
        return 1;
      if (a.date > b.date)
        return -1;
      return 0;
    });

    return articles;
  }

  /**
   * [initialLoad description]
   * @param  {StoreLoadOptions} options [description]
   * @return {Promise<any>}             [description]
   */
  initialLoad(options: StoreLoadOptions): Promise<any> {
    const apiOptions: ApiFindAllOptions = {
      page: this.currentState.currentPage,
      filters: options
    };

    return this.platform.ready()
      .then(() => this.sqlApi.findAll(apiOptions))
      .then(articles => articles.length > 0
        ? this.simpleUpdate(options.category, articles)
        : this.findAllApiCall(options)
      );
  }

  /**
   * [load description]
   * @param  {StoreLoadOptions}   options [description]
   * @return {Promise<Article[]>}         [description]
   */
  load(options: StoreLoadOptions): Promise<Article[]> {
    let articles = [];

    if (options.category)
      articles = this.currentState.articles.get(options.category.name);

    if (options.author)
      articles = this.getByAuthor(options.author);

    if (articles.length) {
      this.resetState(options, articles);

      return Promise.resolve(articles);

    } else {
      this.resetState(options);

      return this.findAllApiCall(options);
    }
  }
  /**
   * [loadMore description]
   * @param  {StoreLoadOptions}   options [description]
   * @return {Promise<Article[]>}         [description]
   */
  loadMore(options: StoreLoadOptions): Promise<Article[]> {
    return this.findAllApiCall(options);
  }

  /**
   * [refresh description]
   * @param  {StoreLoadOptions}   options [description]
   * @return {Promise<Article[]>}         [description]
   */
  refresh(options: StoreLoadOptions): Promise<Article[]> {
    return this.findAllApiCall(options, true);
  }

  /**
   * [search description]
   * @param  {ApiFindAllOptions}     params [description]
   * @return {Observable<Article[]>}        [description]
   */
  search(params: ApiFindAllOptions): Observable<Article[]> {
    this.loading$.next(true);
    return Observable.fromPromise(
      this.platform.ready().then(() => this.api.search(params))
    )
      .do(() => this.loading$.next(false));
  }

  /**
   * [destroyAll description]
   * @return {Promise<void>} [description]
   */
  destroyAll(): Promise<void> {
    this.loading$.next(true);
    return this.sqlApi.destroyAll()
      .then(() => {
        this.update(state => {
          this.categoryStore.currentState.categories.forEach(cat => this.currentState.articles.set(cat.name, []));
          return {};
        });
      })
      .then(() => this.loading$.next(false));
  }
}

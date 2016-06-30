import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Store, EventQueue, Updater} from 'sparix';
import {ArticleHttpApi, ArticleSqlApi, Article, ArticleState, } from './index';
import {ApiFindAllOptions, ApiCrudAdapter} from '../_api/api-common';
import {Category, CategoryStore} from '../category';
import {Connectivity} from '../../ionic';
import {Config} from '../../../config';
import {ListFilter} from '../../pipes';

const initialState: ArticleState = {
  currentCategory: null,
  currentPage: 1,
  mostRecentDate: null,
  articles: new Map<Category, Article[]>()
}

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
    httpApi: ArticleHttpApi,
    eventQueue: EventQueue
  ) {
    super(new EventQueue, initialState);
    this.api = httpApi;
    this.connectivity.state$.subscribe(state => {
      this.api = state.isOnline ? httpApi : sqlApi;
    })
  }

  private findAllOptions(category: Category): ApiFindAllOptions {
    return {
      page: this.currentState.currentPage,
      filters: {
        category: category
      }
    }
  }

  loadFromSql(options: ApiFindAllOptions): Promise<any> {
    return this.platform.ready()
      .then(() => this.sqlApi.findAll(options))
      .then((articles: Article[]) => {
        this.update((state: ArticleState) => {
          state.articles.set(options.filters.category, articles);
          return {};
        })
      })
  }

  load(category: Category): Promise<Article[]> {
    let articles = this.currentState.articles.get(category);
    articles = articles ? articles : [];
    if(articles.length) {
      this.update(() => ({
        currentCategory: category,
        currentPage: Math.round(articles.length / this.config.articlePerPage),
        mostRecentDate: articles[0].date
      }))
      return Promise.resolve(articles);
    } else {
      this.update((state: ArticleState) => ({
        currentCategory: category,
        currentPage: 1
      }))
      return this.platform.ready()
        .then(() => this.api.findAll(this.findAllOptions(category)))
        .then((articles: Article[]) => {
          this.update((state: ArticleState) => {
            state.articles.set(category, articles);
            return {
              mostRecentDate: articles[0].date,
              currentPage: state.currentPage + 1
            }
          })
          return articles;
        })
        .then(articles => this.sqlApi.insertAll(articles));
      }
  }

  loadMore(category: Category): Promise<Article[]> {
    this.update((state: ArticleState) => ({
      currentPage: state.currentPage + 1
    }))
    return this.platform.ready()
      .then(() => this.api.findAll(this.findAllOptions(category)))
      .then(articles => {
        this.update(state => {
          state.articles.set(category, [...state.articles.get(category), ...articles]);
          return {
            currentPage: state.currentPage + 1
          };
        })
        return articles;
      })
      .then(articles => this.sqlApi.insertAll(articles));
  }

  refresh(): Promise<Article[]> {
    console.log(this.currentState);
    return this.platform.ready()
      .then(() => this.api.findAll({
        filters: {
          category: this.currentState.currentCategory,
        },
        // after: this.currentState.mostRecentDate.toDateString(),
      }))
      .then((articles: Article[]) => {
        if(articles.length > 0)
          this.update(state => {
            const category = this.currentState.currentCategory;
            state.articles.set(category, [...articles, ...state.articles.get(category)]);
            return {
              mostRecentDate: !!articles[0] ? articles[0].date : state.mostRecentDate
            }
          })
        return articles
      })
  }

  search(params: ApiFindAllOptions): Observable<Article[]> {
    this.loading$.next(true);
    return Observable.fromPromise(
      this.platform.ready().then(() => {
        return this.connectivity.currentState.isOnline
          ? this.api.search(params)
          : this.articlesFilter.transform(this.currentState.articles.values().next().value, params.search);
      })
    ).do(() => this.loading$.next(false));
  }

  destroyAll(): Promise<void> {
    this.loading$.next(true);
    return this.sqlApi.destroyAll()
      .then(() => {
        this.update(state => {
          this.categoryStore.currentState.categories.forEach(cat => this.currentState.articles.set(cat, []))
          return {};
        })
      })
      .then(() => this.loading$.next(false))
  }
}

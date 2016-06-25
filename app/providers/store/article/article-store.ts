import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Store, EventQueue, Updater} from 'sparix';
import {ArticleApi, ArticleSqlApi, Article, ArticleState} from './index';
import {ApiFindAllOptions} from '../_api/api-common';
import {Category} from '../category';
import {Connectivity} from '../../connectivity';
import {Config} from '../../config';
import {Api} from "../_api/api";

@Injectable()
export class ArticleStore extends Store<ArticleState> {
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private api: ArticleApi,
              private sqlApi: ArticleSqlApi,
              private connectivity: Connectivity,
              private config: Config,
              eventQueue: EventQueue
  ) {
    super(eventQueue, {
      currentCategory: null,
      currentPage: 1,
      mostRecentDate: null,
      articles: new Map<Category, Article[]>()
    });
  }

  private findAllOptions(category: Category): ApiFindAllOptions {
    return {
      page: this.currentState.currentPage,
      filters: {
        category: category
      }
    }
  }

  private apiStream(options: ApiFindAllOptions): Observable<Article[]> {
    this.loading$.next(true);
    const offlineStream$ = this.sqlApi.findAll(options);
    const onlineStream$ = this.api.findAll(options)
      .mergeMap((articles: Article[]) => this.sqlApi.insertAll(articles));

    return this.connectivity.isOnline$
      .mergeMap((isOnline: boolean) => isOnline ? onlineStream$ : offlineStream$);
  }

  loadFromSql(options: ApiFindAllOptions): Promise<any> {
    return this.sqlApi.findAll(options)
      .map((articles: Article[]) => {
        this.update((state: ArticleState) => {
          state.articles.set(options.filters.category, articles);
          return {};
        })
      }).toPromise();
  }

  load(category: Category): Promise<Article[]> {
    const articles = this.currentState.articles.get(category);
    const config = this.config.data$.getValue();
    if (articles.length) {
      this.update(() => ({
        currentCategory: category,
        currentPage: Math.round(articles.length / config.articlePerPage)
      }))
      return Promise.resolve(articles);
    } else {
      this.update((state: ArticleState) => ({
        currentCategory: category,
        currentPage: 1
      }))
      return new Promise((resolve, reject) => {
        const subscription = this.apiStream(this.findAllOptions(category))
          .subscribe(
            (articles: Article[]) => {
              console.log('store done', articles)
              this.update((state: ArticleState) => {
                state.articles.set(category, articles);
                subscription.unsubscribe();
                resolve(articles);
                return {}
              })
            },
            (err: any) =>  reject(err)
          )
      })
    }
  }

  loadMore(category: Category): Promise<Article[]> {
    this.update((state: ArticleState) => ({
      currentPage: state.currentPage + 1
    }))
    return new Promise((resolve, reject) => {
      const subscription = this.apiStream(this.findAllOptions(category))
        .subscribe(
          (articles: Article[]) => {
            this.update((state: ArticleState) => {
              const stateArticles: Article[] = state.articles.get(category);
              articles.forEach((article: Article) => {
                stateArticles.push(article);
              })
              subscription.unsubscribe();
              resolve(articles);
              return {};
            })
          },
          (err: Error) => reject(err)
        )
    })
  }


  refresh(): Promise<Article[]> {
    return this.api.findAll({
      filters: {
        category: this.currentState.currentCategory.slug,
        after: this.currentState.mostRecentDate,
      }
    })
      .map((articles: Article[]) => {
        if(articles.length > 0)
          this.update((state: ArticleState) => {
            const category = this.currentState.currentCategory;
            state.articles.set(category,
              [...articles, ...state.articles.get(category)]
            );
            return {
              mostRecentDate: articles[0] ? articles[0].date : state.mostRecentDate
            }
          })
        return articles
      })
      .toPromise()
  }

  search(query: string): Observable<Article[]> {
    return this.apiStream({
      search: query,
      filters: {}
    }).do(() => this.loading$.next(false));
  }
}

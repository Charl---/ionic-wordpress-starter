import { Injectable } from '@angular/core';
import { Http, RequestMethod, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { HttpApi, ApiFindAllOptions, ApiCrudAdapter } from '../_api/api-http';
import { Article } from './index';
import { User, UserStore } from '../user';
import { CategoryStore, Category } from '../category';
import { Config } from '../../../config';
import { HtmlEscape } from '../../../utils';



@Injectable()
export class ArticleHttpApi extends HttpApi implements ApiCrudAdapter<Article> {
  constructor(
    private config: Config,
    private categoryStore: CategoryStore,
    private userStore: UserStore,
    http: Http
  ) {
    super(http);
  }

  // todo move this out of here
  private transformArticle(a: any): Article {
    const category = this.categoryStore
      .currentState
      .categories
      .find((category: Category) => category.id === a.categories[0]);
    const user = a._embedded.author[0];
    const author = new User(user.id, user.name, /*user.avatar_urls[48]*/null, user.description, user.slug);
    this.userStore.insert(author);
    return new Article(a.id, HtmlEscape.unescape(a.title.rendered), a.content.rendered, a.excerpt.rendered, null, new Date(a.date), author, category, this.config.defaultPicture);
  }

  findAll(params: ApiFindAllOptions): Promise<Article[]> {
    const httpParams = {
      _embed: true
    };

    if (params.filters.category)
      httpParams['filter[category_name]'] = params.filters.category.slug;

    if (params.filters.author)
      httpParams['filter[author]'] = params.filters.author.id;

    if (params.page) {
      httpParams['per_page'] = this.config.articlePerPage;
      httpParams['page'] = params.page;
    }

    if (params.after)
      httpParams['after'] = params.after;

    if (params.before)
      httpParams['before'] = params.before;

    return this.request({
      method: RequestMethod.Get,
      url: `${this.config.baseUrl}posts`,
      params: httpParams
    })
      .map((res: Response) => res.json())
      .toPromise()
      .then(articles => articles.map(article => this.transformArticle(article)))
      .catch(err => console.error(err));
  }

  search(params: ApiFindAllOptions): Promise<Article[]> {
    params._embed = true;
    return this.request({
      method: RequestMethod.Get,
      url: `${this.config.baseUrl}posts`,
      params
    })
      .map((res: Response) => res.json())
      .map(articles => articles.map(article => this.transformArticle(article)))
      .toPromise()
      .catch(err => console.error(err));
  }

  count(params: ApiFindAllOptions): Observable<string> {
    const httpParams = {
      'per_page': 1
    };

    if (params.filters.category)
      httpParams['filter[category_name]'] = params.filters.category.slug;

    if (params.filters.author)
      httpParams['filter[author]'] = params.filters.author.id;

    return this.request({
      method: RequestMethod.Get,
      url: `${this.config.baseUrl}posts`,
      params: httpParams
    })
      .map((res: Response) => res.headers.get('X-WP-Total'));
  }
}

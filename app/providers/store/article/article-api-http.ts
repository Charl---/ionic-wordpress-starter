import {Injectable} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs';
import {Api, ApiFindAllOptions, ApiCrudAdapter} from '../_api/api-http';
import {Article} from './index';
import {User, UserStore} from '../user'
import {CategoryStore, Category} from '../category';
import {Config, IConfig} from '../../config';

@Injectable()
export class ArticleHttpApi extends Api implements ApiCrudAdapter<Article>{
  constructor(private config: Config,
              private categoryStore: CategoryStore,
              private userStore: UserStore,
              http: Http
  ) {
    super(http);
  }

  private transformArticle(a: any): Article {
    const category = this.categoryStore
      .currentState
      .categories
      .find((category: Category) => category.id === a.categories[0]);
    const user = a._embedded.author[0];
    const author = new User(user.id, user.name, /*user.avatar_urls[48]*/ '', user.description, user.slug);
    this.userStore.insert(author);
    return new Article(a.id, a.title.rendered, a.content.rendered, null, a.date, author, category);
  }

  findAll(params: ApiFindAllOptions): Promise<Article[]> {
    const config = this.config.data$.getValue();
    const httpParams = {
      _embed: true,
      per_page: 100
    };
    if(params.filters.category)
      httpParams['filter[category_name]'] = params.filters.category.slug;

    if(params.page) {
      httpParams['per_page'] = config.articlePerPage;
      httpParams['page'] = params.page;
    }

    if(params.after)
      httpParams['after'] = params.after;

    if(params.before)
      httpParams['before'] = params.before;

    if(params.search)
      httpParams['search'] = params.search;

    return this.request({
      method: RequestMethod.Get,
      url: `${config.baseUrl}posts`,
      params: httpParams
    }).toPromise()
    .then(articles => articles.map(article => this.transformArticle(article)));
  }

  findOne(id:string): Promise<Article> {
    const config = this.config.data$.getValue();
    return this.request({
      method: RequestMethod.Get,
      url: `${config.baseUrl}posts/${id}`,
    }).toPromise()
      .then(this.transformArticle);
  }
}

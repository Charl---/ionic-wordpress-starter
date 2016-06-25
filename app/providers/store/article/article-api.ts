import {Injectable} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs';
import {Api, ApiFindAllOptions, SparixListAdapter} from '../_api/api';
import {Article} from './index';
import {User, UserStore} from '../user'
import {CategoryStore, Category} from '../category';
import {Config, IConfig} from '../../config';

@Injectable()
export class ArticleApi extends Api implements SparixListAdapter<Article>{
  constructor(private config: Config, 
              private categoryStore: CategoryStore,
              private userStore: UserStore,
              http: Http
  ) {
    super(http);
  }
  
  findAll(params: ApiFindAllOptions):Observable<Article[]> {
    return this.config.data$
      .mergeMap((conf: IConfig) => {
        const httpParams = {
          _embed: true,
          per_page: 100
        };
        if(params.filters.category)
          httpParams['filter[category_name]'] = params.filters.category.slug;
        
        if(params.page) {
          httpParams['per_page'] = conf.articlePerPage;
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
          url: `${conf.baseUrl}posts`,
          params: httpParams
        })
      })
      .map((articles: any) => {
        const response = articles.map((a: any) => {
          const category = this.categoryStore
            .currentState
            .categories
            .find((category: Category) => category.id === a.categories[0]);
          const user = a._embedded.author[0];
          const author = new User(user.id, user.name, /*user.avatar_urls[48]*/ '', user.description, user.slug);
          //todo use sparix event
          this.userStore.insert(author);
          return new Article(a.id, a.title.rendered, a.content.rendered, null, a.date, author, category);
        })

        return response
      })
  }

  findOne(id:string):Observable<Article> {
    return this.config.data$
      .mergeMap((conf: IConfig) => (
        this.request({
          method: RequestMethod.Get,
          url: `${conf.baseUrl}posts/${id}`,
        }))
      )
  }
}
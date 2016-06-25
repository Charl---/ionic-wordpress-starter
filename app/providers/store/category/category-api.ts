import {Injectable} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Api} from '../_api/api';
import {Category} from './index';
import {Config, IConfig} from '../../config';

@Injectable()
export class CategoryApi extends Api{
  constructor(http: Http, private config: Config) {
    super(http);
  }

  findAll(params?:any):Observable<Category[]> {
    return this.config.data$
      .mergeMap((conf: IConfig) => this.request({
          method: RequestMethod.Get,
          url: `${conf.baseUrl}categories`,
          params
        }))
      .map((categories: any[]) => categories.map((cat: any) => new Category(cat.id, cat.name, cat.description, cat.slug)));
  }
}

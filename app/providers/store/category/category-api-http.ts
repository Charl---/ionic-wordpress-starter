import {Injectable} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Api, ApiCrudAdapter} from '../_api/api-http';
import {Category} from './index';
import {Config, IConfig} from '../../config';

@Injectable()
export class CategoryHttpApi extends Api implements ApiCrudAdapter<Category>{
  constructor(http: Http, private config: Config) {
    super(http);
  }

  findAll(params?:any): Promise<Category[]> {
    const config = this.config.data$.getValue();
    return this.request({
      method: RequestMethod.Get,
      url: `${config.baseUrl}categories`,
      params
    }).toPromise()
      .then((categories: Category[]) => categories.map(cat => {
        return new Category(cat.id, cat.name, cat.description, cat.slug)
      }))
  }

  findOne(id: string): Promise<Category> {
    const config = this.config.data$.getValue();
    return this.request({
      method: RequestMethod.Get,
      url: `${config.baseUrl}categories/${id}`
    }).toPromise()
      .then((cat: Category) => new Category(cat.id, cat.name, cat.description, cat.slug));
  }
}

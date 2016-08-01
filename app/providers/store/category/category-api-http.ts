import { Injectable } from '@angular/core';
import { Http, RequestMethod, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpApi, ApiCrudAdapter } from '../_api/api-http';
import { Category } from './index';
import { Config } from '../../../config';

@Injectable()
export class CategoryHttpApi extends HttpApi implements ApiCrudAdapter<Category> {
  constructor(
    private config: Config,
    http: Http
  ) {
    super(http);
  }

  findAll(params?: any): Promise<Category[]> {
    return this.request({
      method: RequestMethod.Get,
      url: `${this.config.baseUrl}categories`,
      params
    })
      .map((res: Response) => res.json())
      .toPromise()
      .then((categories: Category[]) => categories.map(cat => {
        return new Category(cat.id, cat.name, cat.description, cat.slug);
      }))
      .catch(err => console.error(err));
  }
}

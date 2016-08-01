import { Injectable } from '@angular/core';
import { Http, RequestMethod, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { HttpApi, ApiFindAllOptions, ApiCrudAdapter } from '../_api/api-http';
import { Comment } from './index';
import { User, UserStore } from '../user';
import { Article } from '../article';
import { Config } from '../../../config';
import { HtmlEscape } from '../../../utils';

@Injectable()
export class CommentHttpApi extends HttpApi implements ApiCrudAdapter<Comment> {
  constructor(
    private config: Config,
    http: Http
  ) {
    super(http);
  }

  private transformComment(c: any): Comment {
    return new Comment(
      c.id,
      c.post,
      HtmlEscape.unescape(c.content.rendered),
      c.author_name,
      c.author_url,
      null,
      new Date(c.date)
    );
  }

  findAll(params: ApiFindAllOptions): Promise<Comment[]> {
    const httpParams = {};

    if (params.filters.article)
      httpParams['post'] = params.filters.article.id;

    return this.request({
      method: RequestMethod.Get,
      url: `${this.config.baseUrl}comments`,
      params: httpParams
    })
      .map((res: Response) => res.json())
      .toPromise()
      .then(comments => comments.map(comment => this.transformComment(comment)))
      .catch(err => console.error(err));
  }

  count(params: ApiFindAllOptions): Observable<string> {
    const httpParams = {
      'per_page': 1
    };

    if (params.filters.article)
      httpParams['post'] = params.filters.article.id;

    // require auth
    // if (params.filters.author)
    //   httpParams['filter[author]'] = params.filters.author.id;

    return this.request({
      method: RequestMethod.Get,
      url: `${this.config.baseUrl}comments`,
      params: httpParams
    })
      .map((res: Response) => res.headers.get('X-WP-Total'));
  }
}

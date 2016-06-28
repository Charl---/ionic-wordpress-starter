import { Observable } from 'rxjs/Rx';
import { Http, Request, Response, URLSearchParams, RequestOptions } from '@angular/http';

export * from './api-common';

export class HttpApi {
  constructor(private http: Http) {}

  request(options: any): Observable<any> {
    if (options.params) {
      options.search = new URLSearchParams()
      for (let i in options.params) {
        options.search.set(i, options.params[i])
      }
      delete options.params
    }

    return this.http.request(new Request(new RequestOptions(options)))
      .map((res: Response) => res.json());
  }
}

import { Observable } from 'rxjs/Rx';
import { Http, Request, Response, URLSearchParams } from '@angular/http';

export * from './api-common';

export class Api {
  constructor(private http: Http) {}

  request(options: any): Observable<any> {
    if (options.params) {
      options.search = new URLSearchParams()
      for (let i in options.params) {
        options.search.set(i, options.params[i])
      }
      delete options.params
    }

    return this.http.request(new Request(options))
      .map((res: Response) => res.json());
  }
}

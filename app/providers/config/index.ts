import {Injectable} from '@angular/core'
import {Http} from '@angular/http'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'

export interface IConfig {
  baseUrl: string;
  articlePerPage: number;
  defaultPicture?: string;
}

export const CONFIG_API_URL = ''

@Injectable()
export class Config {
  data$: BehaviorSubject<IConfig> = new BehaviorSubject({
    baseUrl: 'http://touriscopie.fr/wp-json/wp/v2/',
    articlePerPage: 10,
    defaultPicture: 'http://touriscopie.fr/wp-content/uploads/2015/05/cropped-parasol.jpg',
    homeCategory: 'Editorial',
  })
  constructor(private http: Http) {}

  load() {
    // this.http.get(CONFIG_API_URL)
    //   .map(data => data.json())
    //   .merge(this.data$)
  }
}

import {Injectable } from '@angular/core';
import {Platform} from 'ionic-angular';
import {Network} from 'ionic-native';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {Store, EventQueue} from 'sparix';
import {CategoryHttpApi, CategorySqlApi, CategoryState, Category} from './index';
import {ApiCrudAdapter} from '../_api/api-common'
import {Connectivity} from '../../ionic'

@Injectable()
export class CategoryStore extends Store<CategoryState>{
  private api: ApiCrudAdapter<Category>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private platform: Platform,
              httpApi: CategoryHttpApi,
              private sqlApi: CategorySqlApi,
              private connectivity: Connectivity)
  {
    super(new EventQueue, {
      categories: []
    });
    this.api = httpApi;
    this.connectivity.state$.subscribe(state => {
      this.api = state.isOnline ? httpApi : sqlApi;
      if(state.isOnline)
        this.load();
    })
  }

  private simpleUpdate(categories: Category[]): Category[] {
    this.update((state: CategoryState) => ({categories}));
    return categories;
  }

  load(): Promise<Category[]> {
    this.loading$.next(true);
    const categories = this.currentState.categories;
    return categories.length
      ? Promise.resolve(this.simpleUpdate(categories))
      : this.platform.ready()
        .then(() => this.api.findAll())
        .then(categories => this.simpleUpdate(categories))
        .then(() => this.loading$.next(false))
        .then(() => this.sqlApi.insertAll(this.currentState.categories))
        .catch((err: Error) => console.error('cat load error ', err));
  }

  getById(id: string): Promise<Category> {
    const existingCategory = this.currentState.categories.find(category => id === category.id);
    return existingCategory
      ? Promise.resolve(existingCategory)
      : this.platform.ready()
        .then(() => this.api.findOne(id))
        .then(category => this.sqlApi.insert(category))
        .catch((err: Error) => console.error('cat load one error ', err));
  }
}

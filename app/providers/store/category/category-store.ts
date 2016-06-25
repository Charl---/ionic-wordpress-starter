import {Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {Store, EventQueue} from 'sparix';
import {CategoryApi, CategorySqlApi, CategoryState, Category} from './index';
import {Connectivity} from "../../connectivity";

@Injectable()
export class CategoryStore extends Store<CategoryState>{
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private api: CategoryApi,
              private sqlApi: CategorySqlApi,
              private connectivity: Connectivity,
              eventQueue: EventQueue
  ) {
    super(eventQueue, {
      categories: []
    });
  }
  private simpleUpdate(categories: Category[]) {
    this.update((state: CategoryState) => ({categories}));
    return categories;
  }

  private apiStream(): Observable<Category[]> {
    this.loading$.next(true);
    const offlineStream$ = this.sqlApi.findAll();
    const onlineStream$ = this.api.findAll()
      .mergeMap((categories: Category[]) => this.sqlApi.insertAll(categories));

    return this.connectivity.isOnline$
      .mergeMap((isOnline: boolean) => isOnline ? onlineStream$ : offlineStream$);
  }
  
  load(): Promise<Category[]> {
    this.loading$.next(true);
    const categories = this.currentState.categories;
    if (categories.length) {
      this.update(() => ({
        categories
      }))
      return Promise.resolve(categories);
    } else {
      return new Promise((resolve, reject) => {
        const subscription = this.apiStream()
          .subscribe(
            (categories: Category[]) => {
              console.log('store done', categories)
              this.loading$.next(false);
              subscription.unsubscribe();
              this.simpleUpdate(categories);
              resolve(categories);
            },
            (err: any) =>  reject(err)
          )
      })
    }
  }

  find(id: string): Promise<Category> {
    const existingCategory = this.currentState.categories.find((category: Category) => id === category.id);
    return existingCategory ? Promise.resolve(existingCategory) : this.sqlApi.find(id);
  }
}

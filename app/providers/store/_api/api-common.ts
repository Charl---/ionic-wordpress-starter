import {Observable} from 'rxjs/Rx';

export interface ApiFindAllOptions{
  page?: number;
  search?: string;
  after?: string;
  before?: string;
  filters?: any;
}

export interface SparixListAdapter<T> {
  findAll(params: ApiFindAllOptions): Observable<T[]>;
  findOne(id: string): Observable<T>;
}

export interface SparixCrudAdapter<T> extends SparixListAdapter<T>{
  insert(item: T):Promise<T>;
  insertAll(items: T[]):Observable<T[]>;
  update(item: T): Observable<T>;
  destroyAll(): Observable<any>;
}

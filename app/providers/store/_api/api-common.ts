import { Observable } from 'rxjs/Rx';

export interface ApiFindAllOptions {
  page?: number;
  search?: string;
  after?: string;
  before?: string;
  filters?: any;
  _embed?: boolean;
}

export interface ApiCrudAdapter<T> {
  findAll?(params?: ApiFindAllOptions): Promise<T[]>;
  findOne?(id: string): Promise<T>;
  insert?(item: T): Promise<T>;
  insertAll?(items: T[]): Promise<T[]>;
  update?(item: T): Promise<T>;
  destroy?(item: T): Promise<void>;
  destroyAll?(): Promise<void>;
  search?(params: ApiFindAllOptions): Promise<T[]>
}

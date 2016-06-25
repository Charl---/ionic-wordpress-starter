import {Injectable} from '@angular/core';
import {Storage, SqlStorage, Platform} from 'ionic-angular';
import {fromPromise} from 'rxjs/observable/fromPromise'
import {Observable} from "rxjs/Rx";
import {Category} from "./index";
import {SqlApi} from '../_api/api-sql';
import {HtmlEscape} from '../../html-escape';

@Injectable()
export class CategorySqlApi extends SqlApi{
  constructor(protected platform: Platform) {
    super(platform, 'CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, title TEXT, description TEXT, slug TEXT)')
  }

  insert(category: Category): Promise<Category> {
    return this.storage
      .query(`INSERT OR REPLACE INTO category (id, title, description, slug) VALUES ('${category.id}', '${category.title}', '${HtmlEscape.escape(category.description)}', '${category.slug}')`)
      .then(() => category)
  }

  findAll(): Observable<Category[]> {
    const storage = this.storage
    return fromPromise(this.platform.ready().then(() => storage.query('SELECT * FROM category')))
      .map((data: any) =>{
        const categories = [];
        for (let i = 0; i < data.res.rows.length; i++) {
          const item = data.res.rows.item(i);
          categories.push(new Category(item.id, item.title, HtmlEscape.unescape(item.description), item.slug))
        }
        return categories;
      })
  }

  find(id: string): Promise<Category> {
    return this.storage.query(`SELECT * FROM category WHERE id = ${id}`)
      .then((data: any) => {
        const category = data.res.rows.item(0);
        return new Category(category.id, category.title, category.description, category.slug)
      })
  }

  destroyAll(): Observable<any> {
    return fromPromise(
      this.platform.ready().then(() => this.storage.query('delete from category'))
    )
  }

  insertAll(categories: Category[]): Observable<any[]>{
    return fromPromise(
      this.platform.ready().then(()=> Promise.all(categories.map(this.insert.bind(this))))
    )
  }
}

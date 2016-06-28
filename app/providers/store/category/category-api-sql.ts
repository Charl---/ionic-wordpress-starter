import {Injectable} from '@angular/core';
import {Storage, SqlStorage, Platform} from 'ionic-angular';
import {Observable} from "rxjs/Rx";
import {Category} from "./index";
import {SqlApi, ApiCrudAdapter} from '../_api/api-sql';
import {HtmlEscape} from '../../../utils';

@Injectable()
export class CategorySqlApi extends SqlApi implements ApiCrudAdapter<Category>{
  constructor(protected platform: Platform) {
    super(platform, 'CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, name TEXT, description TEXT, slug TEXT)')
  }

  insert(category: Category): Promise<Category> {
    return this.storage
      .query(`INSERT OR REPLACE INTO category (id, name, description, slug) VALUES ('${category.id}', '${category.name}', '${HtmlEscape.escape(category.description)}', '${category.slug}')`)
      .then(() => category)
      .catch(err => console.error(err));
  }

  findAll(): Promise<Category[]> {
    return this.storage.query('SELECT * FROM category')
      .then((data: any) =>{
        //todo use Array.prototype.map() (data.res.rows is no fucking array)
        const categories = [];
        for (let i = 0; i < data.res.rows.length; i++) {
          const item = data.res.rows.item(i);
          categories.push(new Category(item.id, item.name, HtmlEscape.unescape(item.description), item.slug))
        }
        return categories;
      })
      .catch(err => console.error(err));
  }

  destroyAll(): Promise<void> {
    return this.storage.query('delete from category')
      .catch(err => console.error(err));
  }

  insertAll(categories: Category[]): Promise<Category[]>{
    return Promise.all(categories.map(category => this.insert(category)))
      .then(() => categories)
      .catch(err => console.error(err));
  }
}

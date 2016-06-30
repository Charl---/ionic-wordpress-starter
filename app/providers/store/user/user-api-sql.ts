import {Injectable} from '@angular/core'
import {Storage, SqlStorage, Platform} from 'ionic-angular'
import {Observable} from 'rxjs/Rx';
import {fromPromise} from 'rxjs/observable/fromPromise'
import {SqlApi, ApiCrudAdapter} from '../_api/api-sql';
import {User} from './index';
import {HtmlEscape} from '../../../utils';

@Injectable()
export class UserSqlApi extends SqlApi implements ApiCrudAdapter<User> {
  constructor(
    platform: Platform
  ) {
    super(platform, 'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, avatar TEXT, description TEXT, slug TEXT)')
  }

  private transformUser(data: any): User {
    const user = data.res.rows.item(0);
    return new User(user.id, user.name, user.avatar, user.description, user.slug);
  }

  insert(user: User): Promise<User> {
    return this.storage.query(`INSERT OR REPLACE INTO user (id, name, avatar, description, slug) VALUES ('${user.id}', '${user.name}', '${user.avatar}', '${HtmlEscape.escape(user.description)}', '${user.slug}')`)
      .then(() => user)
  }

  findOne(id: string): Promise<User> {
    return this.storage.query(`SELECT * FROM user WHERE id = ${id}`)
      .then(this.transformUser)
  }

  destroyAll(): Promise<void> {
    return this.storage.query('delete from user')
  }
}

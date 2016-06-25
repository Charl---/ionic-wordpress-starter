import {Injectable} from '@angular/core'
import {Storage, SqlStorage, Platform} from 'ionic-angular'
import {Observable} from 'rxjs/Rx';
import {fromPromise} from 'rxjs/observable/fromPromise'
import {SqlApi} from '../_api/api-sql';
import {User} from './index';
import {HtmlEscape} from '../../html-escape';

@Injectable()
export class UserSqlApi extends SqlApi {
  constructor(platform: Platform) {
    super(platform, 'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, avatar TEXT, description TEXT, slug TEXT)')
  }

  insert(user: User): Promise<User> {
    return this.storage.query(`INSERT OR REPLACE INTO user (id, name, avatar, description, slug) VALUES ('${user.id}', '${user.name}', '${user.avatar}', '${HtmlEscape.escape(user.description)}', '${user.slug}')`)
      .then(() => user)
  }

  find(id: string): Promise<User> {
    return this.storage.query(`SELECT * FROM user WHERE id = ${id}`)
      .then((data: any) => {
        const user = data.res.rows.item(0);
        return new User(user.id, user.name, user.avatar, user.description, user.slug)
      })
  }

  destroyAll(): Observable<any> {
    return fromPromise(
      this.platform.ready()
        .then(() => this.storage.query('delete from user'))
    )
  }
}

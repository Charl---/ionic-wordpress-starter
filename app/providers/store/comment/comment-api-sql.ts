import {Injectable} from '@angular/core';
import {Storage, SqlStorage, Platform} from 'ionic-angular';
import {Observable} from "rxjs/Rx";
import {Comment} from "./index";
import {SqlApi, ApiCrudAdapter} from '../_api/api-sql';
import {HtmlEscape} from '../../../utils';

@Injectable()
export class CommentSqlApi extends SqlApi implements ApiCrudAdapter<Comment>{
  constructor(
    platform: Platform
  ) {
    super(platform, 'CREATE TABLE IF NOT EXISTS comment (id INTEGER PRIMARY KEY, post INTEGER, content TEXT, authorname TEXT, authorurl TEXT, date TEXT)')
  }

  insert(comment: Comment): Promise<Comment> {
    return this.storage
      .query(`INSERT OR REPLACE INTO comment (id, post, content, authorname, authorurl, date) VALUES ('${comment.id}', '${comment.postId}', '${HtmlEscape.escape(comment.content)}', '${comment.authorName}', '${comment.authorUrl}', '${comment.date}')`)
      .then(() => comment)
      .catch(err => console.error(err));
  }

  findAll(): Promise<Comment[]> {
    return this.storage.query('SELECT * FROM comment')
      .then((data: any) =>{
        //todo use Array.prototype.map() (data.res.rows is no fucking array)
        const comments = [];
        for (let i = 0; i < data.res.rows.length; i++) {
          const item = data.res.rows.item(i);
          comments.push(new Comment(item.id, item.postId, HtmlEscape.unescape(item.content), item.authorName, item.authorUrl, new Date(item.date)))
        }
        return comments;
      })
      .catch(err => console.error(err));
  }

  destroyAll(): Promise<void> {
    return this.storage.query('delete from comment')
      .catch(err => console.error(err));
  }

  insertAll(comments: Comment[]): Promise<Comment[]>{
    return Promise.all(comments.map(comment => this.insert(comment)))
      .then(() => comments)
      .catch(err => console.error(err));
  }
}

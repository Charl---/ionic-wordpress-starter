import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Store, EventQueue} from 'sparix';
import {CommentSqlApi} from './comment-api-sql';
import {CommentHttpApi} from './comment-api-http';
import {Comment, CommentState} from './index';
import {Connectivity} from '../../ionic';
import {ApiFindAllOptions, ApiCrudAdapter} from '../_api/api-common';
import {Article} from '../article';

const initialState: CommentState = {
  comments: new Map<string, Comment[]>()
}

@Injectable()
export class CommentStore extends Store<CommentState> {
  api: ApiCrudAdapter<Comment>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private httpApi: CommentHttpApi,
    private sqlApi: CommentSqlApi,
    private connectivity: Connectivity,
    eventQueue: EventQueue
  ) {
    super(eventQueue, initialState);
    this.api = httpApi;
    this.connectivity.state$
      .skip(1)
      .subscribe(state => {
        this.api = state.isOnline ? httpApi : sqlApi;
      })
  }

  findByArticle(article: Article): Promise<Comment[]> {
    this.loading$.next(true);
    let comments: Comment[] = this.currentState.comments.get(article.title);
    comments = comments ? comments : [];
    if (comments.length > 0) {
      this.update(state => {
        state.comments.set(article.title, comments);
        return {};
      })
      this.loading$.next(false);
      return Promise.resolve(comments);
    } else {
      return this.api.findAll({
        filters: {
          article: article
        }
      }).then(comments => {
        this.update(state => {
          state.comments.set(article.title, comments);
          return {};
        })
        this.loading$.next(false);
        return comments
      })
      .then(comments => this.sqlApi.insertAll(comments))
    }
  }

  destroyAll(): Promise<void> {
    this.loading$.next(true);
    return this.sqlApi.destroyAll()
      .then(() => this.update(state => initialState))
      .then(() => this.loading$.next(false))
  }

}

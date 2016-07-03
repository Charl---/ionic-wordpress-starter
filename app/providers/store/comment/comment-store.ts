import {Injectable} from '@angular/core';
import {Store, EventQueue} from 'sparix';
import {Comment, CommentState} from './index';
import {ApiFindAllOptions, ApiCrudAdapter} from '../_api/api-common';
import {Article} from '../article';
import {CommentHttpApi} from './comment-api-http';

const initialState: CommentState = {
  comments: new Map<Article, Comment[]>()
}

@Injectable()
export class CommentStore extends Store<CommentState> {
  api: ApiCrudAdapter<Comment>;
  constructor(
    private httpApi: CommentHttpApi,
    eventQueue: EventQueue
  ) {
    super(eventQueue, initialState);
    this.api = httpApi;
  }

  findByArticle(article: Article): Promise<Comment[]> {
    let comments: Comment[] = this.currentState.comments.get(article);
    comments = comments ? comments : [];
    if (comments.length > 0) {
      this.update(state => {
        state.comments.set(article, comments);
        return {};
      })
      return Promise.resolve(comments);
    } else {
      return this.api.findAll({
        filters: {
          article: article
        }
      }).then(comments => {
        this.update(state => {
          state.comments.set(article, comments);
          return {};
        })
        return comments
      })
    }
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Store, EventQueue } from 'sparix';

import { CommentSqlApi } from './comment-api-sql';
import { CommentHttpApi } from './comment-api-http';
import { Comment, CommentState } from './index';
import { Connectivity } from '../../ionic';
import { ApiFindAllOptions, ApiCrudAdapter } from '../_api/api-common';
import { Article, ArticleStore } from '../article';
import { User } from '../user';
import { Config } from '../../../config';

interface StoreLoadOptions {
  author?: User;
  article?: Article;
}

const initialState: CommentState = {
  currentArticle: null,
  currentAuthor: null,
  currentPage: 1,
  mostRecentDate: null,
  comments: new Map<string, Comment[]>()
};

@Injectable()
export class CommentStore extends Store<CommentState> {
  api: ApiCrudAdapter<Comment>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private httpApi: CommentHttpApi,
    private sqlApi: CommentSqlApi,
    private connectivity: Connectivity,
    private config: Config,
    private articleStore: ArticleStore,
    eventQueue: EventQueue
  ) {
    super(eventQueue, initialState);
    this.api = httpApi;
    this.connectivity.state$
      .skip(1)
      .subscribe(state => {
        this.api = state.isOnline ? httpApi : sqlApi;
      });
  }

  private findAllApiCall(options: StoreLoadOptions, refresh?: boolean): Promise<Comment[]> {
    const apiOptions: ApiFindAllOptions = {
      page: this.currentState.currentPage,
      filters: options
    };

    if (refresh)
      apiOptions.after = this.currentState.mostRecentDate;

    return this.api.findAll(apiOptions)
      .then(comments => this.complexUpdate(options, comments))
      .then(comments => this.api === this.httpApi ? this.sqlApi.insertAll(comments) : comments)
      .catch(err => console.error(err));
  }

  private resetState(options: StoreLoadOptions, comments?: Comment[]): void {
    this.update(state => ({
      currentAuthor: options.author,
      currentArticle: options.article,
      currentPage: comments ? Math.ceil(comments.length / this.config.commentPerPage) + 1 : 1,
      mostRecentDate: comments ? comments[0].date.toISOString() : state.mostRecentDate
    }));
  }

  private complexUpdate(options: StoreLoadOptions, comments: Comment[], reverse?: boolean): Comment[] {
    if (comments.length > 0) {
      let stateComments: Comment[];
      this.update(state => {
        if (options.article) {
          stateComments = state.comments.get(options.article.title) || [];
          reverse
            ? state.comments.set(options.article.id, [...comments, ...stateComments])
            : state.comments.set(options.article.id, [...stateComments, ...comments]);
        }

        if (options.author) {
          comments.reverse().forEach(comment => {
            stateComments = state.comments.get(comment.postId) || [];
            if (stateComments.indexOf(comment) === -1) {
              reverse
                ? state.comments.set(comment.postId, [comment, ...stateComments])
                : state.comments.set(comment.postId, [...stateComments, comment]);
            }
          });
        }

        return {
          mostRecentDate: stateComments[0] ? stateComments[0].date.toISOString() : null,
          currentPage: reverse ? state.currentPage : state.currentPage + 1
        };
      });
    }
    return comments;
  }

  private getByAuthor(author: User): Comment[] {
    let comments = [];
    this.articleStore.currentState.articles.forEach(articles => {
      articles.forEach(article => {
        comments = [...comments, ...this.currentState.comments.get(article.id)
          .filter(comment => comment.authorName === author.name)];
      });
    });

    comments.sort((a: Article, b: Article) => {
      if (a.date < b.date)
        return 1;
      if (a.date > b.date)
        return -1;
      return 0;
    });

    return comments;
  }

  load(options: StoreLoadOptions): Promise<Comment[]> {
    let comments = [];

    if (options.article)
      comments = this.currentState.comments.get(options.article.id) || [];

    if (options.author)
      comments = this.getByAuthor(options.author);

    if (comments.length) {
      this.resetState(options, comments);

      return Promise.resolve(comments);

    } else {
      this.resetState(options);

      return this.findAllApiCall(options);
    }
  }

  loadMore(options: StoreLoadOptions): Promise<Comment[]> {
    return this.findAllApiCall(options);
  }

  refresh(options: StoreLoadOptions): Promise<Comment[]> {
    return this.findAllApiCall(options, true);
  }

  count(options: ApiFindAllOptions): Promise<string> {
    return this.api.count(options)
      .toPromise()
      .catch(err => console.error(err));
  }

  destroyAll(): Promise<void> {
    this.loading$.next(true);
    return this.sqlApi.destroyAll()
      .then(() => this.update(state => initialState))
      .then(() => this.loading$.next(false));
  }

}

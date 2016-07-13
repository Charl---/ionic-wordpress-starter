import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {Article, Comment, CommentStore} from '../../store'
import {Config} from '../../../config';

@Component({
  selector: 'comment-counter',
  templateUrl: 'build/providers/directives/comment-counter/comment-counter.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentCounter {
  commentLength$: Observable<number>;
  isLoading: boolean;
  @Input() article: Article;
  @Output() onCommentLoaded: EventEmitter<Comment[]> = new EventEmitter<Comment[]>();

  constructor(
    private config: Config,
    private commentStore: CommentStore
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.commentStore.findByArticle(this.article);

    this.commentLength$ = this.commentStore
      .map(state => state.comments.get(this.article.title))
      .do(() => this.isLoading = false)
      .filter(comments => !!comments)
      .map(comments => comments.length)

  }

  clickHandler() {
    this.onCommentLoaded.emit(this.commentStore.currentState.comments.get(this.article.title));
  }
}

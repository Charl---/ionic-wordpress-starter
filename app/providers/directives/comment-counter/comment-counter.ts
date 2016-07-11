import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {Article, CommentStore} from '../../store'
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

  constructor(
    private config: Config,
    private commentStore: CommentStore
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.commentStore.findByArticle(this.article);

    this.commentLength$ = this.commentStore
      .map(state => state.comments.get(this.article))
      .do(() => this.isLoading = false)
      .filter(comments => !!comments)
      .map(comments => comments.length)

  }
}

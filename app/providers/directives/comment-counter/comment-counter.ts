import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Article, Comment, CommentStore } from '../../store'
import { Config } from '../../../config';

@Component({
  selector: 'wp-comment-counter',
  templateUrl: 'build/providers/directives/comment-counter/comment-counter.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentCounterComponent implements OnInit {
  commentLength$: Observable<number>;
  isLoading: boolean;
  @Input() article: Article;
  @Output() onCommentLoaded: EventEmitter<Comment[]> = new EventEmitter<Comment[]>();

  constructor(
    private config: Config,
    private commentStore: CommentStore
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.commentStore.findByArticle(this.article);

    this.commentLength$ = this.commentStore
      .map(state => state.comments.get(this.article.title))
      .do(() => this.isLoading = false)
      .filter(comments => !!comments)
      .map(comments => comments.length)

  }

  clickHandler(): void {
    this.onCommentLoaded.emit(this.commentStore.currentState.comments.get(this.article.title));
  }
}

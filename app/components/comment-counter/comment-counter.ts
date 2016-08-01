import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { Article, Comment, CommentStore, User } from '../../providers/store';

@Component({
  selector: 'wp-comment-counter',
  templateUrl: 'build/components/comment-counter/comment-counter.html'
})
export class CommentCounterComponent implements OnInit {
  isLoading: boolean = true;
  counter: string;
  @Input() article: Article;
  @Input() author: User;
  @Output() onCommentLoaded: EventEmitter<Comment[]> = new EventEmitter<Comment[]>();

  constructor(
    private commentStore: CommentStore
  ) { }

  ngOnInit(): void {
    this.commentStore.count({
      filters: {
        article: this.article,
        author: this.author
      }
    })
      .then(count => {
        this.isLoading = false;
        this.counter = count;
      })
      .catch(err => console.error(err));
  }

  clickHandler(): void {
    this.commentStore.load({
      article: this.article,
      author: this.author
    })
      .then(comments => this.onCommentLoaded.emit(comments))
      .catch(err => console.error(err));
  }
}

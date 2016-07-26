import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Comment } from '../../store';

@Component({
  selector: 'wp-comment-widget',
  templateUrl: 'build/providers/directives/comment-widget/comment-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentWidgetComponent {
  @Input() comment: Comment;
}

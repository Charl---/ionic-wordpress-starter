import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Comment } from '../../providers/store';

@Component({
  selector: 'wp-comment-widget',
  templateUrl: 'build/components/comment-widget/comment-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentWidgetComponent {
  @Input() comment: Comment;
}

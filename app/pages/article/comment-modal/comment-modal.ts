import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { Comment } from '../../../providers/store/comment';

@Component({
  templateUrl: './build/pages/article/comment-modal/comment-modal.html'
})
export class CommentModalPageComponent {
  comments: Comment[];

  constructor(
    private viewCtrl: ViewController,
    navParams: NavParams
  ) {
    this.comments = navParams.get('comments');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

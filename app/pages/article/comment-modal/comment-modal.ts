import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams, InfiniteScroll, Refresher } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { Comment, CommentStore } from '../../../providers/store';
import { Connectivity } from '../../../providers/ionic';
import { Config } from '../../../config';

@Component({
  templateUrl: './build/pages/article/comment-modal/comment-modal.html'
})
export class CommentModalPageComponent implements OnInit {
  connec$: Observable<boolean>;
  comments$: Observable<Comment[]>;
  title: string;

  constructor(
    private viewCtrl: ViewController,
    private connectivity: Connectivity,
    private commentStore: CommentStore,
    private navParams: NavParams,
    private config: Config
  ) {
    this.comments$ = this.commentStore.map(state => state.comments.get(this.navParams.get('article').id));
    this.title = this.navParams.get('comments').length > 0 ? 'Comments' : 'No Comments';
  }

  ngOnInit(): void {
    this.connec$ = this.connectivity
      .map(state => state.isOnline);
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

  loadMore(infiniteScroll: InfiniteScroll): void {
    this.commentStore
      .loadMore({ article: this.navParams.get('article') })
      .then(comments => {
        infiniteScroll.complete();
        if (comments.length < this.config.commentPerPage)
          infiniteScroll.enable(false);
      })
      .catch(() => infiniteScroll.complete());
  }

  doRefresh(refresher: Refresher): void {
    this.commentStore
      .refresh({
        article: this.navParams.get('article')
      })
      .then(() => refresher.complete())
      .catch(() => refresher.complete());
  }
}

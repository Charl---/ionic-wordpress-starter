import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { ArticleStore, Category, User } from '../../providers/store';

@Component({
  selector: 'wp-article-counter',
  templateUrl: 'build/components/article-counter/article-counter.html'
})
export class ArticleCounterComponent implements OnInit {
  counter: string;
  isLoading: boolean = true;
  @Input() category: Category;
  @Input() author: User;

  constructor(
    private articleStore: ArticleStore
  ) { }

  ngOnInit(): void {
    this.articleStore.count({
      filters: {
        category: this.category,
        author: this.author
      }
    })
      .then(count => {
        this.isLoading = false;
        this.counter = count;
      });
  }
}

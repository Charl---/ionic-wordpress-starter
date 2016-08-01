import { Component, Type, ViewChild, OnInit } from '@angular/core';
import { NavParams, Page, Tabs } from 'ionic-angular';

import { User, ArticleStore } from '../../providers/store';
import { BioPage } from './bio';
import { ArticlesPage } from './articles';
import { CommentsPage } from './comments';

@Component({
  templateUrl: 'build/pages/profile/profile.html',
})
export class ProfilePageComponent implements OnInit {
  user: User;
  articleTitle: string = 'article';
  tab1Root: Type = BioPage;
  tab2Root: Type = ArticlesPage;
  tab3Root: Type = CommentsPage;
  @ViewChild('profileTabs') tabRef: Tabs;

  constructor(
    navParams: NavParams,
    private articleStore: ArticleStore
  ) {
    this.user = navParams.get('user');
  }

  ngOnInit(): void {
    this.articleStore.count({
      filters: { author: this.user }
    })
      .then(counter => {
        this.articleTitle = `${counter} articles`;
      })
      .catch(err => console.error(err));
  }

}

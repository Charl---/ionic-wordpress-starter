import { Component, Type, ViewChild } from '@angular/core';
import { NavParams, Page, Tabs } from 'ionic-angular';

import { User } from '../../providers/store/user';
import { BioPage } from './bio';
import { ArticlesPage } from './articles';
import { CommentsPage } from './comments';

@Component({
  templateUrl: 'build/pages/profile/profile.html',
})
export class ProfilePageComponent {
  user: User;
  tab1Root: Type = BioPage;
  tab2Root: Type = ArticlesPage;
  tab3Root: Type = CommentsPage;
  @ViewChild('profileTabs') tabRef: Tabs;

  constructor(
    navParams: NavParams
  ) {
    this.user = navParams.get('user');
  }
}

import { Component } from '@angular/core';
import { NavController, Alert } from 'ionic-angular';
import { ArticleStore, CategoryStore, UserStore } from '../../providers/store';


@Component({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPageComponent {
  isLoading: boolean = false;
  constructor(
    private articleStore: ArticleStore,
    private categoryStore: CategoryStore,
    private userStore: UserStore,
    private nav: NavController
  ) { }

  resetLocalDb(): void {
    this.isLoading = true;
    Promise.all([
      this.userStore.destroyAll(),
      this.articleStore.destroyAll(),
      this.categoryStore.destroyAll()
    ])
      .then(() => {
        this.isLoading = false;
        this.categoryStore.load()
        this.nav.present(Alert.create({
          title: 'Success',
          subTitle: 'Your data has been wiped out!',
          buttons: ['OK']
        }))
      })
      .catch((err) => {
        this.isLoading = false
        this.nav.present(Alert.create({
          title: 'Error',
          subTitle: 'something wrong happen',
          buttons: ['OK']
        }))
      })
  }
}

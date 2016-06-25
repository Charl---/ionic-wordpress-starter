import {Component} from '@angular/core';
import {ViewController, NavController, Alert} from 'ionic-angular';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {ArticleSqlApi, CategorySqlApi, UserSqlApi} from '../../providers/store';


@Component({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {
  constructor(
    private viewCtrl: ViewController,
    private articleSqlApi: ArticleSqlApi,
    private categorySqlApi: CategorySqlApi,
    private userSqlApi: UserSqlApi,
    private nav: NavController
  ) {
    this.viewCtrl = viewCtrl;
  }

  close(): void {
    this.viewCtrl.dismiss();
  }

  resetLocalDb(): void {
    const subscription = forkJoin(
      this.userSqlApi.destroyAll(),
      this.articleSqlApi.destroyAll(),
      this.categorySqlApi.destroyAll()
    )
      .subscribe(
        () => {
          const myAlert = Alert.create({
            title: 'Success',
            subTitle: 'Your data has been wiped out!',
            buttons: ['OK']
          })
          this.nav.present(myAlert);
          subscription.unsubscribe();
        },(err) => console.log(err)
      )
  }
}

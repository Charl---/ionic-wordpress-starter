import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Network, Connection} from 'ionic-native';
import {Observable} from 'rxjs/Rx';
import {fromPromise} from 'rxjs/observable/fromPromise';
/*
  Generated class for the Connectivity provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Connectivity {
  isOnline$: Observable<boolean>;
  constructor(platform: Platform) {
    this.isOnline$ = fromPromise(platform.ready())
      .map(() => Network.connection !== Connection.NONE)
      .merge(
        Network.onConnect()
          .map(() => true),
        Network.onDisconnect()
          .map(() => false)
      )
  }
}

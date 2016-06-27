import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Network, Connection} from 'ionic-native';
import {BehaviorSubject, Observable, Subject} from 'rxjs/Rx';
import {Store, EventQueue} from 'sparix';

/*
  Generated class for the Connectivity provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

interface ConnectivityState {
  isOnline: boolean;
}

@Injectable()
export class Connectivity extends Store<ConnectivityState>{
  constructor(platform: Platform) {
    super(new EventQueue(), {
      isOnline: false
    })
    platform.ready().then(() => {
      this.update(state => ({
        isOnline: Network.connection !== Connection.NONE
      }))
      Network.onConnect()
        .subscribe(() => this.update(state => ({
          isOnline: true
        })))
      Network.onDisconnect().map(() => false)
        .subscribe(() => this.update(state => ({
          isOnline: false
        })))

        // Network.onConnect().map(() => true)
        //   .merge(Network.onDisconnect().map(() => false))


    })
  }
}

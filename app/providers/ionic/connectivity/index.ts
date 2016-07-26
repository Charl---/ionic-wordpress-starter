import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Network } from 'ionic-native';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { Store, EventQueue } from 'sparix';

interface ConnectivityState {
  isOnline: boolean;
}

const initialState: ConnectivityState = {
  isOnline: false
}

@Injectable()
export class Connectivity extends Store<ConnectivityState> {
  constructor(
    platform: Platform,
    eventQueue: EventQueue
  ) {
    super(eventQueue, initialState)
    platform.ready().then(() => {
      this.update(state => ({
        isOnline: Network.connection !== 'none'
      }))
      Network.onConnect()
        .subscribe(() => this.update(state => ({
          isOnline: true
        })))
      Network.onDisconnect().map(() => false)
        .subscribe(() => this.update(state => ({
          isOnline: false
        })))
    })
  }
}

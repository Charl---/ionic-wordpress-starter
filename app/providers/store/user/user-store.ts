import {Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Platform} from 'ionic-angular';
import {Store, EventQueue} from 'sparix';
import {UserSqlApi, UserState, User} from './index';

const initialState: UserState = {
  users: []
}

@Injectable()
export class UserStore extends Store<UserState> {
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlApi:UserSqlApi,
    private platform:Platform,
    eventQueue: EventQueue
  ) {
    super(eventQueue, initialState);
  }

  insert(user: User): Promise<User> {
    return this.platform.ready()
      .then(() => this.sqlApi.insert(user))
      .then(() => {
        const existingUser = this.currentState.users.find((item: User) => item.id === user.id);
        if(existingUser) {
          return existingUser;
        } else {
          this.update((state: UserState) => ({
              users: [...state.users, user]
            })
          )
          return user;
        }
      })
  }

  find(id: string): Promise<User> {
    const existingUser = this.currentState.users.find((user: User) => id === user.id);
    return existingUser ? Promise.resolve(existingUser) : this.sqlApi.findOne(id);
  }

  destroyAll(): Promise<void> {
    this.loading$.next(true);
    return this.sqlApi.destroyAll()
      .then((state) => this.update(state => initialState))
      .then(() => this.loading$.next(false))
  }
}

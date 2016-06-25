import {Injectable } from '@angular/core';
import {Platform} from 'ionic-angular';
import {Store, EventQueue} from 'sparix';
import {UserSqlApi, UserState, User} from './index';

@Injectable()
export class UserStore extends Store<UserState> {

  constructor(private sqlApi:UserSqlApi,
              private platform:Platform,
              eventQueue:EventQueue
  ) {
    super(eventQueue, {
      users: []
    });
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
    return existingUser ? Promise.resolve(existingUser) : this.sqlApi.find(id);
  }
}

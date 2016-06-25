import {OnInit} from '@angular/core'
import {Storage, SqlStorage, Platform} from 'ionic-angular';
export * from './api-common';

export class SqlApi implements OnInit{
  protected storage: Storage = new Storage(SqlStorage);
  
  constructor(protected platform: Platform,
              private createQuery: string) {}

  ngOnInit():void {
    this.platform.ready()
      .then(() => this.initTable(this.createQuery))
      .catch(err => console.error(err));
  }

  private initTable(createQuery: string) {
    return this.storage.query(createQuery)
  }
}

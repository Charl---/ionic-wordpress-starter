import { Storage, SqlStorage, Platform } from 'ionic-angular';
export * from './api-common';

export class SqlApi {
  protected storage: Storage = new Storage(SqlStorage);

  constructor(
    protected platform: Platform,
    private createQuery: string) {
    this.initTable(this.createQuery)
      .catch(err => console.error(err));
  }

  private initTable(createQuery: string): Promise<any> {
    return this.platform.ready()
      .then(() => this.storage.query(createQuery));
  }
}

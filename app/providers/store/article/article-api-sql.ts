import {Injectable} from '@angular/core';
import {SqlStorage, Platform} from 'ionic-angular';
import {fromPromise} from 'rxjs/observable/fromPromise'
import {Observable} from 'rxjs/Rx';


import {Article} from './index';
import {CategoryStore,Category} from '../category';
import {UserStore, User} from '../user';
import {SqlApi, ApiFindAllOptions, ApiCrudAdapter} from '../_api/api-sql';
import {Config} from '../../../config';
import {HtmlEscape} from '../../../utils';

@Injectable()
export class ArticleSqlApi extends SqlApi implements ApiCrudAdapter<Article>{
  constructor(platform: Platform,
              private categoryStore: CategoryStore,
              private userStore: UserStore,
              private config: Config
  ) {
    super(platform, 'CREATE TABLE IF NOT EXISTS article (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, picture TEXT, date TEXT, author INTEGER, category INTEGER, FOREIGN KEY(author) REFERENCES user(id), FOREIGN KEY(category) REFERENCES category(id))')
  }


  //todo refactor the end ...... jointures
  private formatData(data: any): Promise<any> {
    const categoryId = [];
    const usersId = [];
    const articles = [];
    for (let i = 0; i < data.res.rows.length; i++) {
      let item: Article = data.res.rows.item(i);
      articles.push([item.id, HtmlEscape.unescape(item.title), HtmlEscape.unescape(item.body), item.picture, item.date, item.author, item.category]);
      categoryId.push(item.category);
      usersId.push(item.author);
    }

    const userPromises = usersId
      .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
      .filter((value: string) => typeof value === 'number')
      .map((value: string) => this.userStore.find(value));

    const categoryPromises = categoryId
      .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
      .map((id: string) => this.categoryStore.getById(id));

    return Promise.all([
      Promise.resolve(articles),
      Promise.all(userPromises),
      Promise.all(categoryPromises)
    ])
  }

  private buildArticle(data: any): Article[] {
    return data[0].map((articleProp: any[]) => {
      let article = new Article(articleProp[0], articleProp[1], articleProp[2], articleProp[3], articleProp[4],null, null, this.config.defaultPicture);
      article.author = data[1].find((author: User) => {
        return articleProp[5] === author.id
      });
      article.category = data[2].find((category: Category) => {
        return articleProp[6] === category.id
      });
      return article;
    })
  }

  findAll(params: ApiFindAllOptions): Promise<Article[]> {
    const classicQuery = `SELECT * FROM article WHERE category = ${params.filters.category.id} ORDER BY date DESC`;
    let query = `SELECT * FROM article WHERE category = ${params.filters.category.id} ORDER BY date DESC`
    if (params.page) {
      const articleParPage = this.config.articlePerPage;
      query += ` LIMIT ${articleParPage} OFFSET ${articleParPage * (params.page -1)}`;
    }
    return this.storage.query(query)
      .then(data => this.formatData(data))
      .then(data => this.buildArticle(data))
      .catch((err => console.log('sql findAll article', err)))
  }

  destroyAll(): Promise<void> {
    return this.storage.query('delete from article');
  }

  insert(article: Article): Promise<Article> {
    return this.storage.query(`INSERT OR REPLACE INTO article (id, title, body, picture, date, author, category) VALUES ('${article.id}', '${HtmlEscape.escape(article.title)}', '${HtmlEscape.escape(article.body)}', '${article.picture}', '${article.date}', '${article.author.id}', '${article.category.id}')`)
      .then(() => article)
      .catch(err => console.error(err));
  }

  insertAll(articles: Article[]): Promise<Article[]>{
    return Promise.all(articles.map(article => this.insert(article)))
      .then(() => articles)
      .catch(err => console.error(err));
  }

  search(params: ApiFindAllOptions): Promise<Article[]> {
    const query = `SELECT * FROM article WHERE title LIKE '%${params.search}%' AND body LIKE '%${params.search}%' ORDER BY date DESC`;

    return this.storage.query(query)
      .then(data => this.formatData(data))
      .then(data => this.buildArticle(data))
      .catch(err => console.error(err));
  }
}

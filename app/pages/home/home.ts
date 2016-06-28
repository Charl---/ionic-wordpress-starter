import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {Config} from '../../config';
import {ArticleStore, Article, CategoryStore, Category} from '../../providers/store'
import {ArticlePage} from '../article/article';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage implements OnInit{
  private category: Category;
  articles$: Observable<Article[]>;

  constructor(
    private config: Config,
    private articleStore: ArticleStore,
    private categoryStore: CategoryStore,
    private nav: NavController,
    private navParams: NavParams
  ) {}

  ngOnInit(): void {
    this.categoryStore
      .filter(state => !!state.categories.length)
      .map(state => state.categories.find(cat => cat.name === this.config.homeCategory))
      .do(category => this.category = category)
      .toPromise()
      .then(category => this.articleStore.load(category))
      .catch(err => console.error(err))

    this.articles$ = this.articleStore.state$
      .filter(() => !!this.category)
      .map(state => state.articles.get(this.category))
  }

  goToArticlePage(article: Article): void {
    this.nav.push(ArticlePage, {
      article
    });
  }
}

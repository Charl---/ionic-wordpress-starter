import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, Platform, Slides} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {Config} from '../../config';
import {ArticleStore, Article, CategoryStore, Category} from '../../providers/store'
import {ArticlePage} from '../article/article';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage implements OnInit{
  @ViewChild('homeSlider') slider: Slides;
  private category: Category;
  articles$: Observable<Article[]>;

  constructor(
    private config: Config,
    private articleStore: ArticleStore,
    private categoryStore: CategoryStore,
    private nav: NavController,
    private navParams: NavParams,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    this.articles$ = Observable.fromPromise(this.platform.ready())
      .mergeMap(() => this.categoryStore.state$)
      .filter(state => !!state.categories.length)
      .map(state => state.categories.find(cat => cat.name === this.config.homeCategory))
      .do(category => this.category = category)
      .mergeMap(category => Observable.fromPromise(this.articleStore.load(category)))
      .map(articles => articles.slice(0, this.config.homeArticleLength -1))
  }

  goToArticlePage(): void {
    const index = this.slider.getActiveIndex();
    const article = this.articleStore.currentState.articles.get(this.category)[index];
    this.nav.push(ArticlePage, {
      article
    });
  }
}

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
    this.articles$ = this.articleStore.state$
      .filter(() => this.categoryStore.currentState.categories.length > 0)
      .do(() => this.category = this.categoryStore.currentState.categories.find(cat => cat.name === this.config.homeCategory))
      .do(state => console.log(state))
      .map(state => state.articles.get(this.category.name))
      // .filter(articles => !!articles)
  }

  goToArticlePage(): void {
    const index = this.slider.getActiveIndex();
    const article = this.articleStore.currentState.articles.get(this.category.name)[index];
    this.nav.push(ArticlePage, {
      article
    });
  }
}

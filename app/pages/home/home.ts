import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, Slides } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { Config } from '../../config';
import { ArticleStore, Article, CategoryStore, Category } from '../../providers/store'
import { ArticlePageComponent } from '../article/article';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePageComponent implements OnInit, OnDestroy {
  @ViewChild('homeSlider') slider: Slides;
  private category: Category;
  private categorySub: Subscription;
  articles$: Observable<Article[]>;
  article: Article;

  constructor(
    private config: Config,
    private articleStore: ArticleStore,
    private categoryStore: CategoryStore,
    private nav: NavController,
    private navParams: NavParams,
    private platform: Platform
  ) { }

  ngOnInit(): void {
    this.articles$ = this.articleStore.state$
      .filter(() => this.categoryStore.currentState.categories.length > 0)
      .do(() => this.category = this.categoryStore.currentState.categories
        .find(cat => cat.name === this.config.homeCategory)
      )
      .filter(state => !!state.articles.get(this.category.name))
      .map(state => state.articles.get(this.category.name).slice(0, 9))
      .do((articles) => this.article = articles[0])

    // this.categorySub = this.categoryStore
    //   .filter(state => state.categories.length > 0)
    //   .map(() => this.categoryStore.currentState.categories
    //     .find(cat => cat.name === this.config.homeCategory)
    //   )
    //   .subscribe(category => this.articleStore.load(category));
  }

  ngOnDestroy(): void {
    // this.categorySub.unsubscribe();
  }

  onSlideChanged(): void {
    this.article = this.articleStore.currentState.articles
      .get(this.config.homeCategory)[this.slider.getActiveIndex()];
  }

  goToArticlePage(): void {
    const index = this.slider.getActiveIndex();
    const article = this.articleStore.currentState.articles
      .get(this.category.name)[index];

    this.nav.push(ArticlePageComponent, {
      article
    });
  }
}

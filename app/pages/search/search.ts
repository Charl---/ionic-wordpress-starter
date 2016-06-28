import {Component, OnDestroy, OnInit} from '@angular/core';
import {ControlGroup, FormBuilder} from '@angular/common';
import {Loading, NavController, ViewController, Toast} from 'ionic-angular';
import {Observable, Subscription} from 'rxjs/Rx';
import {ArticleStore, Article, ArticleState} from '../../providers/store';
import {ArticlePage} from '../article/article';

@Component({
  templateUrl: 'build/pages/search/search.html'
})
export class SearchPage implements OnInit, OnDestroy{
  searchForm: ControlGroup;
  articles: Article[] = [];
  searchSub: Subscription;

  constructor(public articleStore: ArticleStore,
              private builder: FormBuilder,
              private nav: NavController,
              private viewCtrl: ViewController)
  {
    this.searchForm = builder.group({
      search: ['']
    });
  }

  private noResultsToast(): void {
    const toast = Toast.create({
      message: 'No results',
      duration: 3000
    });
    this.nav.present(toast);
  }

  ngOnInit(): void {
    this.searchSub = this.searchForm.valueChanges
      .debounceTime(700)
      .filter((form) => form.search.length > 2)
      .do(() => this.articles = null)
      .mergeMap((form: any) => this.articleStore.search(form))
      .do(articles => articles.length === 0 ? this.noResultsToast() : null)
      .subscribe(
        articles => this.articles = articles,
        err => console.error('search error ', err)
      )
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }

  goToArticlePage(article: Article): void {
    this.nav.push(ArticlePage, {
      article
    });
  }
}

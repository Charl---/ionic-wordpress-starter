import {Component} from '@angular/core';
import {Loading, NavController, ViewController} from 'ionic-angular';
import {FORM_DIRECTIVES, FORM_PROVIDERS} from '@angular/common';
import {Observable} from 'rxjs/Rx';
import {Control, ControlGroup, FormBuilder} from '@angular/common';
import {ArticleStore, Article, ArticleState} from '../../providers/store';
import {ArticlePage} from '../article/article';

@Component({
  templateUrl: 'build/pages/search/search.html',
  directives: [
    FORM_DIRECTIVES
  ],
  providers: [
    FORM_PROVIDERS
  ]
})
export class SearchPage {
  searchForm: ControlGroup;
  articles$: Observable<Article[]>;

  constructor(public articleStore: ArticleStore,
              private builder: FormBuilder,
              private nav: NavController,
              private viewCtrl: ViewController)
  {
    this.searchForm = builder.group({
      query: new Control('')
    });

    this.articles$ = this.searchForm.valueChanges
      .debounceTime(1000)
      .mergeMap((form: any) => this.articleStore.search(form.query))
  }

  onPageWillEnter() {

  }

  goToArticlePage(article: Article): void {
    this.nav.push(ArticlePage, {
      article
    });
  }
}

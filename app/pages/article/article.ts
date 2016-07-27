import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { Article, CommentStore, Comment } from '../../providers/store'
import { ArticleWidgetFooterOptions } from '../../providers/directives/article-widget-footer';

@Component({
  templateUrl: 'build/pages/article/article.html',
})
export class ArticlePageComponent implements OnInit, OnDestroy {
  article: Article;
  links: NodeList;
  footerOptions: ArticleWidgetFooterOptions;

  constructor(
    private commentStore: CommentStore,
    private ref: ElementRef,
    navParams: NavParams
  ) {

    this.article = navParams.get('article');

    this.footerOptions = {
      social: true,
      comments: true,
      article: this.article
    }
  }

  private clickLinkHandler(e): void {
    e.preventDefault();
    console.log(e.target);
    InAppBrowser.open(e.target.getAttribute('href'));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.links = this.ref.nativeElement.querySelectorAll('a');
      for (let i = 0; i < this.links.length; i++) {
        this.links.item(i).addEventListener('click', this.clickLinkHandler)
      }
    })
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.links.length; i++) {
      this.links.item(i).removeEventListener('click', this.clickLinkHandler)
    }
  }
}

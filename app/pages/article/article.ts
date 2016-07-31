import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { NavParams, NavController, Popover, Modal } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { Article, CommentStore, Comment } from '../../providers/store';
import { ArticleWidgetFooterOptions } from '../../components/article-widget-footer';
import { ArticlePopOverComponent } from './article-pop-over';
import { CommentModalPageComponent } from './comment-modal';

@Component({
  templateUrl: 'build/pages/article/article.html'
})
export class ArticlePageComponent implements OnInit, OnDestroy {
  article: Article;
  links: NodeList;
  footerOptions: ArticleWidgetFooterOptions;
  @ViewChild('articleText', { read: ElementRef }) text: ElementRef;

  constructor(
    private commentStore: CommentStore,
    private ref: ElementRef,
    private nav: NavController,
    navParams: NavParams
  ) {

    this.article = navParams.get('article');

    this.footerOptions = {
      social: true,
      comments: true,
      date: true,
      article: this.article
    };
  }

  private clickLinkHandler(e): void {
    e.preventDefault();
    InAppBrowser.open(e.target.getAttribute('href'));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.links = this.ref.nativeElement.querySelectorAll('a');
      for (let i = 0; i < this.links.length; i++) {
        this.links.item(i).addEventListener('click', this.clickLinkHandler);
      }
    });
  }

  // todo check if necessary
  ngOnDestroy(): void {
    for (let i = 0; i < this.links.length; i++) {
      this.links.item(i).removeEventListener('click', this.clickLinkHandler);
    }
  }

  goBack(): void {
    this.nav.pop();
  }

  more(ev): void {
    const popover = Popover.create(ArticlePopOverComponent, {
      textEle: this.text.nativeElement
    });

    this.nav.present(popover, { ev });
  }

  commentsModal(comments: Comment[]): void {
    const modal = Modal.create(CommentModalPageComponent, { comments });
    this.nav.present(modal);
  }
}

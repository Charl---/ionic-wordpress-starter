import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/article/article-pop-over/article-pop-over.html',
})
export class ArticlePopOverComponent implements OnInit {
  background: string;
  textEle: HTMLElement;
  fontSize: number = 15;
  colors: string[] = [
    'white',
    'tan',
    'grey',
    'black'
  ];

  constructor(private navParams: NavParams) { }

  ngOnInit(): void {
    if (this.navParams.data) {
      this.textEle = this.navParams.data.textEle;
    }
  }

  changeBackground(color): void {
    this.background = color;
    this.colors.forEach(color => this.textEle.classList.remove(`article-${color}`));
    this.textEle.classList.add(`article-${color}`);
  }

  changeFontSize(increase: boolean): void {
    for (let i = 15; i < 31; i++) {
      this.textEle.classList.remove(`article-font-${i}`);
    }

    increase
      ? this.fontSize = this.fontSize + 1
      : this.fontSize = this.fontSize - 1;

    this.textEle.classList.add(`article-font-${this.fontSize}`);
  }
}

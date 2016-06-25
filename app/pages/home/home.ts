import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SearchPage} from '../search/search';


@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  Search: any;
  constructor(private nav: NavController) {
    this.Search = SearchPage;
  }
}

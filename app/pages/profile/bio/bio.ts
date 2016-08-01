import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/profile/bio/bio.html',
})
export class BioPage {
  bio: string;

  constructor(navParams: NavParams) {
    this.bio = navParams.data.description;
  }
}

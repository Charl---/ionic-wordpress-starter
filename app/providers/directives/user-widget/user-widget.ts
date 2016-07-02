import {Component, Input, OnInit, ElementRef} from '@angular/core';
import {User} from '../../store';

export interface UserWidgetOptions {
  fontSize?: string;
  color?: string;
}

@Component({
  selector: 'user-widget',
  templateUrl: 'build/providers/directives/user-widget/user-widget.html'
})
export class UserWidget implements OnInit {
  @Input() user: User;
  @Input() options: UserWidgetOptions;

  constructor(
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.options = this.options ? this.options : {};
    const name = this.elementRef.nativeElement.querySelector('.input-wrapper');

    if(this.options.fontSize)
      name.style.fontSize = this.options.fontSize;

    if(this.options.color)
      name.style.color = this.options.color;
  }
}

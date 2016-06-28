import {Component, Input, OnInit, ElementRef} from '@angular/core';
import {User} from '../../store';

export interface UserWidgetOptions {
  avatarWidth?: number;
  avatarHeight?: number;
  fontSize?: string;
  color?: string;
  align?: string;
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
    const meta = this.elementRef.nativeElement.querySelector('.user-widget__meta')
    const avatar = this.elementRef.nativeElement.querySelector('.user-widget__avatar');

    if(this.options.avatarWidth)
      avatar.style.width = `${this.options.avatarWidth}px`;

    if(this.options.avatarHeight)
      avatar.style.height = `${this.options.avatarHeight}px`;

    if(this.options.fontSize)
      meta.style.fontSize = this.options.fontSize;

    if(this.options.color)
      meta.style.color = this.options.color;
  }
}

import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { User } from '../../providers/store';

export interface UserWidgetOptions {
  fontSize?: string;
  color?: string;
}

@Component({
  selector: 'wp-user-widget',
  templateUrl: 'build/components/user-widget/user-widget.html'
})
export class UserWidgetComponent implements OnInit {
  @Input() user: User;
  @Input() options: UserWidgetOptions;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.options = this.options ? this.options : {};
    const name = this.elementRef.nativeElement.querySelector('.input-wrapper');

    if (this.options.fontSize)
      name.style.fontSize = this.options.fontSize;

    if (this.options.color)
      name.style.color = this.options.color;
  }
}

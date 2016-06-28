import {Component, Input, Output} from '@angular/core';
import {User} from '../../store';

@Component({
  selector: 'user-widget',
  templateUrl: 'build/providers/directives/user-widget/user-widget.html'
})
export class UserWidget {
  @Input() user: User;
}

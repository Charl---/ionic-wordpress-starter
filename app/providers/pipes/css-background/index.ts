import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cssbackground'
})
export class CssBackground implements PipeTransform{
  transform(picture: string): string {
    return `url(${picture})`;
  }
}

import {Pipe, PipeTransform} from '@angular/core';
import * as Autolinker from 'autolinker';

@Pipe({
  name: 'linky'
})
export class Linky implements PipeTransform {
  transform(html: string): string {
    return Autolinker.link(html, {
      replaceFn(autolinker, match) {
        const tag = match.buildTag();
        tag.setAttr('target', '_system');
        return tag;
      }
    });
  }
}

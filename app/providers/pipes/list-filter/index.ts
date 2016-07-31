import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../../store';

@Pipe({
  name: 'listfilter'
})
export class ListFilter implements PipeTransform {
  transform(articles: Article[], query: string): Article[] {
    return articles.filter(article => article.body.indexOf(query) > -1 || article.title.indexOf(query.toUpperCase()) > -1);
  }
}

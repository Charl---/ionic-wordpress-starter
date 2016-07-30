import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../../store';

@Pipe({
  name: 'listfilter'
})
export class ListFilter implements PipeTransform {
  transform(articles: Article[], query: string): Article[] {
    console.log(query);
    console.log('body ', articles[0].body.indexOf(query) > -1);
    console.log('title ', articles[0].title.indexOf(query) > -1);

    return articles.filter(article => article.body.indexOf(query) > -1 || article.title.indexOf(query.toUpperCase()) > -1);
  }
}

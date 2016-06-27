import {Category} from '../category';
import {User} from '../user';

export class Article {
  constructor(public id:string,
              public title: string,
              public body: string,
              public picture: string,
              public date: string,
              public author?: User,
              public category?: Category,
              defaultPicture?: string
  ) {
    if (!picture) {
      try {
        const pictureElement = document.createRange()
          .createContextualFragment(body)
          .querySelector('img');
        this.picture = pictureElement ? pictureElement.getAttribute('src') : defaultPicture;
      } catch(err) {
        this.picture = '';
        console.error('Article error picture', err.message);
      }
    }
  }
}

export interface ArticleState {
  currentCategory: Category;
  currentPage: number;
  mostRecentDate: string;
  articles: Map<Category, Article[]>;
}

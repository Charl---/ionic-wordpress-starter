import {Category} from '../category';
import {User} from '../user';

export class Article {
  constructor(
    public id:string,
    public title: string,
    public body: string,
    public preview: string,
    public picture: string,
    public date: Date,
    public author?: User,
    public category?: Category,
    defaultPicture?: string
  ) {
    if (!picture) {
      try {
        const bodyFragment = document.createRange()
          .createContextualFragment(body);
        const pictureElement = bodyFragment.querySelector('img');

        const previewElement = document.createRange()
          .createContextualFragment(preview);

        const previewPicture = previewElement.querySelector('img');
        if (previewPicture) {
          previewElement.querySelector('img').remove();
          this.preview = previewElement.textContent;
        }



        if (pictureElement) {
          pictureElement.remove();
          this.body = bodyFragment.textContent;
        }
        this.picture = pictureElement ? pictureElement.getAttribute('src') : defaultPicture;
      } catch(err) {
        console.error(err);
        this.picture = '';
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

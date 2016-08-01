import { Category } from '../category';
import { User } from '../user';

export class Article {
  constructor(
    public id: string,
    public title: string,
    public body: string,
    public preview: string,
    public picture: string,
    public date: Date,
    public author?: User,
    public category?: Category,
    defaultPicture?: string
  ) {
    const previewFragment = document.createRange()
      .createContextualFragment(preview);
    let temp = document.createElement('div');
    temp.appendChild(previewFragment);

    const previewImg = temp.querySelector('img');
    if (previewImg) {
      previewImg.remove();
    }

    this.preview = temp.innerHTML;

    if (!picture) {
      try {
        const bodyFragment = document.createRange()
          .createContextualFragment(body);
        const pictureElement = bodyFragment.querySelector('img');

        this.picture = pictureElement ? pictureElement.getAttribute('src') : defaultPicture;

        temp = document.createElement('div');
        temp.appendChild(bodyFragment);

        if (pictureElement) {
          pictureElement.remove();
        }

        this.body = temp.innerHTML;

      } catch (err) {
        console.error(err);
        this.picture = defaultPicture;
      }
    }
  }
}

export interface ArticleState {
  currentAuthor: User;
  currentCategory: Category;
  currentPage: number;
  mostRecentDate: string;
  articles: Map<string, Article[]>;
}

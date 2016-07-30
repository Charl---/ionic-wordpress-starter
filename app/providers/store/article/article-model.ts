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
    const previewElement = document.createRange()
      .createContextualFragment(preview);
    const toto = document.createElement('div');
    toto.appendChild(previewElement);

    const previewImg = toto.querySelector('img');
    if (previewImg) {
      previewImg.remove();
    }

    this.preview = toto.innerHTML;

    if (!picture) {
      try {
        const bodyFragment = document.createRange()
          .createContextualFragment(body);
        const pictureElement = bodyFragment.querySelector('img');

        this.picture = pictureElement ? pictureElement.getAttribute('src') : defaultPicture;

        if (pictureElement) {
          pictureElement.remove();
        }

        const temp = document.createElement('div');
        temp.appendChild(bodyFragment)
        this.body = temp.innerHTML;

      } catch (err) {
        console.error(err);
        this.picture = defaultPicture;
      }
    }
  }
}

export interface ArticleState {
  currentCategory: Category;
  currentPage: number;
  mostRecentDate: string;
  articles: Map<string, Article[]>;
}

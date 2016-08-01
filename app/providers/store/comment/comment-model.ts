import { Article } from '../article';
import { User } from '../user';

export class Comment {
  constructor(
    public id: string,
    public postId: string,
    public content: string,
    public authorName: string,
    public authorUrl: string,
    public authorAvatar: string,
    public date: Date
  ) {
    this.authorAvatar = authorAvatar ? authorAvatar : 'img/avatar.png';
  }
}

export interface CommentState {
  currentAuthor: User;
  currentArticle: Article;
  currentPage: number;
  mostRecentDate: string;
  comments: Map<string, Comment[]>;
}

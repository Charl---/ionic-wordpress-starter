import { Article } from '../article';

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
  comments: Map<string, Comment[]>
}

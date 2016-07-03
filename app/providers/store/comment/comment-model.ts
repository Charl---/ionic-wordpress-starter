import {Article} from '../article';

export class Comment {
  constructor(
    public id: string,
    public postId: string,
    public content: string,
    public authorName: string,
    public authorUrl: string,
    public date: Date
  ) {}
}

export interface CommentState {
  comments:  Map<Article, Comment[]>
}

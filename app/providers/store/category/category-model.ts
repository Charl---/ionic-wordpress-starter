export class Category {
  constructor(public id: string,
              public title: string,
              public description: string,
              public slug: string) {}
}

export interface CategoryState {
  categories: Category[];
}
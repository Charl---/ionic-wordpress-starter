export class Category {
  constructor(public id: string,
              public name: string,
              public description: string,
              public slug: string) {}
}

export interface CategoryState {
  categories: Category[];
}

export class User {
  constructor(
    public id: string,
    public name: string,
    public avatar: string,
    public description: string,
    public slug: string
  )
  {
      this.avatar = avatar ? avatar : 'img/avatar.png'
  }
}


export interface UserState {
  users: User[];
}

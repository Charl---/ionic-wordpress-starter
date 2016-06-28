export class Config {
  baseUrl: string;
  articlePerPage: number;
  homeCategory: string;
  defaultPicture: string;
}

export const CONFIG_API_URL = '';

export const APP_CONFIG: Config = {
  baseUrl: 'http://touriscopie.fr/wp-json/wp/v2/',
  articlePerPage: 10,
  defaultPicture: 'http://touriscopie.fr/wp-content/uploads/2015/05/cropped-parasol.jpg',
  homeCategory: 'Editorial'
}

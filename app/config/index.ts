export interface SliderConfig {
    autoplay?: number;
    loop?: boolean;
    direction?: string;
    initialSlide?: number;
    pager?: boolean;
    speed?: number;
}

export interface SocialConfig {
  message?: string;
  subject?: string;
}

export class Config {
  baseUrl: string;
  articlePerPage: number;
  homeCategory: string;
  homeTitle: string;
  homeArticleLength: number;
  defaultPicture: string;
  sliderConfig: SliderConfig;
  social: SocialConfig;
}

export const CONFIG_API_URL = '';

export const APP_CONFIG: Config = {
  baseUrl: 'http://touriscopie.fr/wp-json/wp/v2/',
  articlePerPage: 10,
  defaultPicture: 'http://touriscopie.fr/wp-content/uploads/2015/05/cropped-parasol.jpg',
  homeTitle: 'Touriscopie Mag',
  homeCategory: 'Editorial',
  homeArticleLength: 10,
  sliderConfig: {
    loop: false
  },
  social: {
    message: 'Regarde ca !',
    subject: 'Touriscopie'
  }
}

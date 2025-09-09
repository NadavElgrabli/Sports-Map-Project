import { Location } from './location.interface';


//TODO: Seperate to 2 files
export interface Media {
  url: string;
  type: 'image' | 'video';
}

export interface TrailPoint {
  location: Location;
  media: Media[];
  timestamp: string;
}

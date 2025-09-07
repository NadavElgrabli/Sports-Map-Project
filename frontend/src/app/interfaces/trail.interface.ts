import { Location } from './location.interface';

export interface Media {
  url: string;
  type: 'image' | 'video';
}

export interface TrailPoint {
  location: Location;
  media: Media[];
  timestamp: string;
}

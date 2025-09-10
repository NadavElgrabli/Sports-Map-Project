import { Location } from './location.interface';
import { Media } from './media.interface';

export interface TrailPoint {
  location: Location;
  media: Media[];
  timestamp: string;
}

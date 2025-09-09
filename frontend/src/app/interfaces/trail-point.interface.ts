import { Location } from './location.interface';
import { Media } from './media.interface';

//TODO(DONE): Seperate to 2 files
export interface TrailPoint {
  location: Location;
  media: Media[];
  timestamp: string;
}

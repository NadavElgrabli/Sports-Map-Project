import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  viewedUserId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.viewedUserId = id ? +id : null;
      // now you can call your API to fetch friends/locations for viewedUserId
      // e.g. this.loadFriendsForUser(this.viewedUserId);
    });
  }
}

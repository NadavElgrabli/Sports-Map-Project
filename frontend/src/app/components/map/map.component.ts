import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  viewedUserId: number | null = null;

  constructor(private activeRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.viewedUserId = id ? +id : null;
    });
  }

  goToUserRoute() {
    if (this.viewedUserId) {
      //TODO: inside navigate you can use ',' to seperate the url words
      this.router.navigate([`/map/${this.viewedUserId}/trail`]);
    }
  }
}

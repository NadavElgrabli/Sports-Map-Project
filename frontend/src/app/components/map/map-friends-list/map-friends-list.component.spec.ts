import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFriendsListComponent } from './map-friends-list.component';

describe('MapFriendsListComponent', () => {
  let component: MapFriendsListComponent;
  let fixture: ComponentFixture<MapFriendsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapFriendsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapFriendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

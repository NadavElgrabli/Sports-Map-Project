import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapNotificationsComponent } from './map-notifications.component';

describe('MapNotificationsComponent', () => {
  let component: MapNotificationsComponent;
  let fixture: ComponentFixture<MapNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapNotificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

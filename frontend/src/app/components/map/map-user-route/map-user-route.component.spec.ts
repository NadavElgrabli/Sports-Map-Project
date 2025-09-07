import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapUserRouteComponent } from './map-user-route.component';

describe('MapUserRouteComponent', () => {
  let component: MapUserRouteComponent;
  let fixture: ComponentFixture<MapUserRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapUserRouteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapUserRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

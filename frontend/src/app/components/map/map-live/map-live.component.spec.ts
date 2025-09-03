import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLiveComponent } from './map-live.component';

describe('MapLiveComponent', () => {
  let component: MapLiveComponent;
  let fixture: ComponentFixture<MapLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapLiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

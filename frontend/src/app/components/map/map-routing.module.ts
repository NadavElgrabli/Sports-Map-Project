// map-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map.component';
import { MapUserRouteComponent } from './map-user-route/map-user-route.component';
import { MapGuard } from '../../guards/map-guard';

const routes: Routes = [
  { path: ':id', component: MapComponent, canActivate: [MapGuard] },
  {
    path: ':id/trail',
    component: MapUserRouteComponent,
    canActivate: [MapGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}

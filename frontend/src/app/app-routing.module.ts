import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { MapComponent } from './components/map/map.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MapGuard } from './guards/map-guard';
import { MapUserRouteComponent } from './components/map/map-user-route/map-user-route.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'signup', component: SignupFormComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'map/:id', component: MapComponent, canActivate: [MapGuard] },
  {
    path: 'map/:id/trail',
    component: MapUserRouteComponent,
    canActivate: [MapGuard],
  },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

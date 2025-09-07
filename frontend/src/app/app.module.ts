import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { MapComponent } from './components/map/map.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { MapFriendsListComponent } from './components/map/map-friends-list/map-friends-list.component';
import { MapNotificationsComponent } from './components/map/map-notifications/map-notifications.component';
import { MapLiveComponent } from './components/map/map-live/map-live.component';
import { CloseUsersDirective } from './directives/close-users-highlight.directive';
import { MapService } from './services/map.service';
import { MapUserRouteComponent } from './components/map/map-user-route/map-user-route.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    LoginFormComponent,
    SignupFormComponent,
    MapComponent,
    PageNotFoundComponent,
    LoadingSpinnerComponent,
    MapFriendsListComponent,
    MapNotificationsComponent,
    MapLiveComponent,
    MapUserRouteComponent,
    CloseUsersDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, MapService],
  bootstrap: [AppComponent],
})
export class AppModule {}

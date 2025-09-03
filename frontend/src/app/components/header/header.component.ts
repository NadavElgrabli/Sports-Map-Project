import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isAuthenticated = false;
  username: string | null = null;
  userId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;
      if (user) {
        this.username = user.username;
        this.userId = user ? user.id : null;
      } else {
        this.username = null;
      }
    });
  }

  _onLogout() {
    this.authService.logout();
  }
}

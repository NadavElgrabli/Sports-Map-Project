import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @ViewChild('loginForm', { static: false }) loginForm!: NgForm;
  isLoading = false;
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    console.log(form);

    const username = form.value.userName;
    const password = form.value.password;

    this.isLoading = true;

    this.authService.login(username, password).subscribe(
      (res) => {
        console.log('Login response:', res);
        this.isLoading = false;
        this.router.navigate(['/map', res.user.id]);
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
        this.loginError = err.error || 'Login failed';
      }
    );
  }
}

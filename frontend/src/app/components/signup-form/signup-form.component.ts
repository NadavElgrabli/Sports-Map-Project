import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent {
  signupForm!: FormGroup;
  addresses: string[] = ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beer Sheva'];
  evenMonth = false;
  usernameAvailable = true;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null, [
        Validators.required,
        this.evenMonthValidator,
      ]),
      weight: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
    });
  }

  evenMonthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const date = new Date(control.value);
    const month = date.getMonth() + 1;
    if (month % 2 === 0) {
      return { evenMonth: true };
    }
    return null;
  }

  _onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }

    const username = this.signupForm.value.username;
    const password = this.signupForm.value.password;
    const dateOfBirth = this.signupForm.value.dateOfBirth;
    const weight = this.signupForm.value.weight;
    const address = this.signupForm.value.address;

    this.isLoading = true;

    this.authService
      .signup(username, password, dateOfBirth, weight, address)
      .subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['home']);
        },
        (error) => {
          this.isLoading = false;
          this.usernameAvailable = false;
          console.log(error);
        }
      );
  }
}

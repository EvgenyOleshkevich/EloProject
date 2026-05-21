import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../services/userService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private userService = inject(UserService);
  private router = inject(Router);
  email = signal<string>('');
  password = signal<string>('');
  emailMessage = signal<string | null>(null);
  passwordMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  isEmailEmpty = computed(() => this.email() === '');
  isPassworfEmpty = computed(() => this.password() === '');
  isFormInvalid = computed(() => this.isEmailEmpty() || this.isPassworfEmpty());

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/games']);
    }
  }

  onSubmit() {
    if (this.email() === '') {
      console.error('login is empty');
      return;
    }
    if (this.password() === '') {
      console.error('password is empty');
      return;
    }
      console.error('p22222');

    this.userService.login(this.email(), this.password()).subscribe({
      next: (authPayload) => {
        console.log(authPayload)
        if (!authPayload) {
          this.errorMessage.set('Invalid email or password');
          return;
        }

        this.router.navigate(['/games']);
      },
    });
  }

}

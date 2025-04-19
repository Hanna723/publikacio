import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthContainerComponent } from '../auth-container/auth-container.component';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    AuthContainerComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() loginEvent = new EventEmitter();
  hide = true;

  constructor(private authService: AuthService, private router: Router) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    this.authService
      .login(
        this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value
      )
      .subscribe({
        next: (user) => {
          this.loginEvent.emit();
          this.router.navigateByUrl('/articles');
        },
        error: (error) => {
          if (error.status == 400) {
            this.loginForm.controls['password'].setErrors({ wrong: true });
          } else {
            this.loginForm.setErrors({ unknown: true });
          }
        },
      });
  }
}

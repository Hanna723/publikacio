
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthContainerComponent } from '../auth-container/auth-container.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    AuthContainerComponent,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink
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
    if (this.loginForm.invalid) {
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
          this.router.navigateByUrl('/article/list');
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

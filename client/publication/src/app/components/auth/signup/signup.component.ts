
import { Component, OnInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

import { AuthContainerComponent } from '../auth-container/auth-container.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Role } from 'src/app/shared/models/Role';
import { RoleService } from 'src/app/shared/services/role.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-signup',
  imports: [
    AuthContainerComponent,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  hide = true;
  roles: Role[] = [];

  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {}

  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.roleService.getAll().subscribe((roles) => {
      this.roles = roles;
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    const user: User = {
      email: this.signupForm.controls['email'].value,
      password: this.signupForm.controls['password'].value,
      firstName: this.signupForm.controls['firstName'].value,
      lastName: this.signupForm.controls['lastName'].value,
      role: this.signupForm.controls['role'].value,
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.router.navigateByUrl('auth/login');
      },
      error: (error) => {
        if (error.status == 400) {
          this.signupForm.controls['email'].setErrors({ used: true });
        } else {
          this.signupForm.setErrors({ unknown: true });
        }
      },
    });
  }
}

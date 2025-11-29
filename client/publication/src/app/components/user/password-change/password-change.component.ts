
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from 'src/app/shared/services/user.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-password-change',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss',
})
export class PasswordChangeComponent {
  readonly dialog = inject(MatDialog);
  hide = true;
  hide2 = true;

  passwordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(private userService: UserService) {}

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const oldPassword = this.passwordForm.controls['oldPassword'].value;
    const newPassword = this.passwordForm.controls['newPassword'].value;

    this.userService.updatePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.dialog.open(DialogComponent, {
          width: '250px',
          data: {
            title: 'Password updated!',
            submitButton: 'OK',
          },
        });
      },
      error: (error) => {
        if (error.status == 400) {
          this.passwordForm.controls['oldPassword'].setErrors({ wrong: true });
        } else {
          this.passwordForm.setErrors({ unknown: true });
        }
      },
    });
  }
}

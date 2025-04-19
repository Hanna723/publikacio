import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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

import { UserService } from 'src/app/shared/services/user.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-name-change',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './name-change.component.html',
  styleUrl: './name-change.component.scss',
})
export class NameChangeComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  nameForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.nameForm.controls['firstName'].setValue(user.firstName);
      this.nameForm.controls['lastName'].setValue(user.lastName);
    });
  }

  onSubmit(): void {
    if (this.nameForm.invalid) {
      return;
    }

    const firstName = this.nameForm.controls['firstName'].value;
    const lastName = this.nameForm.controls['lastName'].value;

    this.userService.updateUserName(firstName, lastName).subscribe({
      next: () => {
        this.dialog.open(DialogComponent, {
          width: '250px',
          data: {
            title: 'Name updated!',
            submitButton: 'OK',
          },
        });
      },
      error: () => {
        this.nameForm.setErrors({ unknown: true });
      },
    });
  }
}

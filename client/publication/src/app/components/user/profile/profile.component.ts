import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { NameChangeComponent } from '../name-change/name-change.component';
import { PasswordChangeComponent } from '../password-change/password-change.component';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    NameChangeComponent,
    PasswordChangeComponent,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  @Output() deleteEvent = new EventEmitter();
  readonly dialog = inject(MatDialog);

  constructor(private userService: UserService, private router: Router) {}

  deleteProfile(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: 'Are you sure?',
        text: 'Deleting your profile will remove all your information and activity. This process is irreversible.',
        submitButton: 'OK',
        button: 'Cancel',
      },
    });

    dialogRef.componentInstance.submitEvent.subscribe(() => {
      this.userService.deleteUser().subscribe(() => {
        this.deleteEvent.emit();
        this.router.navigateByUrl('/auth/login');
      });
    });
  }
}

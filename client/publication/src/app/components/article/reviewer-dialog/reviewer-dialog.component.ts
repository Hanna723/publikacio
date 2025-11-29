
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-reviewer-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
],
  templateUrl: './reviewer-dialog.component.html',
  styleUrl: './reviewer-dialog.component.scss',
})
export class ReviewerDialogComponent implements OnInit {
  @Output() submitEvent = new EventEmitter<User>();
  reviewers: User[] = [];
  reviewerCount?: number;
  selectedReviewer?: User;

  constructor(
    public dialogRef: MatDialogRef<ReviewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedReviewers: string[] },
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getReviewers().subscribe((reviewers) => {
      this.reviewers = reviewers.filter(
        (reviewer) =>
          reviewer._id && !this.data.selectedReviewers.includes(reviewer._id)
      );
      this.reviewerCount = this.reviewers.length;
    });
  }

  onSubmit(): void {
    if (this.selectedReviewer) {
      this.submitEvent.emit(this.selectedReviewer);
      this.onCancel();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

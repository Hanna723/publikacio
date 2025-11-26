import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

import { Review } from 'src/app/shared/models/Review';
import { RoleName } from 'src/app/shared/models/Role';
import { ReviewService } from 'src/app/shared/services/review.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  reviewForm: FormGroup = new FormGroup({
    text: new FormControl('', [Validators.required]),
    isAccepted: new FormControl(false, []),
  });
  title: string = 'New review';
  review?: Review;
  articleId: string = '';

  constructor(
    private reviewService: ReviewService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const url = this.router.url.split('/');
    const id = url[url.length - 1];
    const urlEnd = url[url.length - 2];

    this.userService.getUser().subscribe((user) => {
      if (user.role !== RoleName.REVIEWER) {
        if (urlEnd === 'new') {
          this.router.navigateByUrl('/article/' + id);
        } else {
          this.router.navigateByUrl('/review/' + id);
        }
      }
    });

    if (urlEnd === 'new') {
      this.articleId = id;
      return;
    }

    this.title = 'Edit review';

    this.reviewService.getById(id).subscribe((review) => {
      this.review = review;

      this.reviewForm.controls['text'].setValue(review.text);
      this.reviewForm.controls['isAccepted'].setValue(review.isAccepted);
    });
  }

  triggerResize() {
    const previousScrollY = window.scrollY;
    this.autosize.resizeToFitContent(true);
    window.scrollTo({ top: previousScrollY });
  }

  onCancel(): void {
    if (!this.review) {
      this.router.navigateByUrl('/article/' + this.articleId);
    } else {
      this.router.navigateByUrl('/review/' + this.review._id);
    }
  }

  onSubmit(): void {
    const text = this.reviewForm.controls['text'].value;
    const isAccepted = this.reviewForm.controls['isAccepted'].value;

    if (!this.review) {
      this.reviewService
        .create(text, isAccepted, this.articleId)
        .subscribe((review) => {
          this.router.navigateByUrl('/review/' + review._id);
        });
    } else {
      this.review.text = text;
      this.review.isAccepted = isAccepted;

      this.reviewService.update(this.review).subscribe((review) => {
        this.router.navigateByUrl('/review/' + review._id);
      });
    }
  }
}


import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { Review } from 'src/app/shared/models/Review';
import { User } from 'src/app/shared/models/User';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-detail',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    RouterLink
],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  review?: Review;
  reviewerName: string = '';
  articleTitle: string = '';
  user?: User;

  constructor(
    private reviewService: ReviewService,
    private userService: UserService,
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const url = this.router.url.split('/');
    const id = url[url.length - 1];

    this.reviewService.getById(id).subscribe((review) => {
      this.review = review;

      this.userService.getUserById(review.reviewer).subscribe((reviewer) => {
        this.reviewerName = reviewer.firstName + ' ' + reviewer.lastName;
      });

      this.articleService.getById(review.article).subscribe((article) => {
        this.articleTitle = article.title;
      });
    });

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  editReview() {
    this.router.navigateByUrl('/review/edit/' + this.review?._id);
  }

  deleteReview() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: 'Are you sure?',
        submitButton: 'OK',
        button: 'Cancel',
      },
    });

    dialogRef.componentInstance.submitEvent.subscribe(() => {
      if (!this.review?._id) {
        return;
      }

      this.reviewService.delete(this.review._id).subscribe(() => {
        this.router.navigateByUrl('/article/' + this.review?.article);
      });
    });
  }
}

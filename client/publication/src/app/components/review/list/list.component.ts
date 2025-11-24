
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

import { Review } from 'src/app/shared/models/Review';
import { RoleName } from 'src/app/shared/models/Role';
import { ReviewService } from 'src/app/shared/services/review.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface TableReview {
  _id: string;
  reviewer: string;
  text: string;
  isAccepted: boolean;
}

@Component({
  selector: 'app-list',
  imports: [MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  @Input() articleId?: string;
  @Input() userRole?: RoleName | string;
  reviews: Review[] = [];
  tableReviews: TableReview[] = [];
  displayedColumns: string[] = ['reviewer', 'text', 'isAccepted', 'action'];
  isReviewer = false;

  constructor(
    private reviewService: ReviewService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isReviewer = this.userRole === RoleName.REVIEWER;

    if (!this.articleId) {
      return;
    }

    this.reviewService.getByArticleId(this.articleId).subscribe((reviews) => {
      this.reviews = reviews;

      this.reviews.forEach((review) => {
        this.userService.getUserById(review.reviewer).subscribe((reviewer) => {
          if (!review._id) {
            return;
          }

          const tableReview: TableReview = {
            _id: review._id,
            reviewer: reviewer.firstName + ' ' + reviewer.lastName,
            text: this.formatReviewText(review.text),
            isAccepted: review.isAccepted,
          };
          this.tableReviews = [...this.tableReviews, tableReview];
        });
      });
    });
  }

  formatReviewText(text: string): string {
    if (text.length < 50) {
      return text;
    }

    return text.slice(0, 50) + '...';
  }

  newReview(): void {
    this.router.navigateByUrl('/review/new/' + this.articleId);
  }

  navigateToReview(review: TableReview): void {
    this.router.navigateByUrl('/review/' + review._id);
  }
}

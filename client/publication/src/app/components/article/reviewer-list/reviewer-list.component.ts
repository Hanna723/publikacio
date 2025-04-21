import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Article } from 'src/app/shared/models/Article';
import { RoleName } from 'src/app/shared/models/Role';
import { ArticleService } from 'src/app/shared/services/article.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewerDialogComponent } from '../reviewer-dialog/reviewer-dialog.component';

export interface TableReviewer {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-reviewer-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './reviewer-list.component.html',
  styleUrl: './reviewer-list.component.scss',
})
export class ReviewerListComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  @Input() article?: Article;
  @Input() reviewers: string[] = [];
  @Input() userRole?: RoleName | string;
  tableReviewers: TableReviewer[] = [];
  displayedColumns: string[] = ['name', 'action'];
  isEditor = false;

  constructor(
    private articleService: ArticleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isEditor = this.userRole === RoleName.EDITOR;
    this.reviewers.forEach((id) => {
      this.userService.getUserById(id).subscribe((user) => {
        const tableReviewer: TableReviewer = {
          _id: id,
          name: user.firstName + ' ' + user.lastName,
        };

        this.tableReviewers = [...this.tableReviewers, tableReviewer];
      });
    });
  }

  newReviewer(): void {
    const dialogRef = this.dialog.open(ReviewerDialogComponent, {
      width: '350px',
      data: {
        selectedReviewers: this.reviewers,
      },
    });

    dialogRef.componentInstance.submitEvent.subscribe((selected) => {
      if (!this.article?._id || !selected._id) {
        return;
      }

      const tableReviewer: TableReviewer = {
        _id: selected._id,
        name: selected.firstName + ' ' + selected.lastName,
      };

      this.reviewers.push(selected._id);
      this.tableReviewers = [...this.tableReviewers, tableReviewer];

      if (this.article) {
        this.article.reviewers = this.reviewers;
        this.articleService.update(this.article).subscribe();
      }
    });
  }

  deleteReviewer(element: TableReviewer): void {
    this.reviewers = this.reviewers.filter((id) => id !== element._id);
    this.tableReviewers = this.tableReviewers.filter(
      (reviewer) => reviewer._id !== element._id
    );

    if (this.article) {
      this.article.reviewers = this.reviewers;
      this.articleService.update(this.article).subscribe();
    }
  }
}

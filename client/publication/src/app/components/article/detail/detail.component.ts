import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

import { Article } from 'src/app/shared/models/Article';
import { User } from 'src/app/shared/models/User';
import { ArticleService } from 'src/app/shared/services/article.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ReviewerListComponent } from "../reviewer-list/reviewer-list.component";
import { ListComponent } from 'src/app/components/review/list/list.component'
@Component({
  selector: 'app-detail',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    ReviewerListComponent,
    ListComponent
],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  article?: Article;
  authorName: string = '';
  user?: User;

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const url = this.router.url.split('/');
    const id = url[url.length - 1];

    this.articleService.getById(id).subscribe((article) => {
      this.article = article;

      this.userService.getUserById(article.author).subscribe((author) => {
        this.authorName = author.firstName + ' ' + author.lastName;
      });
    });

    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  editArticle() {
    this.router.navigateByUrl('/article/edit/' + this.article?._id);
  }

  deleteArticle() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: 'Are you sure?',
        submitButton: 'OK',
        button: 'Cancel',
      },
    });

    dialogRef.componentInstance.submitEvent.subscribe(() => {
      if (!this.article?._id) {
        return;
      }

      this.articleService.delete(this.article?._id).subscribe(() => {
        this.router.navigateByUrl('/article/list');
      });
    });
  }
}

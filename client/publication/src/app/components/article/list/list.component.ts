import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoleName } from 'src/app/shared/models/Role';

import { ArticleService } from 'src/app/shared/services/article.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface TableArticle {
  _id: string;
  author: string;
  title: string;
  readyForReview: boolean;
  reviewers: number;
  isAccepted: boolean | undefined;
}

@Component({
  selector: 'app-list',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = [
    'author',
    'title',
    'readyForReview',
    'reviewers',
    'isAccepted',
  ];
  articles: TableArticle[] = [];
  articleNum: number = 0;
  isAuthor: boolean = false;

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe((articles) => {
      this.articleNum = articles.length;

      articles.forEach((article) => {
        this.userService.getUserById(article.author).subscribe((author) => {
          const authorName = author.firstName + ' ' + author.lastName;

          const tableArticle: TableArticle = {
            _id: article._id || '',
            author: authorName,
            title: article.title,
            readyForReview: article.readyForReview,
            reviewers: article.reviewers.length,
            isAccepted: article.isAccepted,
          };

          this.articles.push(tableArticle);
        });
      });
    });

    this.userService.getUser().subscribe((user) => {
      if (user.role === RoleName.AUTHOR) {
        this.isAuthor = true;
      }
    });
  }

  navigateToArticle(article: TableArticle) {
    this.router.navigateByUrl('/article/' + article._id);
  }

  newArticle() {}
}

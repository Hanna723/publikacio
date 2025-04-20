import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

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
  imports: [CommonModule, MatTableModule],
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
  }

  navigateToArticle(article: TableArticle) {
    this.router.navigateByUrl('/article/' + article._id);
  }
}

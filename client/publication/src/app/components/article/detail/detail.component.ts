import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { Router } from '@angular/router';

import { Article } from 'src/app/shared/models/Article';
import { ArticleService } from 'src/app/shared/services/article.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, MatCardModule, MatChipsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  article?: Article;
  authorName: string = '';

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const url = this.router.url.split('/');
    const id = url[url.length - 1];

    this.articleService.getById(id).subscribe(article => {
      this.article = article;

      this.userService.getUserById(article.author).subscribe(author => {
        this.authorName = author.firstName + ' ' + author.lastName;
        console.log(this.article)
        console.log(this.authorName)
      })
    })
  }
}

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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Article } from 'src/app/shared/models/Article';
import { RoleName } from 'src/app/shared/models/Role';

import { ArticleService } from 'src/app/shared/services/article.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  articleForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', []),
    readyForReview: new FormControl(false, []),
  });
  title: string = 'New article';
  article?: Article;

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      if (user.role !== RoleName.AUTHOR) {
        this.router.navigateByUrl('/article/list');
      }
    });

    const url = this.router.url.split('/');
    const urlEnd = url[url.length - 1];

    if (urlEnd === 'new') {
      return;
    }

    this.title = 'Edit article';

    this.articleService.getById(urlEnd).subscribe((article) => {
      if (article.readyForReview) {
        this.router.navigateByUrl('/article/' + article._id);
      }
      this.article = article;

      this.articleForm.controls['title'].setValue(article.title);
      this.articleForm.controls['content'].setValue(article.content);
      this.articleForm.controls['readyForReview'].setValue(
        article.readyForReview
      );
    });
  }

  triggerResize() {
    let previousScrollY = window.scrollY;
    this.autosize.resizeToFitContent(true);
    window.scrollTo({ top: previousScrollY });
  }

  onCancel(): void {
    if (!this.article) {
      this.router.navigateByUrl('/article/list');
    } else {
      this.router.navigateByUrl('/article/' + this.article._id);
    }
  }

  onSubmit(): void {
    const title = this.articleForm.controls['title'].value;
    const content = this.articleForm.controls['content'].value;
    const readyForReview = this.articleForm.controls['readyForReview'].value;

    if (!this.article) {
      this.articleService
        .create(title, content, readyForReview)
        .subscribe((article) => {
          this.router.navigateByUrl('/article/' + article._id);
        });
    } else {
      this.article.title = title;
      this.article.content = content;
      this.article.readyForReview = readyForReview;

      this.articleService.update(this.article).subscribe((article) => {
        this.router.navigateByUrl('/article/' + article._id);
      });
    }
  }
}

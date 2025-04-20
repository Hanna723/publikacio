import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
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

import { ArticleService } from 'src/app/shared/services/article.service';

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  articleForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', []),
    readyForReview: new FormControl('', []),
  });
  title: string = 'New article';
  id?: string;

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url.split('/');
    const urlEnd = url[url.length - 1];

    if (urlEnd === 'new') {
      return;
    }

    this.id = urlEnd;
    this.title = 'Edit article';

    this.articleService.getById(this.id).subscribe((article) => {
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

  onSubmit(): void {}
}

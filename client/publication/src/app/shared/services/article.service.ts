import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../models/Article';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  URL_PREFIX = 'http://localhost:5000/article/';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Article[]>(this.URL_PREFIX + 'all', {
      withCredentials: true,
    });
  }

  getById(id: string) {
    return this.http.get<Article>(this.URL_PREFIX + id, {
      withCredentials: true,
    });
  }

  create(title: string, content: string, readyForReview: boolean) {
    const body = new URLSearchParams();
    body.set('title', title);
    body.set('content', content);
    body.set('readyForReview', JSON.stringify(readyForReview));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<Article>(this.URL_PREFIX, body, {
      headers: headers,
      withCredentials: true,
    });
  }

  update(article: Article) {
    const body = new URLSearchParams();
    body.set('title', article.title);
    body.set('content', article.content || '');
    body.set('readyForReview', JSON.stringify(article.readyForReview));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<Article>(this.URL_PREFIX + article._id, body, {
      headers: headers,
      withCredentials: true,
    });
  }

  delete(id: string) {
    return this.http.delete(this.URL_PREFIX + id, {
      withCredentials: true,
      responseType: 'text',
    });
  }
}

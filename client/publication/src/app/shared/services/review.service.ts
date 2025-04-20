import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../models/Review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  URL_PREFIX = 'http://localhost:5000/review/';

  constructor(private http: HttpClient) {}

  getByArticleId(articleId: string) {
    return this.http.get<Review[]>(this.URL_PREFIX + 'article/' + articleId, {
      withCredentials: true,
    });
  }

  getById(id: string) {
    return this.http.get<Review>(this.URL_PREFIX + id, {
      withCredentials: true,
    });
  }

  create(text: string, isAccepted: boolean, article: string) {
    const body = new URLSearchParams();
    body.set('text', text);
    body.set('isAccepted', JSON.stringify(isAccepted));
    body.set('article', article);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<Review>(this.URL_PREFIX, body, {
      headers: headers,
      withCredentials: true,
    });
  }

  update(review: Review) {
    const body = new URLSearchParams();
    body.set('text', review.text);
    body.set('isAccepted', JSON.stringify(review.isAccepted));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<Review>(this.URL_PREFIX + review._id, body, {
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

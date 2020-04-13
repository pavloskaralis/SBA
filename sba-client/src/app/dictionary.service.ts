import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private url = 'http://localhost:8080/'

  constructor(private http: HttpClient) { }

  checkContent (request) {
    return this.http.put(this.url, request);
  }

  addSelection (request) {
    return this.http.post(this.url, request)
  }

}

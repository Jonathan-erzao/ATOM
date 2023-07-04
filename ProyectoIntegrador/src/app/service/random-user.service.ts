import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomUserService {
  private API_URL = 'https://randomuser.me/api/';

  constructor(private http: HttpClient) {}

  getRandomUsers(count: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}?results=${count}`);
  }
}

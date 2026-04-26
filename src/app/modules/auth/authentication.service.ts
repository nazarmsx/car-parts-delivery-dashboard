import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Admin } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<Admin | null>;
  public currentUser: Observable<Admin | null>;

  constructor(private http: HttpClient, private router: Router) {
    const raw = localStorage.getItem('currentUser');
    let initial: Admin | null = null;
    try {
      initial = raw ? (JSON.parse(raw) as Admin) : null;
    } catch {
      initial = null;
    }
    this.currentUserSubject = new BehaviorSubject<Admin | null>(initial);

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Admin | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/api/v1/admin/login`, { login: username, password })
      .pipe(map(data => {
        if (data.access_token) {
          this.currentUserSubject.next(data);
          localStorage.setItem('currentUser', JSON.stringify(data));
        } else if (data.error) {
          throw data.error;
        } else {
          throw new Error("Something went wrong");
        }
      }));
  }

  refreshToken() {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/refresh-token`, {
      'refresh_token': this.getRefreshToken()
    }).pipe(
      tap({
        next: (result: any) => {
          const currentUser = this.currentUserValue;
          if (!currentUser) {
            return;
          }
          currentUser.access_token = result.access_token;
          this.currentUserSubject.next(currentUser);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        },
        error: () => this.logout(),
      }),
    );
  }

  logoutOnBackend() {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/sign-out`, {});
  }

  logout () {
    console.log('logout');
    // remove user from local storage to log user out
    this.logoutOnBackend().pipe(first()).subscribe(params => {

    })
    this.router.navigate(['/login']);

    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);
  }
  private getRefreshToken() {
    let currentUser = this.currentUserValue;
    if (currentUser && currentUser.refresh_token) {
      return currentUser.refresh_token;
    }
    return "";
  }
}
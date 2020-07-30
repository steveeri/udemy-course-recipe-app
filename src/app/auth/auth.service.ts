import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { tap, catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import { Router } from '@angular/router';


export interface AuthRequest {
  email: string,
  password: string,
  returnSecureToken: boolean
}

export interface AuthResponse {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

export interface AuthError {
  code: number,
  message: string,
  errors: { domain: string, message: string, reason: string }[],
  httpStatus?: number
}

@Injectable({providedIn: 'root'})
export class AuthService {

  private logoutTimer : any = null;
  private auth_user_data_key = 'authUserData';
  private url_prefix : string = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private api_key : string = "AIzaSyCekKRWxuqqrS6cSKTB3s4VrKE-_2-wafQ";

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

  autoLogin() {
    let userData : {email: string, id: string, _token: string, _expiryDate: string};
    userData = JSON.parse(localStorage.getItem(this.auth_user_data_key));
    if (!userData) return;

    const expiryDate = new Date(userData._expiryDate);
    const loadedUser = new User(userData.email, userData.id, userData._token, expiryDate);
    if (loadedUser.token) this.user.next(loadedUser);

    const expiresIn = expiryDate.getTime() - new Date().getTime();
    this.autoLogout(expiresIn);
  }

  autoLogout(expirationMs: number) {
    if (expirationMs <= 0) this.logoutUser();
    if (this.logoutTimer != null) clearTimeout(this.logoutTimer);
    this.logoutTimer = setTimeout(() => { this.logoutUser(); }, expirationMs);
  }

  signUpUser(email: string, password: string) {
    this.resetAuthentication();
    const request : AuthRequest = {email: email, password: password, returnSecureToken: true};
    return this.http.post<AuthResponse>(this.url_prefix + 'signUp?key=' + this.api_key, request)
    .pipe(tap((response: AuthResponse ) => {
      this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
    }), catchError(this.handleAuthError));
  }

  loginUser(email: string, password: string) {
    this.resetAuthentication();
    const request : AuthRequest = {email: email, password: password, returnSecureToken: true};
    return this.http.post<AuthResponse>(this.url_prefix + 'signInWithPassword?key=' + this.api_key, request)
    .pipe(tap((response: AuthResponse ) => {
      this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
    }), catchError(this.handleAuthError));
  }

  private handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
    const expiresDate = new Date(new Date().getTime() + (expiresIn * 1000));
    const user = new User(email, id, token, expiresDate);
    localStorage.setItem(this.auth_user_data_key, JSON.stringify(user));
    this.autoLogout(expiresIn * 1000);
    this.user.next(user);
  }

  private handleAuthError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    const errorInfo = {code: "", msg: "An unknown error occurred!"};
    if (!errorRes.error || !errorRes.error.error) return throwError(errorInfo);

    const error = errorRes.error.error;

    switch (error.message) {
      case "EMAIL_EXISTS":
      errorInfo.msg = "The email used already exists. Try 'Switch to Login' instead.";
      break;
      case "OPERATION_NOT_ALLOWED":
      errorInfo.msg = "The server is not currently allowing connections.";
      break;
      case "TOO_MANY_ATTEMPTS_TRY_LATER":
      errorInfo.msg = "Too many failed Sign In attempts. Please try later.";
      break;
      case "EMAIL_NOT_FOUND":
      errorInfo.msg = "The email you used could not be found. Please review details and try again.";
      break;
      case "INVALID_PASSWORD":
      errorInfo.msg = "The password or email combination is incorrect. Please review details and try again.";
      break;
      case "USER_DISABLED":
      errorInfo.msg = "Your account has been suspended. Please contact the system adminstrator.";
      break;
    }
    return throwError(errorInfo);
  }

  private resetAuthentication() {
    this.user.next(null);
    localStorage.removeItem(this.auth_user_data_key);
    if (this.logoutTimer != null) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  logoutUser() {
    this.resetAuthentication();
    this.router.navigate(['/auth']);
  }

}

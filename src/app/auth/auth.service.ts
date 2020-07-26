import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

export interface ApiRequest {
  email: string,
  password: string,
  returnSecureToken: boolean
}

export interface ApiResponse {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

export interface ApiError {
  code: number,
  message: string,
  errors: { domain: string, message: string, reason: string }[],
  httpStatus?: number
}

@Injectable({providedIn: 'root'})
export class AuthService {

  private url_prefix : string = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private api_key : string = "AIzaSyCekKRWxuqqrS6cSKTB3s4VrKE-_2-wafQ";

  private sessionDtls : ApiResponse = null;

  public userAuthenticationChanged = new EventEmitter<boolean>();

  constructor(private http: HttpClient) { }

  signUpUser(email: string, password: string) {

    this.resetAuthentication();

    const request : ApiRequest = {email: email, password: password, returnSecureToken: true};
    return this.http.post<ApiResponse>(this.url_prefix + 'signUp?key=' + this.api_key, request)
    .pipe(tap((response: ApiResponse ) => {
      this.sessionDtls = response;
      this.userAuthenticationChanged.emit(true);
    }));
  }

  loginUser(email: string, password: string) {

    this.resetAuthentication();

    const request : ApiRequest = {email: email, password: password, returnSecureToken: true};
    return this.http.post<ApiResponse>(this.url_prefix + 'signInWithPassword?key=' + this.api_key, request)
    .pipe(tap((response: ApiResponse ) => {
      this.sessionDtls = response;
      this.userAuthenticationChanged.emit(true);
    }));
  }

  private resetAuthentication() {
    this.sessionDtls = null;
    this.userAuthenticationChanged.emit(false);
  }

  isUserAuthenticated() : boolean {
    return (this.sessionDtls != null);
  }

  getUidAndToken() : {uid: string, token: string} {
    if (this.sessionDtls == null) return null;
    return {uid: this.sessionDtls.localId, token: this.sessionDtls.idToken};
  }

  logoutUser() {
    this.resetAuthentication();
  }
    // const request : ApiRequest = {email: email, password: password, returnSecureToken: true};
    // const formData = new FormData();
    // formData.append('key', this.api_key);
    // formData.append('body', JSON.stringify(request));
    // const url = this.url_prefix + 'signUp';
    // return this.http.post<ApiResponse>(url, formData)
    // .pipe(tap((response: ApiResponse ) => { this.sessionDtls = response; }));



    // .subscribe( response => {
    //   this.email = email;
    //   this.uid = response.localId;
    //   console.log(response);
    // });

  //}


}

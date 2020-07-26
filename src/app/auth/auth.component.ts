import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService, AuthResponse } from './auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  private userSubs : Subscription = null;

  loginMode = true;
  errorMessage = null;
  signInSuccess = false;
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.resetStatus();
    this.userSubs = this.authService.user.subscribe(user => {
      if (user == null) {
        this.signInSuccess = false;
        this.resetStatus();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubs != null) this.userSubs.unsubscribe();
  }

  onAuthenticate(form : NgForm) {

    this.resetStatus();
    if (!form.valid) return;  // don't send if form is invalid.
    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;
    console.log("onAuthenticate(login = " + this.loginMode + ") called. Email = " + email + ", password = " + password);

    let authObs : Observable<AuthResponse>;

    if (this.loginMode) authObs = this.authService.loginUser(email,password);
    else authObs = this.authService.signUpUser(email,password);

    authObs.subscribe(response => {
      console.log(response);
      this.resetStatus();
      this.signInSuccess = true;
      form.reset();
    }, (errorInfo : {code:string, msg:string}) => {
      console.log(errorInfo);
      this.resetStatus();
      this.errorMessage = errorInfo.msg;
    });

  }

  onToggleLoginMode() {
    this.loginMode = !this.loginMode;
    this.resetStatus();
  }

  private resetStatus() {
    this.errorMessage = null;
    this.signInSuccess = false;
    this.isLoading = false;
  }

}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService, ApiError } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginMode = true;
  emailExists = false;
  signInDisabled = false;
  signInSuccess = false;
  loginFailed = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {}

  onAuthenticate(form : NgForm) {

    if (!form.valid) return;  // don't send if form is invalid.
    this.resetErrorStatus();

    const email = form.value.email;
    const password = form.value.password;
    console.log("onAuthenticate(login = " + this.loginMode + ") called. Email = " + email + ", password = " + password);

    if (this.loginMode) {
      this.authService.loginUser(email,password).subscribe(response => {
        console.log(response);
        this.resetErrorStatus();
        this.signInSuccess = true;
        form.reset();
      }, error => {
        console.log(error);
        this.resetErrorStatus();
      });
    } else {
      this.authService.signUpUser(email,password).subscribe(response => {
        console.log(response);
        this.resetErrorStatus();
        this.signInSuccess = true;
        form.reset();
      }, errorResponse => {
        console.log(errorResponse);
        this.resetErrorStatus();
        const error : ApiError = errorResponse.error.error;
        error.httpStatus = errorResponse.status;
        if (error.message === "EMAIL_EXISTS") {
          this.emailExists = true;
        } else if (error.message === "OPERATION_NOT_ALLOWED" || error.message === "TOO_MANY_ATTEMPTS_TRY_LATER") {
          this.signInDisabled = true;
        }
      });
    }

  }

  onToggleLoginMode() {
    this.loginMode = !this.loginMode;
    this.resetErrorStatus();
  }

  private resetErrorStatus() {
    this.emailExists = false;
    this.signInDisabled = false;
    this.signInSuccess = false;
    this.loginFailed = false;
  }

}

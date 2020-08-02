import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  private storeSub : Subscription;
  private loginMode = true;

  errorMessage = null;
  alertMessage = null;
  signInSuccess = false;
  isLoading = false;

  constructor(private store : Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.signInSuccess = !this.isLoading && !!authState.user;
      this.isLoading = authState.loading;
      this.errorMessage = authState.authError;
      if (this.errorMessage) this.alertMessage = this.errorMessage;
    })
  }

  ngOnDestroy() {
    if (!!this.storeSub) this.storeSub.unsubscribe();
  }

  onAuthenticate(form : NgForm) {
    if (!form.valid) return;  // don't send if form is invalid.
    const email = form.value.email;
    const password = form.value.password;

    if (this.loginMode) this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    else this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
  }

  onHandleError() {
    this.alertMessage = null;
    setTimeout(() => { this.store.dispatch(new AuthActions.ClearError()); }, 2000);
  }

  onToggleLoginMode() {
    this.alertMessage = null;
    this.loginMode = !this.loginMode;
    this.store.dispatch(new AuthActions.ClearError());
  }
}

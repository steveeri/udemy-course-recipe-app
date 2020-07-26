import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { User } from '../auth/user.modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  userAuthenticated = false;
  private userSubs : Subscription = null;
  private timer : Subscription = null;

  constructor(
    private dataStorageService : DataStorageService,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    this.userSubs = this.authService.user.subscribe((user:User) => {
      if (this.timer != null) { this.timer.unsubscribe(); }
      const thisTimer = new EventEmitter<boolean>();
      this.timer = thisTimer.pipe(debounceTime(1500)).subscribe((status : boolean) => {
        console.log("after debouce running code = " + status);
        this.userAuthenticated = (!!user);
      });
      thisTimer.emit(!!user);  // emit status change.
    });
  }

  ngOnDestroy() {
    if (this.userSubs != null) this.userSubs.unsubscribe();
    if (this.timer != null) this.timer.unsubscribe();
  }

  onSignInOrOut() {
    console.log("Sign in triggered");
    this.authService.logoutUser();
  }

  onSaveData() {
    this.dataStorageService.saveRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe( response => {
      console.log(response);
    });
  }

}

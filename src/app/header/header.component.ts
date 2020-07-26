import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  userAuthenticated = false;
  private timer : Subscription = null;

  constructor(
    private dataStorageService : DataStorageService,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    this.authService.userAuthenticationChanged.subscribe((authStatus:boolean) => {
      if (this.timer != null) { this.timer.unsubscribe(); }

      const thisTimer = new EventEmitter<boolean>();
      this.timer = thisTimer.pipe(debounceTime(2000)).subscribe((status : boolean) => {
        console.log("after debouce running code = " + status);
        this.userAuthenticated = status;
      });
      thisTimer.emit(authStatus);  // emit status change.
    });
  }

  ngOnDestroy() {
    if (this.timer != null) this.timer.unsubscribe();
  }

  onSignInOrOut() {
    console.log("Sign in triggered");
    if (!this.userAuthenticated) {
      this.router.navigate(['/auth']);
    } else {
      this.authService.logoutUser();
      this.router.navigate(['/auth']);
    }
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

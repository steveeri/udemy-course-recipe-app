import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  userAuthenticated = false;
  private storeSub : Subscription;
  private timer : Subscription = null;

  constructor(
    private dataStorageService : DataStorageService,
    private store : Store<fromApp.AppState>) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      if (this.timer != null) { this.timer.unsubscribe(); }
      const thisTimer = new EventEmitter<boolean>();
      this.timer = thisTimer.pipe(debounceTime(1500)).subscribe((status : boolean) => {
        console.log("after debouce running code = " + status);
        this.userAuthenticated = (!!authState.user);
      });
      thisTimer.emit(!!authState.user);  // emit status change.
    });
  }

  ngOnDestroy() {
    if (this.timer != null) this.timer.unsubscribe();
    if (!!this.storeSub) this.storeSub.unsubscribe();
  }

  onSignInOrOut() {
    console.log("SignIn/Out in triggered");
    this.store.dispatch(new AuthActions.Logout());
  }

  onSaveData() {
    this.dataStorageService.saveRecipes();

  }

  onFetchData() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

}

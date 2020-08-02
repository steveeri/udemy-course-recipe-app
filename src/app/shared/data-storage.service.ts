import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  private URL = 'https://udemy-recipes-project-86f1b.firebaseio.com/recipes.json';

  constructor(
    private http : HttpClient,
    private recipeService : RecipeService,
    private store : Store<fromApp.AppState>) {
  }

  public fetchRecipes() {
    return this.http.get<Recipe[]>(this.URL)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
          });
        }),
        tap(recipes => {
          this.store.dispatch(new RecipeActions.SetRecipes(recipes));
        })
      );
  }

  public saveRecipes() {
    const recipes : Recipe[] = this.recipeService.getRecipes();
    if (recipes == null || recipes.length == 0) return;

    this.http.put<Recipe[]>(this.URL, recipes).subscribe(response => {
      console.log(response);
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  private URL = 'https://udemy-recipes-project-86f1b.firebaseio.com/recipes.json';

  constructor(private http : HttpClient, private recipeService : RecipeService) { }

  public fetchRecipes() {
    return this.http.get<Recipe[]>(this.URL)
    .pipe(map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap(recipes => { this.recipeService.loadRecipes(recipes) })
    )
  }

  public saveRecipes() {
    const recipes : Recipe[] = this.recipeService.getRecipes();
    if (recipes == null || recipes.length == 0) return;

    this.http.put<Recipe[]>(this.URL, recipes).subscribe(response => {
      console.log(response);
    });
  }

}

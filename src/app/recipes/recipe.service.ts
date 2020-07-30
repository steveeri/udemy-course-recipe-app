import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({providedIn: 'root'})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe("Test Recipe #1", "This is a test recipe for showing how this works.",
    //   "https://heartfoundation-prod.azurewebsites.net/getmedia/0bc0fd6c-3f83-4e80-ae69-86468fb8347f/Chicken,-rice-and-bean-bowl.jpg",
    //   [
    //     new Ingredient("Beef", 2), new Ingredient("Brocolli", 12)
    //   ]),
    // new Recipe("Test Recipe #2", "This is a test recipe for showing how this works.",
    //   "https://heartfoundation-prod.azurewebsites.net/getmedia/0bc0fd6c-3f83-4e80-ae69-86468fb8347f/Chicken,-rice-and-bean-bowl.jpg",
    //   []),
    // new Recipe("Test Recipe #3", "This is a test recipe for showing how this works.",
    //   "https://heartfoundation-prod.azurewebsites.net/getmedia/0bc0fd6c-3f83-4e80-ae69-86468fb8347f/Chicken,-rice-and-bean-bowl.jpg",
    //   [
    //     new Ingredient("Watercrest", 3), new Ingredient("Jelly", 1)
    //   ]),
    // new Recipe("Test Recipe #4", "This is a test recipe for showing how this works.",
    //   "https://heartfoundation-prod.azurewebsites.net/getmedia/0bc0fd6c-3f83-4e80-ae69-86468fb8347f/Chicken,-rice-and-bean-bowl.jpg",
    //   [
    //     new Ingredient("Lemon", 1), new Ingredient("T Sauce", 200)
    //   ])
  ];

  constructor(private slService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    if (this.recipes[index] != null) {
      this.recipes.splice(index, 1);
      this.recipeChanged.next(this.recipes.slice());
    }
  }

  updateRecipe(index: number, recipe: Recipe) {
    if (this.recipes[index] != null) {
      this.recipes[index] = recipe;
      this.recipeChanged.next(this.recipes.slice());
    }
  }

  loadRecipes(recipes : Recipe[]) {
    this.recipes = recipes != null ? [...recipes] : [];
    this.recipeChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}

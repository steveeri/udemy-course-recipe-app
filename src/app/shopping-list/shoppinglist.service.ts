import { Injectable, EventEmitter, Output } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({providedIn: "root"})
export class ShoppingListService {

  ingredientsChanged = new EventEmitter<Ingredient[]>();
  
  private ingredients: Ingredient[] = [
    new Ingredient("Sugar", 23),
    new Ingredient("Flour", 10),
    new Ingredient("Vanila", 3),
    new Ingredient("Apples", 2)
  ];

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.getIngredients());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.emit(this.getIngredients());
  }

  getIngredients() {
    return this.ingredients.slice();
  }
}

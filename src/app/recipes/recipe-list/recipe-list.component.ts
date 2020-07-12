import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit {

  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe("Test Recipe #1", "This is a test recipe for showing how this works.", "https://heartfoundation-prod.azurewebsites.net/getmedia/0bc0fd6c-3f83-4e80-ae69-86468fb8347f/Chicken,-rice-and-bean-bowl.jpg"),
    new Recipe("Test Recipe #2", "This is a test recipe for showing how this works.", "https://heartfoundation-prod.azurewebsites.net/getmedia/0bc0fd6c-3f83-4e80-ae69-86468fb8347f/Chicken,-rice-and-bean-bowl.jpg"),
    new Recipe("Test Recipe #3", "This is a test recipe for showing how this works.", "https://heartfoundation-prod.azurewebsites.net/getmedia/0bc0fd6c-3f83-4e80-ae69-86468fb8347f/Chicken,-rice-and-bean-bowl.jpg"),
    new Recipe("Test Recipe #4", "This is a test recipe for showing how this works.", "https://heartfoundation-prod.azurewebsites.net/getmedia/0bc0fd6c-3f83-4e80-ae69-86468fb8347f/Chicken,-rice-and-bean-bowl.jpg")
  ];

  constructor() { }
  ngOnInit(): void {}

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }

}

import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: Ingredient[] = [
    new Ingredient("Sugar", 23),
    new Ingredient("Flour", 10),
    new Ingredient("Vanila", 3),
    new Ingredient("Apples", 2)
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

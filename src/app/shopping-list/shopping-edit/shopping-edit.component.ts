import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shoppinglist.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  @ViewChild('nameInput') nameInput : ElementRef;
  @ViewChild('amountInput') amountInput : ElementRef;

  constructor(private slService: ShoppingListService) {}
  ngOnInit(): void {}

  onAddIngredients() {
    const name = this.nameInput.nativeElement.value;  
    const amount = this.amountInput.nativeElement.value;
    this.slService.addIngredient(new Ingredient(name, amount));
  }
}

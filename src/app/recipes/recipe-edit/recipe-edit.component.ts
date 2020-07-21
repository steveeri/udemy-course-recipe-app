import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  submitted = false;
  //currentRecipe : Recipe = null;
  theForm : FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  private initForm() {
    let recipe = new Recipe("","","",[]);
    let recipeIngredients = new FormArray([]);

    if (this.editMode && this.id != null) recipe = this.recipeService.getRecipe(this.id);

    recipe.ingredients.forEach(x => {
      recipeIngredients.push(new FormGroup({
        "name": new FormControl(x.name, Validators.required),
        "amount": new FormControl(x.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
        })
      );
    });

    this.theForm = new FormGroup({
      "name": new FormControl(recipe.name, Validators.required),
      "description": new FormControl(recipe.description, Validators.required),
      "imagePath": new FormControl(recipe.imagePath, Validators.required),
      "ingredients": recipeIngredients
    });
  }

  onSubmit() {
    // const recipe = new Recipe(
      // this.theForm.value['name'],
      // this.theForm.value['description'],
      // this.theForm.value['imagePath'],
      // this.theForm.value['ingredients']);
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.theForm.value);
    } else {
      this.recipeService.addRecipe(this.theForm.value);
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  get controls() { return (<FormArray>this.theForm.get('ingredients')).controls; }

  onAddIngredient() {
    (<FormArray>this.theForm.get('ingredients')).push(new FormGroup({
      "name": new FormControl(null, Validators.required),
      "amount": new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onDeleteIngredient(index: number) {
    if ( (<FormArray>this.theForm.get('ingredients')).at(index) != null) {
      (<FormArray>this.theForm.get('ingredients')).removeAt(index);
    }
  }

  onCancel() {
    if (this.editMode) {
      this.editMode = false;
      this.id != null;
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}

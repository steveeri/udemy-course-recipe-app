import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './spinner.component';
import { DropdownDirective } from './dropdown.directive';

@NgModule({
  declarations: [
    SpinnerComponent,
    DropdownDirective
  ],
  imports: [CommonModule],
  exports: [
    SpinnerComponent,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule {}

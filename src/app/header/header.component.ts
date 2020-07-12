import { Component, OnInit, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent  implements OnInit {

  @Output() featureSelected = new EventEmitter<string>();

  collapsed = true;

  constructor() {}
  ngOnInit(): void {}

 onSelect(feature: string) {
   this.featureSelected.emit(feature);

   if (feature === "recipe") {

   } else if (feature === "shopping-list") {

   }
 }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilmsListComponent} from "./films-list/films-list.component";
import {RouterModule} from "@angular/router";
import {routes} from "./films.routes";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FilmsListComponent,
    RouterModule.forChild(routes)
  ]
})
export default class FilmsModule { }

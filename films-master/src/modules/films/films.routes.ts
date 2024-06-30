import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { canDeactivateGuard } from '../../guards/can-deactivate.guard';
import {FilmsMenuComponent} from "./films-menu/films-menu.component";
import {FilmsEditComponent} from "./films-edit/films-edit.component";
import {FilmsListComponent} from "./films-list/films-list.component";

export const routes: Routes = [
  {path : '', component: FilmsMenuComponent, children:[
      {path: '', component: FilmsListComponent},
      {path: 'new', component: FilmsEditComponent},
      {path: 'edit/:id',
        component: FilmsEditComponent,
        canActivate:[authGuard],
        canDeactivate:[canDeactivateGuard]
      }
    ]}
];

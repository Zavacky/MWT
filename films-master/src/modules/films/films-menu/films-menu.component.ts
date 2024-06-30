import { Component } from '@angular/core';
import {MatTabLink, MatTabNav} from "@angular/material/tabs";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-films-menu',
  standalone: true,
    imports: [
        MatTabLink,
        MatTabNav,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ],
  templateUrl: './films-menu.component.html',
  styleUrl: './films-menu.component.css'
})
export class FilmsMenuComponent {

}

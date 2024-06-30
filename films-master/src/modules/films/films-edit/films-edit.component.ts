import {Component, inject, OnInit} from '@angular/core';
import {FilmsEditChildComponent} from "../films-edit-child/films-edit-child.component";
import {CanDeactivateComponent} from "../../../guards/can-deactivate.guard";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmService} from "../../../services/confirm.service";
import {map, Observable, of, switchMap} from "rxjs";
import {Film} from "../../../entities/film";
import {FilmsService} from "../../../services/films.service";

@Component({
  selector: 'app-films-edit',
  standalone: true,
  imports: [FilmsEditChildComponent],
  templateUrl: './films-edit.component.html',
  styleUrl: './films-edit.component.css'
})
export class FilmsEditComponent implements OnInit, CanDeactivateComponent {
  filmsService = inject(FilmsService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  confirmService = inject(ConfirmService);
  saved = false;
  film: Film = new Film("", 0, "", "", [], [], {}, 0);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get("id")),
      map(strId => Number(strId) || 0),
      switchMap(id => id ? this.filmsService.getFilm(id) : of(new Film("", 0, "", "", [], [], {}, 0))),
    ).subscribe(film => this.film = film);
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.saved) {
      return true;
    }
    return this.confirmService.confirm({
      title: "Editation not saved",
      question: "Film not saved, do you want to leave?"
    });
  }

  filmSaved($event: Film) {
    this.saved = true;
    this.router.navigateByUrl("/films");
  }
}

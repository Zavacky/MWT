import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Film} from "../../../entities/film";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FilmsService} from "../../../services/films.service";
import {Person} from "../../../entities/person";
import {Postava} from "../../../entities/postava";
import {catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-films-edit-child',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatTable,
    MatSelect,
    MatOption,
    MatAutocomplete,
    AsyncPipe,
    MatAutocompleteTrigger,
    NgIf
  ],
  templateUrl: './films-edit-child.component.html',
  styleUrl: './films-edit-child.component.css'
})
export class FilmsEditChildComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
      throw new Error('Method not implemented.');
  }
  route = inject(ActivatedRoute);
  filmsService = inject(FilmsService);
  fb = inject(FormBuilder);
  filmId?: number;
  film = new Film('', 0, '', '', [], [], {});
  editForm = this.fb.group({
    nazov: ['', [Validators.required, Validators.minLength(1)]],
    rok: [2020, Validators.required],
    slovenskyNazov: ['', Validators.required],
    imdbID: ['', Validators.required],
    poradieVRebricku: this.fb.group({
      afi1998Control: [''],
      afi2007Control: ['']
    }),
    reziser: this.fb.array([]),
    postavy: this.fb.array([])
  });
  searchControl = new FormControl();
  directors: Person[] = [];
  characters: Postava[] = [];
  charactersDataSource = new MatTableDataSource<Postava>()
  directorsDataSource = new MatTableDataSource<Person>()
  namePostava = new FormControl()
  selectedRole: any;
  @Output() filmChange = new EventEmitter<Film>();


  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = Number(params.get('id')) || undefined;
          this.filmId = id;
          return id ? this.filmsService.getFilm(id) : of(new Film('', 0, '', '', [], [], {}));
        }),
        tap(film => {
          this.film = film;
          console.log("Editing film:", film);
          this.editForm.patchValue({
            nazov: film.nazov,
            rok: film.rok,
            slovenskyNazov: film.slovenskyNazov,
            imdbID: film.imdbID,
            poradieVRebricku: {
              afi1998Control: film.poradieVRebricku['AFI 1998'] ? film.poradieVRebricku['AFI 1998'].toString() : '',
              afi2007Control: film.poradieVRebricku['AFI 2007'] ? film.poradieVRebricku['AFI 2007'].toString() : ''
            }
          });
          this.directors = film.reziser;
          this.directorsDataSource.data = this.directors;
          this.characters = film.postava;
          this.charactersDataSource.data = this.characters;
        })
      ).subscribe();
  }


  submit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.film.nazov = this.nazov.value.trim();
    this.film.rok = Number(this.rok.value);
    this.film.slovenskyNazov = this.slovenskyNazov.value.trim();
    this.film.imdbID = this.imdbID.value.trim();
    this.film.poradieVRebricku = {
      'AFI 1998': this.poradieVRebricku.get('afi1998Control')!.value,
      'AFI 2007': this.poradieVRebricku.get('afi2007Control')!.value
    };
    this.filmsService.saveFilm(this.film).subscribe(() => this.filmChange.emit(this.film));
  }

  get nazov(): FormControl<string> {
    return this.editForm.get('nazov') as FormControl<string>;
  }
  get rok(): FormControl<number> {
    return this.editForm.get('rok') as FormControl<number>;
  }
  get slovenskyNazov(): FormControl<string> {
    return this.editForm.get('slovenskyNazov') as FormControl<string>;
  }
  get poradieVRebricku(): FormGroup {
    return this.editForm.get('poradieVRebricku') as FormGroup;
  }
  get imdbID(): FormControl<string> {
    return this.editForm.get('imdbID') as FormControl<string>;
  }
}

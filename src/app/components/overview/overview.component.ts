import {Component, inject, Inject, OnInit} from '@angular/core';

import {EmployeeApiService} from "../../services/employee-api.service";
import {QualificationApiService} from "../../services/qualification-api.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {KeycloakService} from "keycloak-angular";
import {Employee} from "../../models/employee";
import {Qualification} from "../../models/Qualification";
import {MatButtonModule} from "@angular/material/button";
import {
  AddEditQualificationDialogComponent
} from "../dialogs/add-edit-qualification-dialog/add-edit-qualification-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../dialogs/delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  protected employees$!: Observable<Employee[]>;
  protected qualifications$!: Observable<Qualification[]>;

  readonly dialog = inject(MatDialog);

  constructor(
    private employeeApiService: EmployeeApiService,
    private qualificationApiService: QualificationApiService,
    private keycloak: KeycloakService,
  ) {
  }

  ngOnInit() {
   this.employeeApiService.getAllEmployees().then(result => {
     this.employees$ = result;
   }) .catch((error) => {
     console.error('Error:', error);
   });
    this.qualificationApiService.getAllQualifications().then(result => {
      this.qualifications$ = result;
    }).catch((error) => {
      console.error('Error:', error);
    })
  }

  logout(){
    this.keycloak.logout();
  }

  addOrEditQualification(qualification: Qualification|null) {
    const dialogRef = this.dialog.open(AddEditQualificationDialogComponent, {
      data: { qualification: qualification }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    })
  }

  openDeleteDialog(id:number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.qualificationApiService.deleteQualification(id)
          .then(r => this.ngOnInit())
          .catch(error => { console.log(error); });
      } else {
        console.log('Löschen wurde abgebrochen.');
      }
    });
  }
}

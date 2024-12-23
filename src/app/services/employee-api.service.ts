import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {of} from "rxjs";
import {Employee} from "../Employee";
import {KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService {
  constructor(private http: HttpClient, private keyCloakService: KeycloakService) { }

  async authorize(){
    return await this.keyCloakService.getToken();
  }

  async getAllEmployees() {
    return this.http.get<Employee[]>('http://localhost:8089/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${await this.authorize()}`)
    });
  }
}

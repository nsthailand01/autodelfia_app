import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/index";
import { MSLISPatientModel } from '@app/models';
import { RepositoryService } from '@app/shared/repository.service';

@Injectable({
  providedIn: 'root'
})
export class PatientHistoryService {

  constructor(
    private repoService: RepositoryService
  ) { }
  baseUrl: string = 'http://localhost:8080/api/employees/';

  getPatients() : Observable<any> {
    return this.repoService.getData(this.baseUrl);
  }

  getPatientById(id: any) : Observable<any> {
    return this.repoService.getData(this.baseUrl);
  }

  createPatient(patientData: any): Observable<any> {
    console.log('patientData >> ', patientData);
    return this.repoService.create('api/mslispatient/create', patientData);
  }

  updatePatient(patientData: MSLISPatientModel): Observable<any> {
    return this.repoService.update('api/mslispatient/update', patientData);
  }

  deletePatient(id: any): Observable<any> {
    return this.repoService.delete('api/mslispatient/delete', id);
  }
}

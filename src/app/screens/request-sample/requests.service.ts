import { Injectable } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(
    private repoService: RepositoryService
  ) { }

  getAlls(): Observable<any> {
    return this.repoService.getData('api/requests/getAll');
  }

  getByCondition(data: any): Observable<any> {
    const time = new Date();
    const res = this.repoService.getDataParm('api/requests/getByCondition', data);
    console.log('time :: ', new Date().valueOf() - time.valueOf());
    return res;
  }

  create(data: any): Observable<any> {
    return this.repoService.create('api/requests/create', data);
  }

  update(data: any): Observable<any> {
    return this.repoService.update('api/requests/update', data);
  }

  delete(data: any): Observable<any> {
    return this.repoService.delete('api/requests/delete', data);
  }

  getPatientMoreByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/RequestsPatientMore/getByCondition', data);
  }
}

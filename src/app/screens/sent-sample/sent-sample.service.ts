import { Injectable } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SentSampleService {

  constructor(
    private repoService: RepositoryService
  ) { }

  query(query: any): Promise<any> {
    return this.repoService.query('api/LISSentSampleHD/query', query).toPromise();
  }

  getLISSentSampleHD(): Observable<any> {
    return this.repoService.getData('api/LISSentSampleHD/getAll');
  }

  getLISSentSampleHDByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/LISSentSampleHD/getByCondition', data);
  }

  getLISSentSampleHDByCondition2(data: any): Observable<any> {
    return this.repoService.getDataParm('api/LISSentSampleHD/getByCondition2', data);
  }

  createLISSentSampleHD(data: any): Observable<any> {
    return this.repoService.create('api/LISSentSampleHD/create', data);
  }

  save(data: any): Observable<any> {
    console.log('data to save :: ', data);
    return this.repoService.create('api/LISSentSampleHD/save', data);
  }

  updateLISSentSampleHD(data: any): Observable<any> {
    return this.repoService.update('api/LISSentSampleHD/update', data);
  }

  deleteLISSentSampleHD(data: any): Observable<any> {
    return this.repoService.delete('api/LISSentSampleHD/delete', data);
  }

  getLISSentSampleDT(): Observable<any> {
    return this.repoService.getData('api/LISSentSampleDT/getAll');
  }

  getLISSentSampleDTById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/LISSentSampleDT/getByCondition', data);
  }

  createLISSentSampleDT(data: any): Observable<any> {
    return this.repoService.create('api/LISSentSampleDT/create', data);
  }

  updateLISSentSampleDT(data: any): Observable<any> {
    return this.repoService.update('api/LISSentSampleDT/update', data);
  }

  deleteLISSentSampleDT(data: any): Observable<any> {
    return this.repoService.delete('api/LISSentSampleDT/delete', data);
  }
}

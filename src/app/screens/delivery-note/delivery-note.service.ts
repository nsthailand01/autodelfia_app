import { Injectable } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryNoteService {

  constructor(
    private repoService: RepositoryService
  ) {

  }

  getBatchHD(): Observable<any> {
    return this.repoService.getData('api/BatchHD/getAll');
  }

  getBatchHDById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/BatchHD/getByCondition', data);
  }

  createBatchHD(data: any): Observable<any> {
    return this.repoService.create('api/BatchHD/create', data);
  }

  updateBatchHD(data: any): Observable<any> {
    return this.repoService.update('api/BatchHD/update', data);
  }

  deleteBatchHD(data: any): Observable<any> {
    return this.repoService.delete('api/BatchHD/delete', data);
  }
}

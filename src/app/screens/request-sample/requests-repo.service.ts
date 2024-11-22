import { Injectable } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';
import { RequestsModel } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class RequestsRepoService {

  constructor(
    private repoService: RepositoryService
  ) {

  }

  getRequests(): Observable<any> {
    return this.repoService.getData('api/request/getAll');
  }

  getRequestsById(data: any): Observable<any> {
    //console.log('data =>',data);
    return this.repoService.getDataParm('api/requests/getByCondition', data);
  }

  getRequestByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/requests/getByCondition', data);
  }

  createRequests(data: any): Observable<any> {
    return this.repoService.create('api/requests/create', data);
  }

  saveRequests(data: any): Observable<any> {
    return this.repoService.create('api/requests/save', data);
  }

  updateRequest(data: any): Observable<any> {
    return this.repoService.update('api/requests/update', data);
  }

  deleteRequests(id: any): Observable<any> {
    return this.repoService.delete('api/requests/delete', id);
  }

  getPatientMoreByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/RequestsPatientMore/getByCondition', data);
  }


  getRaceByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/Race/getByCondition', data);
  }

  getRaceByCondition2(data: any): Observable<any> {
    return this.repoService.getDataParm('api/Race/getByCondition2', data);
  }

  getRaceByConditiondoctor(data: any): Observable<any> {
    return this.repoService.getDataParm('api/Race/getRaceByConditiondoctor', data);
  }
  //getPrefixByCondition(data: any): Observable<any> {
  //  return this.repoService.getDataParm('api/Prefix/getByCondition', data);
  //}

  getLabResults(data: any): Observable<any> {
    return this.repoService.getDataParm('api/LabResults/getByCondition', data);
  }

  getGARanges(data: any): Observable<any> {
    return this.repoService.getDataParm('api/EmGAReferenceRange/getByCondition', data);
  }

  checkDuplicateLabNo(labNo: string, lastNo): Promise<any> {
    return this.repoService.getData(`api/requests/checkLabNoDup?labNo=${labNo}&lastNo=${lastNo} `).toPromise();
  }
  queries(data: any): Observable<any> {
    return this.repoService.getDataParm('api/ExecQuery/exec', data);
  }
}

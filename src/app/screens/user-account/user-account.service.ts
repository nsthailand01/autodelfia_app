import { Injectable } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(
    private repoService: RepositoryService
  ) { }

  getAll(): Observable<any> {
    return this.repoService.getData('api/security_users/getAll');
  }

  getByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/security_users/getByCondition', data);
  }

  create(data: any): Observable<any> {
    return this.repoService.create('api/security_users/create', data);
  }

  save(data: any): Observable<any> {
    return this.repoService.save('api/security_users/save', data);
  }

  update(data: any): Observable<any> {
    return this.repoService.update('api/security_users/update', data);
  }

  delete(data: any): Observable<any> {
    return this.repoService.delete('api/security_users/delete', data);
  }

}

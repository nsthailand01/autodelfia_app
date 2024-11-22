import { Injectable } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MpAppSettingsService {

  constructor(
    private repoService: RepositoryService
  ) { }

  getAll(): Observable<any> {
    return this.repoService.getData('api/MPAppSettings/getAll');
  }

  create(data: any): Observable<any> {
    return this.repoService.create('api/MPAppSettings/create', data);
  }

  update(data: any): Observable<any> {
    return this.repoService.update('api/MPAppSettings/update', data);
  }

  delete(data: any): Observable<any> {
    return this.repoService.delete('api/MPAppSettings/delete', data);
  }

  getIdCardInfo(): Observable<any> {
    return this.repoService.getData('api/general/getidcard');
  }

  getLocalAddress(): Observable<any> {
    return this.repoService.getData('api/general/getLocalAddress');
  }

}

import { Injectable } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';
import { MSLabSampleTypeModel, MSSiteModel, MSDepartmentModel, MSSiteGroupModel, MSPositionModel, MSLabGroupModel } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class MasterFileService {

  constructor(
    private repoService: RepositoryService
  ) { }

  getMsProfile(): Observable<any> {
    return this.repoService.getData('api/MSLabProfile/getAll');
  }

  getLabProfileById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSLabProfile/getByCondition', data);
  }

  createLabProfile(data: any): Observable<any> {
    return this.repoService.create('api/MSLabProfile/create', data);
  }

  updateLabProfile(data: any): Observable<any> {
    return this.repoService.update('api/MSLabProfile/update', data);
  }

  getSampleType(): Observable<any> {
    return this.repoService.getData('api/MSLabSampleType/getAll');
  }

  getSampleTypeById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSLabSampleType/getByCondition', data);
  }

  getSampleTypeByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSLabSampleType/getByCondition', data);
  }

  createSampleType(data: any): Observable<any> {
    return this.repoService.create('api/MSLabSampleType/create', data);
  }

  updateSampleType(data: any): Observable<any> {
    return this.repoService.update('api/MSLabSampleType/update', data);
  }

  deleteLabProfile(data: any): Observable<any> {
    return this.repoService.delete('api/MSLabProfile/delete', data);
  }

  deleteSampleTypeById(id: any): Observable<any> {
    return this.repoService.delete('api/MSLabSampleType/delete', id);
  }

  deleteSampleType(data: any): Observable<any> {
    return this.repoService.delete('api/MSLabSampleType/delete', data);
  }

  getDepartment(): Observable<any> {
    return this.repoService.getData('api/MSDepartment/getAll');
  }

  getDepartmentById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSDepartment/getByCondition', data);
  }

  createDepartment(data: any): Observable<any> {
    return this.repoService.create('api/MSDepartment/create', data);
  }

  updateDepartment(data: any): Observable<any> {
    return this.repoService.update('api/MSDepartment/update', data);
  }

  deleteDepartment(data: any): Observable<any> {
    return this.repoService.delete('api/MSDepartment/delete', data);
  }

  getSite(): Observable<any> {
    return this.repoService.getData('api/MSSite/getAll');
  }

  getSiteById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSSite/getByCondition', data);
  }

  createSite(data: any): Observable<any> {
    return this.repoService.create('api/MSSite/create', data);
  }

  updateSite(data: any): Observable<any> {
    return this.repoService.update('api/MSSite/update', data);
  }

  deleteSite(data: any): Observable<any> {
    return this.repoService.delete('api/MSSite/delete', data);
  }

  getSiteGroup(): Observable<any> {
    return this.repoService.getData('api/MSSiteGroup/getAll');
  }

  getSiteGroupById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSSiteGroup/getByCondition', data);
  }

  createSiteGroup(data: any): Observable<any> {
    return this.repoService.create('api/MSSiteGroup/create', data);
  }

  updateSiteGroup(data: any): Observable<any> {
    return this.repoService.update('api/MSSiteGroup/update', data);
  }

  deleteSiteGroup(data: any): Observable<any> {
    return this.repoService.delete('api/MSSiteGroup/delete', data);
  }

  getPosition(): Observable<any> {
    return this.repoService.getData('api/MSPosition/getAll');
  }

  getPositionById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSPosition/getByCondition', data);
  }

  createPosition(data: any): Observable<any> {
    return this.repoService.create('api/MSPosition/create', data);
  }

  updatePosition(data: any): Observable<any> {
    return this.repoService.update('api/MSPosition/update', data);
  }

  deletePosition(data: any): Observable<any> {
    return this.repoService.delete('api/MSPosition/delete', data);
  }

  getLabGroup(): Observable<any> {
    return this.repoService.getData('api/MSLabGroup/getAll');
  }

  getLabGroupById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSLabGroup/getByCondition', data);
  }

  createLabGroup(data: any): Observable<any> {
    return this.repoService.create('api/MSLabGroup/create', data);
  }

  updateLabGroup(data: any): Observable<any> {
    return this.repoService.update('api/MSLabGroup/update', data);
  }

  deleteLabGroup(data: any): Observable<any> {
    return this.repoService.delete('api/MSLabGroup/delete', data);
  }

  getEmployee(): Observable<any> {
    return this.repoService.getData('api/MSEmployee/getAll');
  }

  getEmployeeById(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSEmployee/getByCondition', data);
  }

  createEmployee(data: any): Observable<any> {
    return this.repoService.create('api/MSEmployee/create', data);
  }

  updateEmployee(data: any): Observable<any> {
    return this.repoService.update('api/MSEmployee/update', data);
  }

  deleteEmployee(data: any): Observable<any> {
    return this.repoService.delete('api/MSEmployee/delete', data);
  }

}

import { Injectable } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {

  constructor(
    private repoService: RepositoryService
  ) { }

  get(): Observable<any> {
    return this.repoService.getData('api/ImportExportTemplate/getAll');
  }

  getByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/ImportExportTemplate/getByCondition', data);
  }

  getTemplateDT(data: any): Observable<any> {
    return this.repoService.getDataParm('api/ImportExportTemplate/getTemplateDT', data);
  }

  save(data: any): Observable<any> {
    return this.repoService.create('api/ImportExportTemplate/save', data);
  }

  exportTxt(data: any): Observable<any> {
    return this.repoService.create('api/Requests/exportRequestsToTxt', data);
    // return this.repoService.create('api/FilesManager/exportRequestsToTxt', data);
  }

  importTxt(data: any): Observable<any> {
    return this.repoService.create('api/Requests/importRequestsFromTxt', data);
  }

  filesList(type: string): Observable<any> {
    return this.repoService.getData(`api/FilesManager/files?templateType=${type}`);
  }

  filesList2(data: any): Observable<any> {
    return this.repoService.getDataParm(`api/FilesManager/files-post`, data);
  }

  deleteFile(file: string, type: string): Observable<any> {
    return this.repoService.getData(`api/FilesManager/deleteFile?fileName=${file}&templateType=${type}`);
  }

  deleteFile2(data: any): Observable<any> {
    return this.repoService.getDataParm(`api/FilesManager/deleteFile2`, data);
  }
}

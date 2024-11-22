import { Injectable, Pipe } from '@angular/core';
import { Observable } from 'rxjs';
// import { EmItemEntity, EmJobEntity, EmVatEntity, EmCustomerContactEntity, EmTransport } from '../../entities/em';
// import { RestApiService } from '../../core/services';
import { retry } from 'rxjs/operators';
import { RepositoryService } from '@app/shared/repository.service';
// import { EmCustomerEntity } from '../../entities/em/em-customer.entity';
// import { EmOrgUnitEntity } from '../../entities/em/emorg-unit.entity';
// import { EmitemDto } from '@app/data-transfer/emitem-dto';
// import { EmEmployeeEntity } from '@app/entities/em/em-employee.entity';

@Injectable({
  providedIn: 'root'
})
export class PickerService {

  constructor(private repoService: RepositoryService) { }

  // doLoadItems(item: any): Observable<EmitemDto> {
  //   return this.apiService.post('em/item/getitems', item)
  //     .pipe(
  //       retry(1)
  //     );
  // }

  // doLoadCustomers(item: any): Observable<EmCustomerEntity[]> {
  //   return this.apiService.post('em/customer/getcustomers', item).pipe(retry(1));
  // }

  loadBatch(item: any): Observable<any> {
    return this.repoService.getDataParm('', item)
      .pipe(retry(1));
  }

  loadSampleType(item: any): Observable<any> {
    return this.repoService.getData('api/mslabsampletype/getall').pipe(retry(1));
  }

  loadSampleTypeCondition(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
  }

  loadLabTest(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabtest/getByCondition', item).pipe(retry(1));
  }

  getMSLabProfile(item: any): Observable<any> {
    return this.repoService.getData('api/mslabprofile/getall').pipe(retry(1));
  }

  getLISSentSampleHD(item: any): Observable<any> {
    return this.repoService.getData('api/LISSentSampleHD/getall').pipe(retry(1));
  }

  getLISSentSampleHDByCondition(item: any): Observable<any> {
    return this.repoService.getDataParm('api/LISSentSampleHD/getByCondition', item).pipe(retry(1));
  }

  getAllMSSites(): Observable<any> {
    return this.repoService.getData('api/MSSite/getall').pipe(retry(1));
  }

  getMSSitesByCondition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSSite/getByCondition', data).pipe(retry(1));
  }

  getAllEmployees(): Observable<any> {
    return this.repoService.getData('api/MSEmployee/getall').pipe(retry(1));
  }

  getEmployees(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSEmployee/getByCondition', data).pipe(retry(1));
  }

  getPosition(data: any): Observable<any> {
    return this.repoService.getDataParm('api/MSPosition/getByCondition', data).pipe(retry(1));
  }


  queries(data: any): Observable<any> {
    return this.repoService.getDataParm('api/ExecQuery/exec', data);
  }

}

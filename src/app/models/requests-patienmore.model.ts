import { BaseModel } from './base.model';
export class RequestsPatientMoreModel extends BaseModel {
  uniqueId: string = '';
  requestID: string = null;
  spParmLastRequestID: string = null;
  listNo: number = 1;
  spParmLastListNo: number = null;
  patientMoreID: string = null;
  patientMoreName: string = '';
  value: string = null;
  interpretation: string = null;
  createdBy: string = null;
  createdDate: Date = new Date();
  modifiedBy: string = null;
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  picture: string = null;

  labPatientMoreID: string = '';
  patientMoreCode: string = '';
  patientMoreText: string = '';

  toggle: boolean = false;
  siteCode: string = '';
}

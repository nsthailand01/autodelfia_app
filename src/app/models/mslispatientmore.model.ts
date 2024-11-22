import { BaseModel } from './base.model';
export class MSLISPatientMoreModel extends BaseModel {
  patientID: string = '';
  parameterID: string = null;
  caption: string = '';
  itemOherFlag: string = null;
  items: string = '';
  remark: string = '';
  siteCode: string = '';
}

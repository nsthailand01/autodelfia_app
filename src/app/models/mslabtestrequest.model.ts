import { BaseModel } from './base.model';
export class MSLabTestRequestModel extends BaseModel {
  testID: string = '';
  listNo: number = 1;
  parameterID: string = null;
  parameterCode: string = '';
  testName: string = '';
  testNameEng: string = '';
  satatus: string = '';
  sampleTypeID: number = null;
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  siteID: string = null;
  picture: string = '';
  siteCode: string = '';
}

import { BaseModel } from './base.model';
export class MSLabTestModel extends BaseModel {
  testID: string = '';
  profileID: string = null;
  labGroupID: string = null;
  testCode: string = '';
  testName: string = '';
  testNameEng: string = '';
  days: number = 0;
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

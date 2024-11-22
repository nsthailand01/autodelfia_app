import { BaseModel } from './base.model';
export class MSSystemParameterModel extends BaseModel {
  parameterID: string = '';
  parameterCode: string = '';
  parameterName: string = '';
  parameterNameEng: string = '';
  caption: string = '';
  captionEng: string = '';
  siteID: string = null;
  testID: string = null;
  profileID: string = null;
  mSSystemParameterType: string = '';
  dataType: string = '';
  dataFormat: string = '';
  result: string = '';
  report: string = '';
  remark: string = '';
  isHaveOtherFlag: string = '';
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  siteCode: string = '';
}

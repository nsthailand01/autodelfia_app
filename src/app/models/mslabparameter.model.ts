import { BaseModel } from './base.model';
export class MSLabParameterModel extends BaseModel {
  testID: string = '';
  listNo: number = 1;
  parameterCode: string = '';
  parameterName: string = '';
  parameterNameEng: string = '';
  caption: string = '';
  captionEng: string = '';
  satatus: string = '';
  mSSystemParameterType: string = '';
  dataType: string = '';
  dataFormat: string = '';
  result: string = '';
  report: string = '';
  remark: string = '';
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  siteID: string = null;
  picture: string = '';
  siteCode: string = '';
}

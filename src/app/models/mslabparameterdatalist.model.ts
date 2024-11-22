import { BaseModel } from './base.model';
export class MSLabParameterDataListModel extends BaseModel {
  parameterID: string = '';
  listNo: number = 1;
  refListNo: number = null;
  result: string = '';
  report: string = '';
  remark: string = '';
  siteCode: string = '';
}

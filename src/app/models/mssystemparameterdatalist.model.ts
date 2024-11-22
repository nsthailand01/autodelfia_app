import { BaseModel } from './base.model';
export class MSSystemParameterDataListModel extends BaseModel {
  parameterID: string = '';
  listNo: number = 1;
  result: string = '';
  report: string = '';
  remark: string = '';
}

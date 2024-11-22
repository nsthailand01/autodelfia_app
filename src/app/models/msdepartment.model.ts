import { BaseModel } from './base.model';

export class MSDepartmentModel extends BaseModel {
  deptID: string = '';
  spParmLastDeptID: string = '';
  deptCode: string = '';
  deptName: string = '';
  deptNameEng: string = '';
  siteID: string = null;
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  remark: string = '';
}

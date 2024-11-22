import { BaseModel } from './base.model';
export class MSPositionModel extends BaseModel {
  positionID: string = '';
  spParmLastPositionID: string = '';
  positionCode: string = '';
  positionName: string = '';
  positionNameEng: string = '';
  siteID: string = null;
  siteName: string = '';
  deptID: string = null;
  deptName: string = '';
  parentPositionID: string = null;
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  remark: string = '';
}

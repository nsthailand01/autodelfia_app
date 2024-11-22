import { BaseModel } from './base.model';
export class MSLabGroupModel extends BaseModel {
  labGroupID: string = '';
  spParmLastLabGroupID: string = '';
  labGroupCode: string = '';
  labGroupName: string = '';
  labGroupNameEng: string = '';
  satatus: string = '';
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  siteID: string = null;
  picture: string = '';
  remark: string = '';
}

import { BaseModel } from './base.model';
export class Security_RoleModel extends BaseModel {
  roleID: string = '';
  roleCode: string = '';
  roleName: string = '';
  roleNameEng: string = '';
  siteID: string = null;
  createDate: Date = new Date();
  beginDate: Date = new Date();
  endDate: Date = new Date();
  satatus: string = '';
}

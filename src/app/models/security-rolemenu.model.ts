import { BaseModel } from './base.model';
export class Security_RoleMenuModel extends BaseModel {
  roleID: string = '';
  menuID: number = null;
  viewFlag: string = '';
  newFlag: string = '';
  editFlag: string = '';
  deleteFlag: string = '';
  printFlag: string = '';
  approveFlag: string = '';
}

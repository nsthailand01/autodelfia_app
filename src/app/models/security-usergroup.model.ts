import { BaseModel } from './base.model';
export class Security_UserGroupModel extends BaseModel {
  userGroupID: string = '';
  userGroupCode: string = '';
  userGroupName: string = '';
  userGroupNameEng: string = '';
  satatus: string = '';
  siteID: string = null;
  picture: string = '';
  siteCode: string = '';
}

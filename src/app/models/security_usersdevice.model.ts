import { BaseModel } from './base.model';
export class Security_UsersDeviceModel extends BaseModel {
  userID: string = '';
  listno: number = 1;
  deviceName: string = '';
  deviceModel: string = '';
  deviceIP: string = '';
  createDate: Date = new Date();
  beginDate: Date = new Date();
  endDate: Date = new Date();
  satatus: string = '';
  requistExpireDate: Date = null;
  approveDate: Date = null;
  tokenLogIn: string = '';
  picture: string = '';
}

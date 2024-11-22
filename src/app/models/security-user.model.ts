import { BaseModel } from './base.model';
// tslint:disable-next-line: class-name
export class Security_UsersModel extends BaseModel {
  userID: string = '';
  spParmLastUserID: string = '';
  employeeID: string = null;
  hNID: string = null;
  siteID: string = null;
  userGroupID: string = null;
  userName: string = '';
  userPassword: string = '';
  confirmPassword: string = '';
  email: string = '';
  tel: string = '';
  createDate: Date = new Date();
  beginDate: Date = new Date();
  endDate: Date = new Date();
  userSatatus: string = '';
  userType: string = '';
  isDuplicateLogin: string = '';
  approveby: number = null;
  approveDate: Date = null;
  tokenResetPassword: string = '';
  picture: string = '';
  forDepartureHospital: boolean = false;
  forScienceCenter: boolean = false;
  isReporter: boolean = false;
  isApprover: boolean = false;
  signatureImage: string = '';
  accessToken: string = '';

  siteName: string = '';
  employeeName: string = '';
  officerName: string = '';
}

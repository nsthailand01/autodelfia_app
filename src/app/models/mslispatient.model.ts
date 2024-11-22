import { MSLISPatientMoreModel } from './mslispatientmore.model';
import { BaseModel } from './base.model';

export class MSLISPatientModel extends BaseModel {
  public constructor(init?: Partial<MSLISPatientModel>) {
    super();
    Object.assign(this, init);
  }

  patientID: string = '';
  spParmLastPatientID: string = '';
  patientCode: string = '';  // รหัสคนไข้ของระบบ LIS
  hN: string = ''; // รหัสคนไข้โรงพยาบาล
  title: string = '';
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  nickName: string = '';
  identityCard: string = '';
  titleEng: string = '';
  firstNameEng: string = '';
  middleNameEng: string = '';
  lastNameEng: string = '';
  nickNameEng: string = '';
  sex: string = '';
  maritalStatus: string = '';
  birthday: Date = null;
  height: number = null;
  weight: number = null;
  startDate: Date = new Date();
  endDate: Date = null;
  empSatatus: string = '';
  address: string = '';
  moo: string = '';
  roomNo: string = '';
  floorNo: string = '';
  building: string = '';
  village: string = '';
  lane: string = '';
  street: string = '';
  district: string = '';
  amphur: string = '';
  province: string = '';
  postCode: string = '';
  siteID: string = '';
  siteName: string = '';
  bloodGroups: string = '';
  race: string = '';
  nationality: string = '';
  religion: string = '';
  salary: number = 0;
  empType: string = '';
  createdBy: string = '';
  createdDate: Date;
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  noofSon: number = null;
  noofDaughter: number = null;
  remark: string = '';
  siteCode: string = '';
}

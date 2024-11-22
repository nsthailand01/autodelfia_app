import { BaseModel } from './base.model';

export class PrefixModel extends BaseModel {
  preID: number = null;
  preName: string = '';
  raceLifeCycleCode: number = 52;


  DoctorID: number = null;
  SiteID: string = '';
  DoctorFirstName: string = '';
  DoctorLastName: string = '';
  CreatedDate: Date;
  CreatedBy: string = '';
  UpdateDate: Date;
  UpdateBy: string = ''
  FullName:string = ''    ;
}

//export class DoctorModel extends BaseModel {
//  DoctorID: string = '';
//  SiteID: string = '';
//  DoctorFirstName: string = '';
//  DoctorLastName: string = '';
//  CreatedDate: Date;
//  CreatedBy: string = '';
//  UpdateDate: string = '';
//  UpdateBy: string = '';
//}

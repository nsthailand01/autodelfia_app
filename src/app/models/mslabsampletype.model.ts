import { BaseModel } from './base.model';
export class MSLabSampleTypeModel extends BaseModel {
  sampleTypeID: string = '';
  spParmLastSampleTypeID: string = '';
  sampleTypeCode: string = '';
  sampleTypeName: string = '';
  sampleTypeNameEng: string = '';
  satatus: string = '';
  expireFlag: string = '';
  expireDays: number = 0;
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  siteID: string = '';
  picture: string = '';
  isDefault: boolean = false;
  profileID: string = '';
  profileName: string = '';
  siteCode: string = '';
}

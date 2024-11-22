import { BaseModel } from './base.model';
export class MSLabProfileModel extends BaseModel {
  profileID: string = '';
  spParmLastProfileID: string = '';
  profileCode: string = '';
  labGroupID: string = null;
  profileName: string = '';
  profileNameEng: string = '';
  satatus: string = '';
  days: number = 0;
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  siteID: string = null;
  picture: string = '';
  textCloseExportData: string = '';
  isDefault: boolean = false;

  sampleTypeID: string = '';
  sampleTypeCode: string = '';
  sampleTypeName: string = '';
  sampleTypeDefault: boolean = false;
  siteCode: string = '';
}

import { BaseModel } from './base.model';

export class LISSentSampleHDModel extends BaseModel {
  isSelected: boolean = false;
  sentSampleID: string = '';
  spParmLastSentSampleID: string = '';
  sentSampleNo: string = '';
  sentSampleDate: Date = new Date();
  siteID: string = null;
  siteName: string = '';
  sentToSiteID: string = null;
  numberOFSamples: number = null;
  employeeID: string = null;
  userName: string = '';
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  remark: string = '';

  employeeName: string = '';
  sentToSiteName: string = '';
  numberOfAnalyst: number = null;
  numberOfPregnantToxic: number = null;
  sampleTypeID: string = null;
  sampleTypeName: string = '';
  receiveNo: string = '';
  receiveDate: Date = new Date();
  profileID: string = null;
  profileName: string = null;
  analystDays: number = null;
  dueDate: Date = new Date();
  receiveFlag: string = '1';
  documentStatus: string = '';

  approveCount: number = 0;
  approveProgress: string = 'In Process';

  paymentNo: string = '';
  paymentOther: string = '';
  ownerOfFeverDoctor: string = '';

  requestStatus: string = '';
  modelCheckMode: string = '';
  modelCheckInsert: string = '';
  newStatus: string = '';
  siteCode: string = '';
  requestID: string = '';
}

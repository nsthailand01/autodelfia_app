import { BaseModel } from './base.model';

export class ResultsModel extends BaseModel {
  requestID: string = '';
  listNo: number = null;
  testID: string = '';
  testName: string = '';
  testNameText: string = '';
  value: string = '';
  cORRMOM: string = '';
  cT: string = '';
  results: string = '';
  interpretation: string = '';
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  picture: string = '';
  siteCode: string = '';
}

export class RecalModal extends BaseModel {
  id: number = 0;
  requestsID: string = '';
  labnumber: string = '';
  round: string = '';
  ansValuePlain_AFP: string = '';
  ansValuePlain_HCGB: string = '';
  ansValuePlain_INHIBIN: string = '';
  ansValuePlain_UE3UPD: string = '';
  ansValueCorrMoM_AFP: string = '';
  ansValueCorrMoM_HCGB: string = '';
  ansValueCorrMoM_INHIBIN: string = '';
  ansValueCorrMoM_UE3UPD: string = '';
  riskValueT21: string = '';
  riskValueT18: string = '';
  riskValueT13: string = '';
  riskValueNTD: string = '';
  riskCutOffT21: string = '';
  riskCutOffT18: string = '';
  riskCutOffT13: string = '';
  riskCutOffNTD: string = '';
  riskAssessmentValueT21: string = '';
  riskAssessmentValueT18: string = '';
  riskAssessmentValueT13: string = '';
  riskAssessmentValueNTD: string = '';
  creatDate: Date = new Date();
  analystDate: Date = new Date();
  user_Create: string = '';
}


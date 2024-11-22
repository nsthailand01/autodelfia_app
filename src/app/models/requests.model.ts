import { BaseModel } from './base.model';
import { RequestsPatientMoreModel } from './requests-patienmore.model';

export class RequestsModel extends BaseModel {
  isSelected: boolean = false;
  uniqueId: string = '';
  requestID: string = '';
  spParmLastRequestID: string = '';
  requestCode: string = '';
  externalNo: string = '';
  requestDate: Date = null;
  requestByID: string = null;
  batchID: string = null;
  receiveNo: string = '';
  receiveDate: Date = null;
  shiptoNo: string = '';
  shiptoDate: Date = new Date();
  nonShiptoDateFlag: string = '';
  sampleTypeID: string = null;
  sampleTypeName: string = '';
  sampleTypeCode: string = '';
  profileID: string = null;
  profileName: string = '';
  receiveByID: string = null;
  labNumber: string = '';
  spParmLastLabNumber: string = '';
  sentSampleID: string = null;
  sentSampleNo: string = '';
  sentLabbyID: string = '';
  sentLabTel: string = '';
  price: number = null;
  recieveResultby: string = '';
  patientID: string = null;
  hN: string = '';
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
  startDate: Date = null;
  endDate: Date = new Date();
  dueDate: Date = new Date();
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
  siteID: string = null;
  siteName: string = '';
  bloodGroups: string = '';
  race: string = '';
  nationality: string = '';
  religion: string = '';
  pregnantNo: number = null;
  pregnantFlag: string = '';
  numberofOther: number = null;
  pregnantType: string = '';
  pregnantTypeOther: string = '';
  riskAnalystAgeFlag: string = '';
  gAAgeWeeks: number = null;
  gAAgeDays: number = null;
  gAAgeTotalDays: number = null;
  ultrasoundDate: Date = null;
  ultrasoundFlag: string = '';

  // tslint:disable-next-line: variable-name
  ultrasound_BPD: number = null;
  // tslint:disable-next-line: variable-name
  ultrasound_CRL: number = null;
  lMPWeeks: number = null;
  lMPDays: number = null;
  lMPDate: Date = null;
  // tslint:disable-next-line: variable-name
  ultrasound_NT: number = null;
  // tslint:disable-next-line: variable-name
  ultrasound_UTPI_LUA: number = null;
  // tslint:disable-next-line: variable-name
  ultrasound_UTPI_RUA: number = null;
  bloodPressureDate: Date = new Date();
  bloodPressureLeftSyst1: number = null;
  bloodPressureLeftDiast1: number = null;
  bloodPressureLeftSyst2: number = null;
  bloodPressureLeftDiast2: number = null;
  bloodPressureRightSyst1: number = null;
  bloodPressureRightDiast1: number = null;
  bloodPressureRightSyst2: number = null;
  bloodPressureRightDiast2: number = null;
  sampleDate: Date = null;
  salumIntersectionDate: Date = null;
  savetoNHSOStatus: string = '';
  savetoNHSODate: Date = null;
  savetoNHSOByID: string = '';
  nonSaveToNHSOFlag: string = '';
  nonSaveToNHSORemark: string = '';
  analystDate: Date = null;
  createdBy: string = '';
  createdDate: Date = new Date();
  modifiedBy: string = '';
  isDeleted: number = 0;
  modifiedDate: Date = new Date();
  noofSon: number = null;
  noofDaughter: number = null;
  remark: string = '';
  labAppvFlag: string = '';
  labAppvDate: Date = null;
  labAppvComment: string = '';
  labMGRAppvFlag: string = '';
  labMGRAppvDate: Date = null;
  labMGRAppvComment: string = '';
  doctorAppvFlag: string = '';
  doctorAppvDate: Date = null;
  doctorAppvComment: string = '';
  picture: string = '';
  requestStatus: string = '';
  phoneNo: string = '';
  isExported: boolean = false;
  exportedDate: Date = null;
  isImported: boolean = false;
  importedDate: Date = null;
  paymentFlag: string = '';
  paymentNo: string = '';
  paymentOther: string = '';

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

  riskAssessmentValueT21_2: string = '';
  riskAssessmentValueT18_2: string = '';
  riskAssessmentValueT13_2: string = '';
  riskAssessmentValueNTD_2: string = '';



  cD1AgeAtDeliveryDate: Date = null;
  cD1DeliveryDate: Date = null;
  cD1AgeAtExtraction: string = '';
  sD1GestAtSampleDate: string = null;
  uSSD1GestAtSampleDate: string = null;
  riskAgeT21: string = '';
  riskEnumValueTwinT21: string = '';
  riskValueTwinT21: string = '';
  riskAgeT18: string = '';
  riskEnumValueTwinT18: string = '';
  riskValueTwinT18: string = '';
  riskAgeNTD: string = '';
  riskValueTwinNTD: string = '';
  riskValueTwin1TNTD: string = '';
  riskAgeT13: string = '';
  riskEnumValueTwinT13: string = '';
  riskValueTwinT13: string = '';

  numberOFSamples: number = 1;
  fullName: string = '';
  inputPercentage: number = 0;

  inputCompleted: boolean = true;

  patientMoreForms: any = null;

  hpvReceiveStatus: boolean = false;
  hpvPostToCxs2020Status: boolean = false;

  labTestDate: Date = null;
  labResultDate: Date = null;
  labStaff: string = '';
  labResult: string = '';

  ownerOfFeverDoctor: string = '';  // หมอเจ้าของไข้
  artificialInseminationFlag: string = '';    // ตั้งครรภ์จากการผสมเทียม
  artificialInseminationValue: string = '';
  ovumCollectDate: Date = null;
  embryoTransferDate: Date = null;
  donorBirthdate: Date = null;

  bloodDrawingTime: string = ''; // เวลาเจาะเลือด
  serumSeparateTime: string = ''; // เวลาแยกซีรั่ม

  raceLifeCycleCode: number = 52;

  // postToCxsStatus: boolean = false;
  reportDate: Date = null;
  reportNo: string = '';
  reportBy: string = '';
  sentReportNo: string = '';
  sentReportDate: Date = null;
  sentNo: string = '';
  approveByID: string = null;
  reportByID: string = null;

  sampleStyle: string = 'ปกติ';

  resultType: string = '';  // NIPT or Quad
  fetalSex: string = '';  // เพศของทารก
  riskResultT21Downs: string = ''; // ผลการประเมินความเสี่ยง Trisomy 21 (Down's Syndrome)
  riskResultT18Edwards: string = ''; // ผลการประเมินความเสี่ยง Trisomy 18 (Edward's Syndrome)
  riskResultT13Patau: string = ''; // ผลการประเมินความเสี่ยง Trisomy 13 (Patau Syndrome)
  riskValueT21Downs: string = ''; // ค่าความเสี่ยง T21 Downs
  riskValueT18Edwards: string = ''; // ค่าความเสี่ยง T18 Edwards
  riskValueT13Patau: string = ''; // ค่าความเสี่ยง T13 Patau
  riskCutOffT21Downs: string = '';  // ค่า Cut-Off ความเสี่ยง T21 Downs
  riskCutOffT18Edwards: string = '';  // ค่า Cut-Off ความเสี่ยง T18 Edwards
  riskCutOffT13Patau: string = '';  // ค่า Cut-Off ความเสี่ยง T13 Patau
  riskResultZScoreT21: string = ''; // Z-Score T21 result
  riskResultZScoreT18: string = ''; // Z-Score T18 result
  riskResultZScoreT13: string = ''; // Z-Score T13 result
  riskValueZScoreT21: string = '';  // Z-Score T21
  riskValueZScoreT18: string = '';  // Z-Score T18
  riskValueZScoreT13: string = '';  // Z-Score T13
  riskCutOffZScoreT21: string = ''; // Cut-off Z-score T21
  riskCutOffZScoreT18: string = ''; // Cut-off Z-score T18
  riskCutOffZScoreT13: string = ''; // Cut-off Z-score T13
  chromeT21Value: string = '';
  chromeT18Value: string = '';
  chromeT13Value: string = '';
  chromeT21SD: string = '';
  chromeT18SD: string = '';
  chromeT13SD: string = '';

  amnioticDate: Date = null;
  amnioticLab: string = '';
  amnioticGAWeek: number = null;
  amnioticGADays: number = null;
  amnioticAnalysTechnique: string = '';
  amnioticOtherTechnique: string = '';
  amnioticChromosomeAbnormal: string = '';
  amnioticOtherAbnormal: string = '';
  amnioticMiscarriage: string = 'Not Specified';
  amnioticAnalysisReportFile: string = '';
  amnioticLatestFileName: string = '';
  amnioticRecorder: string = '';
  amnioticPhoneNo: string = '';
  amnioticPhysicalFileName: string = '';
  amnioticPhysicalLatestFileName: string = '';
  fileToUpload: File = null;

  // NIPT
  niptGAAgeTotalDays: number = null;
  niptGAAgeWeeks: number = null;
  niptGAAgeDays: number = null;
  niptTestValueChrT21: number = null;
  niptTestValueChrT18: number = null;
  niptTestValueChrT13: number = null;
  niptSDChrT21: number = null;
  niptSDChrT18: number = null;
  niptSDChrT13: number = null;

  //palm
  passport: string = '';

  fullNameEmp: string = '';
  positionName: string = '';
  userName: string = '';
  makeStatus: string = '';


  slpayment: string = '';
  fromCreateDate: Date = null;
  toCreateDate: Date = null;
  hdtestfunction: string = '';
  modelCheckMode: string = '';
  modelCheckInsert: string = 'EditProcess';
  newStatus: string = '';


  ////This NewFunction
  shipmentNo: string = null;
  sampleType: string = 'Paper';
  filterPaperCompleteness: string = '';
  receiptRemark: string = null;
  refuseName: string = '';
  refuseValue: number = null;
  runPrefix: string = '';
  requests_Recal: string = '';
  hdInvoiceApi: string = '';
  //palm
}

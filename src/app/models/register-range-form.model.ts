export class RegisterRangeFormModel {
  siteID: string = '';
  siteCode: string = '';
  siteName: string = '';

  fromSentSampleDate: Date = null;
  toSentSampleDate: Date = null;
  fromSentSampleNo: string = '';
  toSentSampleNo: string = '';
  fromSampleNo: string = '';
  toSampleNo: string = '';
  fromLabNumber: string = '';
  toLabNumber: string = '';
  trackingNo: string = '';
  fromTrackingNo: string = '';
  toTrackingNo: string = '';
  momHn: string = '';
  hN: string = '';
  momIdCardNo: string = '';
  identityCard: string = '';
  momPassportNo: string = '';
  passportNo: string = '';
  documentStatus: string = 'Draft';
  dateRangeSelectedValue: string = '';

  fromReceiveDate: Date = null;
  toReceiveDate: Date = null;

  fromShiptoDate: Date = null;
  toShiptoDate: Date = null;

  fromBirthday: Date = null;
  toBirthday: Date = null;

  fromReceiveSampleDate: Date = null;
  toReceiveSampleDate: Date = null;
  nationality: string = null;
  hdInvoiceApi: string = '';

}

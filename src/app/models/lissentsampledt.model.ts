import { BaseModel } from './base.model';

export class LISSentSampleDTModel extends BaseModel {
  sentSampleID: string = '';
  spParmLastSentSampleID: string = '';
  listNo: number = 1;
  testID: string = null;
  profileID: string = null;
  numberOFSamples: number = 1;
  remark: string = '';
  siteCode: string = '';
}

import { BaseModel } from './base.model';

export class EmGAReferenceRangeModel extends BaseModel {
  gAID: number;
  analystType: string;
  start_mm: number;
  end_mm: number;
  gAWeeks: number;
  gADays: number;
  totalDays: number;
  privilege: string;
  siteCode: string = '';
}

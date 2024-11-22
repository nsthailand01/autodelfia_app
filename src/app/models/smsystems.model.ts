import { BaseModel } from './base.model';
export class SMSystemsModel extends BaseModel {
  systemID: number = null;
  systemOrder: number = null;
  systemCode: string = '';
  systemName: string = '';
  systemNameEng: string = '';
  isVisible: string = '1';
  picture: string = '';
}

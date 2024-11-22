import { BaseModel } from './base.model';
export class SMMenusModel extends BaseModel {
  menuID: number = null;
  moduleID: number = null;
  menuOrder: number = null;
  menugroup: number = null;
  menuCode: string = '';
  menuName: string = '';
  menuNameEng: string = '';
  isVisible: string = '';
  webObject: string = '';
  wINObject: string = '';
  picture: string = '';
  menuType: string = '';
}

import { BaseModel } from './base.model';
export class SMModulesModel extends BaseModel {
  moduleID: number = null;
  moduleOrder: number = null;
  moduleCode: string = '';
  moduleName: string = '';
  moduleNameEng: string = '';
  isVisible: string = '';
  moduleFlag: string = '';
  picture: string = '';
  systemID: number = null;
  orders: number = null;
  parentModuleID: number = null;
  level: number = null;
}

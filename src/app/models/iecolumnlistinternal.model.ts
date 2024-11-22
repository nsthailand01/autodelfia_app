import { BaseModel } from './base.model';

export class IEColumnListInternalModel extends BaseModel {
  internalTemplateID: string = '';
  listNo: number = 1;
  schemaName: string = 'dbo';
  tableName: string = '';
  columnName: string = '';
  columnDataType: string = '';
  displayText: string = '';
  category: string = '';
}

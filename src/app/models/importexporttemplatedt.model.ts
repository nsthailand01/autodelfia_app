import { BaseModel } from './base.model';

export class ImportExportTemplateDTModel extends BaseModel {
  templateID: string = '';
  spParmLastTemplateID: string = null;
  listNo: number = null;
  spParmLastListNo: number = null;
  listOrder: number = null;
  schemaName: string = '';
  internalColumnName: string = '';
  internalTableName: string = '';
  externalColumnName: string = '';
  externalTableName: string = '';
}

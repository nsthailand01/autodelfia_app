import { BaseModel } from './base.model';

export class ImportExportTemplateHDModel extends BaseModel {
  templateID: string = '';
  spParmLastTemplateID: string = '';
  templateName: string = '';
  templateType: string = '';
  columnDelimiter: string = '';
  fileEncoding: string = '';
  headerRow: number = 0;
  firstDataRow: number = 0;
  importExportPath: string = '';
  textCloseExportData: string = '';

  profileID: string = '';
  profileCode: string = '';
  profileName: string = '';
}

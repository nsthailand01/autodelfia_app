export class BaseModel {
  objectState: number = 1;
  isNew: boolean = true;
  appCode: string = 'down';

  rowVersion: number = 1;

  isEdit: boolean = false;
}

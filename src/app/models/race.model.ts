import { BaseModel } from './base.model';

export class RaceModel extends BaseModel {
  raceID: number = null;
  raceCode: string = '';
  raceName: string = '';
  raceLifeCycleCode: number = 52;
}

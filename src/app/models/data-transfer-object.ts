import { MSLabProfileModel } from './mslabprofile.model';
import { MSDepartmentModel } from './msdepartment.model';
import {
  MSLISPatientModel, MSLISPatientMoreModel, BatchHDModel,
  MSSiteModel, MSSiteGroupModel, MSPositionModel,
  MSLabGroupModel, Security_UsersModel
} from '.';
import { RequestsModel } from './requests.model';
import { MSLabSampleTypeModel } from './mslabsampletype.model';
import { LISSentSampleHDModel } from './lissentsamplehd.model';
import { LISSentSampleDTModel } from './lissentsampledt.model';
import { RequestsPatientMoreModel } from './requests-patienmore.model';
import { ImportExportTemplateHDModel } from './importexporttemplatehd.model';
import { ImportExportTemplateDTModel } from './importexporttemplatedt.model';
import { MSEmployeeModel } from './msemployee.model';

export interface PatientDTO {
  [x: string]: any;
  MSLISPatients: Array<MSLISPatientModel>;
  PatientMores: Array<MSLISPatientMoreModel>;
}

export interface RequestsDTO {
  [x: string]: any;
  Requests: Array<RequestsModel>;
  RequestsPatientMores: Array<RequestsPatientMoreModel>;
}

export interface BatchHDDTO {
  [x: string]: any;
  BatchHDs: Array<BatchHDModel>;
  Requests: Array<RequestsModel>;
}

export interface LabProfileDTO {
  [x: string]: any;
  MSLabProfiles: Array<MSLabProfileModel>;
}

export interface SampleTypeDTO {
  [x: string]: any;
  MSLabSampleTypes: Array<MSLabSampleTypeModel>;
}

export interface DepartmentDTO {
  [x: string]: any;
  MSDepartments: Array<MSDepartmentModel>;
}

export interface MSSiteDTO {
  [x: string]: any;
  MSSites: Array<MSSiteModel>;
}

export interface MSEmployeeDTO {
  [x: string]: any;
  MSEmployees: Array<MSEmployeeModel>;
}

export interface MSSiteGroupDTO {
  [x: string]: any;
  MSSiteGroups: Array<MSSiteGroupModel>;
}

export interface MSPositionDTO {
  [x: string]: any;
  MSPositions: Array<MSPositionModel>;
}

export interface MSLabGroupDTO {
  [x: string]: any;
  MSLabGroups: Array<MSLabGroupModel>;
}

export interface SentSampleDTO {
  [x: string]: any;
  LISSentSampleHDs: Array<LISSentSampleHDModel>;
  LISSentSampleDTs: Array<LISSentSampleDTModel>;
  Requests: Array<RequestsModel>;
  RequestsPatientMores: Array<RequestsPatientMoreModel>;
}

export interface SecurityUsersDTO {
  [x: string]: any;
  Security_Users: Array<Security_UsersModel>;
}

export interface ImportExportTemplateDTO {
  [x: string]: any;
  ImportExportTemplateHDs: Array<ImportExportTemplateHDModel>;
  ImportExportTemplateDTs: Array<ImportExportTemplateDTModel>;
}

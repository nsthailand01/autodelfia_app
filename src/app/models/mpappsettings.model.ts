import { BaseModel } from "./base.model";

export class MpAppSettingsModel extends BaseModel {
    id: number = null;
    autoLogoutInMinutes: number = 5;
    confirmPasswordOnApprove: string = 'N';
    requireApproveRemark: string = 'N';
    allowSentWhenIncomplete: string = 'N';

    reportApproverOption: string = 'ByLogin';        // [ByLogin, ByUser]
}
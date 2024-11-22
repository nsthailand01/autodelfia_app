export class ExportPatientModel {
    ListNo?: number = null;             // ลำดับรายการ
    RequestStatus?: string = null;      // สถานะ
    ReceiptRemark?: string = null;      // 
    RC?: string = null;                 // RC
    CreatedDate?: Date = null;          // วันที่บันทึก
    ShiptoDate?: Date = null;          // วันที่สร้างใบนำส่ง
    ReceiveDate?: Date = null;          // วันที่รับตัวอย่าง
    ShipmentNo?: string = null;         // เลขที่จัดส่ง
    SampleNo?: string = null;           // เลขที่ตัวอย่าง
    SiteName?: string = null;           // หน่วยงาน
    FirstName?: string = null;          // ชื่อ มารดา
    LastName?: string = null;           // นามสกุล มารดา
    IdentityCard?: string = null;       // บัตรประชาชน มารดา
    BabeTwinNo?: number = null;         // แฝดลำดับที่
    SendTestTimes?: number = null;      // ส่งตรวจครั้งที่
    BabeHn?: string = null;             // Hn บุตร
    BabeFirstName?: string = null;      // ชื่อบุตร
    BabeLastName?: string = null;       // สกุลบุตร
    BabeIdCardNo?: string = null;       // บัตรประชาชนบุตร
    MomMobileNo?: string = null;        // เบอร์โทรศัพท์
    NN?: string = null;                 // Hn มารดา
  TrackingNo?: string = null;         // หมายเลขการติดตาม




  สถานะ?: string = null;
  วันที่บันทึก?: Date = null;
  วันที่เจาะเลือด?: Date = null;
  วันที่รับตัวอย่าง?: Date = null;
  เลขที่ใบนำส่ง?: string = null;
  เลขที่ตัวอย่าง?: string = null;
  หน่วยงานส่งตรวจ?: string = null;
  ชื่อ_สกุล?: string = null;
  HN?: string = null;
  บัตรประชาชน?: string = null;
  เบอร์โทรศัพท์?: string = null;

    constructor(args?: Partial<ExportPatientModel>) {
        if (args) {
            // this.ListNo = args.ListNo;
            this.RequestStatus = args.RequestStatus;
        }
    }
}

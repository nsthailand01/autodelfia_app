import { PatientRegisterRangeComponent } from '../patient-register-range/patient-register-range.component';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LISSentSampleHDModel, MSLabProfileModel, MSLabSampleTypeModel, MSSiteModel, RequestsModel, LISSentSampleDTModel, SentSampleDTO, RequestsDTO } from '@app/models';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { UtilitiesService, AuthenticationService, ToastrNotificationService } from '@app/services';
import { DatePipe } from '@angular/common';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmployeePickerComponent, MslabProfilePickerComponent, MssitePickerComponent, SampleTypePickerComponent, SentSamplehdPickerComponent } from '@app/pickers';
//import { LabnumberPickerComponent } from '@app/pickers/labnumber-picker/labnumber-picker.component';
import { LabnumberPickerComponent } from '@app/pickers/labnumber-picker/labnumber-picker.component';
import { Observable, of, range } from 'rxjs';
import { retry } from 'rxjs/operators';
import { RepositoryService } from '@app/shared/repository.service';
import Swal from 'sweetalert2';
import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
import { Guid } from 'guid-typescript';
import { Router, Data } from '@angular/router';
import { ConfigLoaderService } from '@app/services/config-loader/config-loader.service';
import { ToastrService } from 'ngx-toastr';
import { SamplesListTabComponent } from '../samples-list-tab/samples-list-tab.component';
import { RegisterRangeFormModel } from '@app/models/register-range-form.model';
import { guid } from '@devexpress/analytics-core/analytics-internal';
import { MpAppSettingsService } from '@app/screens/app-settings/mp-app-settings.service';
import { MpAppSettingsModel } from '@app/models/mpappsettings.model';
import { viLocale } from 'ngx-bootstrap/chronos';
import { ExcelService } from '@app/services/excel.service';
import { ExportPatientModel } from '@app/models/export.patient.model';

// import * as $ from 'jquery';

declare var $: any;
// import * as $ from 'jquery';

// import $ from 'jquery';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.scss']
})
export class PatientCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('range') range: PatientRegisterRangeComponent;
  @ViewChild('samplesTab') samplesTab: SamplesListTabComponent;
  @ViewChild('printOptionRef') printOptionRef: ElementRef;
  @ViewChild('shiptoNoControl') shiptoNoControl;
  @ViewChild('warningAlertRef') warningAlertRef: TemplateRef<any>;
  @ViewChild('createShipmentTemplate', { static: true, read: TemplateRef }) createShipmentTemplate: TemplateRef<unknown>;


  clsnone: string = '';
  toastAlertRef: any;
  private sentSampleDto: SentSampleDTO;
  private requestsDTO: RequestsDTO;
  //private requestsDTO: RequestsDTO;
  public requestLists: Array<RequestsModel>;
  public requestModel: RequestsModel;
  //public requestsForm: FormGroup;
  public sentSampleForm: FormGroup;   // form สำหรับลงทะเบียน รายการในตาราง
  public printBarcodeForm: FormGroup;
  rangeForm: FormGroup;
  public exportNhsoRangeForm: FormGroup;
  public dataSource = new MatTableDataSource<RequestsModel>();
  public sentSampleLists: LISSentSampleHDModel[] = [];
  modalRef: BsModalRef;
  modalRefWarningAlert: BsModalRef;
  // itemSelection = new SelectionModel<any>(true, []);
  createRequestSelected: Array<RequestsModel>;
  shiptoNoToPrint: string = '';

  forProvincialPublicHealth: boolean = false;
  CheckInsert: string = '';
  modelCheckInsert: string = '';
  resParameter: string = '';

  public isDeliveryByThaiPost = false;

  public currentSampleToPrint: LISSentSampleHDModel;

  sampleTypes = [
    { value: 'Paper', text: 'กระดาษ' },
    { value: 'Serum', text: 'ซีรั่ม' },
  ];

  paperResults = [
    { value: '1', text: 'กระดาษซับสภาพสมบูรณ์ (ปกติ)' },
    { value: '2', text: 'กระดาษซับเลือดที่มีหยดเลือดช้ำ (ผิดปกติ)' },
    { value: '3', text: 'กระดาษซับเลือดที่มีวงเลือดชนกัน (ผิดปกติ)' },
    { value: '4', text: 'กระดาษซับเลือดที่ถูกสัตว์/แมลงกัดแทะ (ผิดปกติ)' },
    { value: '5', text: 'กระดาษซับเลือดที่มีการปนเปื้อน (ผิดปกติ)' },
    { value: '6', text: 'กระดาษซับเลือดที่ขึ้นรา (ผิดปกติ)' },
    { value: '7', text: 'กระดาษซับเลือดที่เลือดไม่ซึม (ผิดปกติ)' },
  ];

  defaultValue = {
    siteID: '',
    siteName: '',
    deliveryByThaiPost: 'N',
    userName: '',
    officerName: '',
    userTel: '',
    employeeID: '',
    employeeName: '',
    sentToSiteID: '',
    sentToSiteName: '',
    forScienceCenter: false,
    deliveryAppointLocation: ''
  };

  ssoRights = [
    { value: 'หลักประกันสุขภาพแห่งชาติ (UC)', text: 'หลักประกันสุขภาพแห่งชาติ (UC)' },
    { value: 'สิทธิจ่ายตรง (non UC)', text: 'สิทธิจ่ายตรง (non UC)' },
    { value: 'สิทธิชำระเงินเอง', text: 'สิทธิชำระเงินเอง' },
  ]

  private siteInfo = {
    siteName: '',
    siteAddress: '',

    shipperAddress: '',
    shipperDistrict: '',
    // siteAmphur: '',
    shipperProvince: '',
    shipperZipcode: '',
    shipperMobile: '',

    siteFloorNo: '',
    siteBuilding: '',
    siteRunPrefix: '',

    cusName: '',
    cusAddress: '',
    cusDistrict: '',
    cusProvince: '',
    cusZipCode: '',
    cusTel: '',
    custRemark: '',
  }

  runPrefix: string = '';
  public isDeleted = false;
  cldiv1: string = 'd-none';
  clCheckHospital: string = 'd-none';
  clCheckHospital2: string = 'd-none';
  //Checkreadonly: string = 'true';
  Checkreadonly: boolean;
  printPageConfig: any;
  appSettingsModel: MpAppSettingsModel = {} as MpAppSettingsModel;
  inputCompleted: boolean = false;
  disabledSentSample: boolean = false;
  forDepartureHospital: boolean = false;
  forScienceCenter: boolean = false;
  isReporter: boolean = false;
  isApprover: boolean = false;
  selectedpayment: string;

  eventResult: RegisterRangeFormModel;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private localeService: BsLocaleService,
    private utilService: UtilitiesService,
    private authService: AuthenticationService,
    public datepipe: DatePipe,
    private sentSampleService: SentSampleService,
    private requestsRepoService: RequestsRepoService,
    private repoService: RepositoryService,
    private notiService: ToastrNotificationService,
    private configLoaderService: ConfigLoaderService,
    private excelService: ExcelService,
    // protected toastrNotiService: ToastrService,
    private appSettingsService: MpAppSettingsService,

  ) {
    super();

    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.defaultValue.userName = user.data.SecurityUsers.UserName;
        this.defaultValue.officerName = user.data.SecurityUsers.OfficerName;
        this.defaultValue.userTel = user.data.SecurityUsers.Tel;
        this.defaultValue.siteID = user.data.SecurityUsers.SiteID;
        this.defaultValue.siteName = user.data.SecurityUsers.SiteName;
        this.defaultValue.deliveryByThaiPost = user.data.SecurityUsers.DeliveryByThaiPost;
        this.defaultValue.employeeID = user.data.SecurityUsers.EmployeeID;
        this.defaultValue.employeeName = user.data.SecurityUsers.EmployeeName;
        this.defaultValue.sentToSiteID = user.data.SecurityUsers.ParentSiteID;
        this.defaultValue.sentToSiteName = user.data.SecurityUsers.ParentSiteName;
        this.defaultValue.forScienceCenter = user.data?.SecurityUsers?.ForScienceCenter;
        this.defaultValue.deliveryAppointLocation = user.data?.SecurityUsers?.DeliveryAppointLocation;

        this.runPrefix = user.data.SecurityUsers.RunPrefix ?? '';

        this.siteInfo.siteName = user.data.SecurityUsers.SiteName ?? '';
        this.siteInfo.siteAddress = user.data.SecurityUsers.SiteAddress ?? '';
        // this.siteInfo.siteDistrict = user.data.SecurityUsers.SiteDistrict ?? '';
        this.siteInfo.shipperDistrict = user.data.SecurityUsers.SiteAmphur ?? '';
        this.siteInfo.shipperProvince = user.data.SecurityUsers.SiteProvince ?? '';
        this.siteInfo.shipperZipcode = user.data.SecurityUsers.SitePostCode ?? '';
        this.siteInfo.shipperMobile = user.data.SecurityUsers.SiteTel ?? '';
        this.siteInfo.siteFloorNo = user.data.SecurityUsers.SiteFloorNo ?? '';
        this.siteInfo.siteBuilding = user.data.SecurityUsers.SiteBuilding ?? '';
        this.siteInfo.siteRunPrefix = user.data.SecurityUsers.RunPrefix ?? '';

        this.siteInfo.shipperAddress = user.data.SecurityUsers.ShipperAddress ?? '';
        this.siteInfo.cusName = user.data.SecurityUsers.CusName ?? '';
        this.siteInfo.cusAddress = user.data.SecurityUsers.CusAddress ?? '';
        this.siteInfo.cusDistrict = user.data.SecurityUsers.CusDistrict ?? '';
        this.siteInfo.cusProvince = user.data.SecurityUsers.CusProvince ?? '';
        this.siteInfo.cusZipCode = user.data.SecurityUsers.CusZipCode ?? '';
        this.siteInfo.cusTel = user.data.SecurityUsers.CusTel ?? '';
        this.siteInfo.custRemark = user.data.SecurityUsers.CustRemark ?? '';
      }

      //console.log('user => ', user?.data?.SecurityUsers);
      //console.log('site-info => ', this.siteInfo);

      this.printPageConfig = {
        itemsPerPage: 15,
        currentPage: 1,
        totalItems: this.items.count
      };

      // console.log('this.defaultValue => ', this.defaultValue);
      this.loadSettings();
    });
  }

  loadSettings = () => {
    this.appSettingsService.getAll()
      .subscribe(res => {
        console.log('res => ', res);
        this.appSettingsModel = new MpAppSettingsModel();
        if (res.data.MpAppSettings.length > 0) {
          const response = this.utilService.camelizeKeys(res.data.MpAppSettings[0]);
          this.appSettingsModel = Object.assign({}, response);
        }

        console.log('this.appSettingsModel => ', this.appSettingsModel);

        // MINUTES_UNITL_AUTO_LOGOUT = this.appSettingsModel.autoLogoutInMinutes;
        // this.counter = MINUTES_UNITL_AUTO_LOGOUT * 60;
        // console.log('MINUTES_UNITL_AUTO_LOGOUT => ', MINUTES_UNITL_AUTO_LOGOUT);
      })
  }

  canDeactivate(): Observable<boolean> | boolean {
    setTimeout(() => this.toastrNotiService.clear(), 1000);
    return of(true);
  }

  ngAfterViewInit(): void {
    this.shiptoNoControl?.first?.nativeElement.focus();
  }

  ngOnInit(): void {

  

    //console.log('this.requestLists => ', this.requestLists);
    this.doLoadSample2();
    //let profile = {
    //  sqlSelect: ``,
    //  sqlWhere: `it.IsDefault = 1`
    //};
    //const labProfile = await this.getMSLabProfile(profile).toPromise();
    //const profiles = this.utilService.camelizeKeys(labProfile.data);
    //console.log('profiles => ', profiles);



    //////เก็บไว้ก่อน
    ////this.doSetDefault();



    //const profiles = this.utilService.camelizeKeys(labProfile?.data?.MSLabProfiles);
    //if (profiles.length > 0) {
    //  this.sentSampleForm.get('profileID')?.patchValue(profiles[0].profileID);
    //  this.sentSampleForm.get('profileName')?.patchValue(profiles[0].profileName);
    //}
    //this.doSearchData(null);

    this.createInitialForm();
    this.applySampleRequest(null);

    this.selectedpayment = 'SSOPayment';

    //$('#input-siteName').prop('readonly', true);
    //$('#input-siteName').attr('readonly', true);
  



    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.forDepartureHospital = user.data?.SecurityUsers?.ForDepartureHospital;
        this.forScienceCenter = user.data?.SecurityUsers?.ForScienceCenter;
        this.isReporter = user.data?.SecurityUsers?.IsReporter;
        this.isApprover = user.data?.SecurityUsers?.IsApprover;
        console.log('this.forDepartureHospital => ', this.forDepartureHospital);
        if (this.forDepartureHospital == true) {
          this.cldiv1 = "";

          
        }
        if (this.forDepartureHospital == true && this.forScienceCenter == false && this.isReporter == false && this.isApprover == false) {
          this.clsnone = "d-none";
        }


     
      }
    });




   

    this.sentSampleForm.patchValue({
      // userName: this.defaultValue.userName,
      siteID: this.defaultValue.siteID,
      siteName: this.defaultValue.siteName,
      deliveryByThaiPost: this.defaultValue.deliveryByThaiPost,
      // employeeID: this.defaultValue.employeeID,
      // employeeName: this.defaultValue.employeeName,
      sentToSiteID: this.defaultValue.sentToSiteID,
      sentToSiteName: this.defaultValue.sentToSiteName,
      //employeeName: 
    });
    //console.log('siteID => ', this.defaultValue.siteID);
    this.isDeliveryByThaiPost = this.defaultValue.deliveryByThaiPost == 'Y' ? true : false;

    const isDelivery = this.sentSampleForm.get('deliveryByThaiPost');
    isDelivery?.valueChanges.subscribe(async (value: any) => {
      this.isDeliveryByThaiPost = (value && value == 'Y') ? true : false;

      if (this.isDeliveryByThaiPost) {
        if (!this.sentSampleForm.get('trackingNo').value) {
          // await this.getEmsTrackingNo();   // ยกเลิกการ get อัตโนมัติ
        }
      } else {
        this.sentSampleForm.patchValue({
          trackingNo: ``
        });
      }
    });





    this.exportNhsoRangeForm = this.fb.group({
      fromCreateDate: [''],
      toCreateDate: [''],
      nationality: ['all'],
      slpayment: [''],
      siteName: this.defaultValue.siteName,
      siteID: this.defaultValue.siteID,
      //siteName: this.defaultValue.siteName,
    });


    //this.doLoadSample();
    //this.ReturnResultListRequests();

  }



  doSetDefault = async () => {
    let profile = {
      sqlSelect: ``,
      sqlWhere: `it.IsDefault = 1`
    };

    const labProfile = await this.getMSLabProfile(profile).toPromise();
    const profiles = this.utilService.camelizeKeys(labProfile?.data?.MSLabProfiles);
    if (profiles.length > 0) {
      this.sentSampleForm.get('profileID')?.patchValue(profiles[0].profileID);
      this.sentSampleForm.get('profileName')?.patchValue(profiles[0].profileName);
    }

    profile = {
      sqlSelect: ``,
      sqlWhere: `it.ProfileID = '${this.sentSampleForm.get('profileID').value}' And it.IsDefault = 1 `
    };

    this.getMSLabSampleType(profile)
      .subscribe((response) => {
        response = this.utilService.camelizeKeys(response);
        const sampleTypes: MSLabSampleTypeModel[] = response.data.mSLabSampleTypes;
        if (sampleTypes.length > 0) {
          this.sentSampleForm.get('sampleTypeID')?.patchValue(sampleTypes[0].sampleTypeID);
          this.sentSampleForm.get('sampleTypeName')?.patchValue(sampleTypes[0].sampleTypeName);
        }
      }, (err) => {
        console.log('set default error >> ', err);
      });
  }



  isInputCompleted = (item: RequestsModel) => {

    //console.log('item.inputCompleted => ', item.inputCompleted);
    //console.log('sssss');

    // ข้อมูลหญิงตั้งครรภ์
    let completed = ((item.title) ? true : false) && ((item.firstName) ? true : false)
      //&& ((item.lastName) ? true : false) && ((item.race) ? true : false) && ((item.identityCard) ? true : false)
      && ((item.lastName) ? true : false) && ((item.race) ? true : false)
      && ((item.birthday) ? true : false) && ((item.weight) ? true : false);

    // ประวัติการตั้งครรภ์
    completed = (completed) && ((item.pregnantNo) ? true : false);
    completed = (completed) && ((item.pregnantFlag) ? true : false);
    if (item.pregnantFlag == '0') {
      completed = (completed) && ((item.numberofOther) ? true : false);
    }

    // อายุครรภ์
    if (item.riskAnalystAgeFlag == 'ULT') {
      completed = (completed) && ((item.ultrasoundDate) ? true : false);
      if (item.ultrasoundFlag == 'BPD') {
        completed = (completed) && ((item.ultrasound_BPD) ? true : false);
      } else if (item.ultrasoundFlag == 'CRL') {
        completed = (completed) && ((item.ultrasound_CRL) ? true : false);
      }
    } else if (item.riskAnalystAgeFlag == 'GA') {
      completed = (completed) && ((item.gAAgeWeeks) ? true : false) || ((item.gAAgeDays) ? true : false);
    } else if (item.riskAnalystAgeFlag == 'LMP') {
      completed = (completed) && ((item.lMPDate) ? true : false);
    }

    // การบันทึกข้อมูล สปสช.
    if (item.savetoNHSOStatus == 'Yes') {
      completed = (completed) && ((item.savetoNHSODate) ? true : false) && ((item.savetoNHSOByID) ? true : false);
    } else if (item.savetoNHSOStatus == 'No') {
      completed = (completed) && ((item.nonSaveToNHSOFlag) ? true : false);
      if (item.nonSaveToNHSOFlag == 'Other') {
        completed = (completed) && ((item.nonSaveToNHSORemark) ? true : false);
      }
    }

    // การชำระเงิน
    completed = (completed) && ((item.paymentFlag) ? true : false);
    if (item.paymentFlag == 'CashPayment') {
      completed = (completed) && ((item.paymentNo) ? true : false);
    } else if (item.paymentFlag == 'OtherPayment') {
      completed = (completed) && ((item.paymentOther) ? true : false);
    }

    // การเจาะเก็บตัวอย่างเลือด
    completed = (completed) && ((item.sampleDate) ? true : false);
    completed = (completed) && ((item.salumIntersectionDate) ? true : false);

    if (item.inputCompleted == null) {
      item.inputCompleted = true;
      //completed = true;
    }

    //console.log('item.title => ', item.title);
    //console.log('siteId => ', item.siteID);


    if (item.title == '') {
      completed = false;

    }

    if (item.firstName == '') {
      completed = false;
    }

    if (item.lastName == '') {
      completed = false;
    }

    if (item.race == '') {
      completed = false;
    }

    if (item.birthday == null) {
      completed = false;
    }

    if (item.pregnantFlag == '') {
      completed = false;
    }

    if (item.pregnantFlag == '') {
      completed = false;
    }

    if (item.artificialInseminationFlag == '') {
      completed = false;
    }
    if (item.siteID == '') {
      completed = false;
    }


    if (item.ultrasoundDate == null) {
      //console.log(555);
      if (item.gAAgeWeeks == null && item.gAAgeDays == null) {
        //console.log(666);
        if (item.lMPDate == null) {
          //console.log(777);
          completed = false;
        }
      }
    }

    if (item.ultrasoundDate != null) {
      //console.log(888);
      if (item.ultrasound_BPD == null && item.ultrasound_CRL == null) {
        //console.log(999);
        completed = false;
      }
    }





    const query = ` SELECT  Value
                    FROM RequestsPatientMore
                    WHERE RequestID = '${item.requestID}' 
                    ORDER BY ListNo ASC
                         `;
    const response = this.sentSampleService.query({ queryString: query });
    response.then(data => {
      //console.log('Response => ', data.data.response);
      for (let el of data.data.response) {
        //console.log('ellllll => ', el);
        if (el.value == 'N') {
          completed = false;
        } else {
        }
      }
    });





    console.log('completed => ', completed);



    return completed;

    // if (completed) {
    //   item.inputCompleted = true;
    // } else {
    //   idxIncomplete.push(index);
    //   item.inputCompleted = false;
    // }
  }

  doCheckRequired = () => {
    const idxIncomplete: Array<number> = new Array<number>();
    this.requestLists.forEach((item, index) => {

      const completed = this.isInputCompleted(item);
      if (completed) {
        item.inputCompleted = true;
      } else {
        idxIncomplete.push(index);
        item.inputCompleted = false;
      }

      //console.log('item.inputCompleted => ', item.inputCompleted);
    });

    if (idxIncomplete.length > 0) {
      this.inputCompleted = false;
    } else {
      this.inputCompleted = true;
    }

    this.cdRef.detectChanges();
  }

  thaiPostChange = (ev: any) => {
    this.sentSampleForm.patchValue({
      deliveryByThaiPost: ev.checked ? 'Y' : 'N'
    })
  }

  get moreForms(): FormArray {
    return this.sentSampleForm.get('patientMoreForms') as FormArray;
  }

  createShipmentClick = () => {
    const selected = this.samplesTab.itemSelection?.selected.length ?? 0;
    if (selected === 0) {
      console.log('not selected data');
      return;
    }

    this.samplesTab.itemSelection?.selected.forEach((row: any) => {
    });
  }

  saveShipmentClick = () => {
    this.sentSampleForm.get('documentStatus')?.patchValue('Draft');
    this.sentSampleForm.get('requestStatus')?.patchValue('Draft');
    this.executeSaveShipment();
  }

  saveSentSample = () => {

    ///// Function Before ก่อนเปลียน ฟังก์ชั่น
    //this.sentSampleForm.get('documentStatus')?.patchValue('In-Process');
    //this.sentSampleForm.get('requestStatus')?.patchValue('In-Process');
    //this.sentSampleForm.get('modelCheckInsert')?.patchValue('Modereq2');


    ////Function After หลังเปลี่ยนฟังก์ชั่น
    this.sentSampleForm.get('documentStatus')?.patchValue('Shipment');
    this.sentSampleForm.get('requestStatus')?.patchValue('Shipment');
    this.sentSampleForm.get('modelCheckInsert')?.patchValue('Modereq2');


    /*this.sentSampleForm.*/
     //const runno: any = this.getRunning2();
     //   this.sentSampleForm.patchValue({
     //     sentSampleNo: runno.data?.RunningNo
     //   });
    
    //this.sentSampleForm.get('modelCheckInsert')?.patchValue('Modereq2');
    //console.log('sssss => ',);



    ///////  เช็คคคคคคค
    this.executeSaveShipment();
  }

  executeSaveShipment = async () => {
    // const prepare = await this.doPrepareSaveShipment();
    const prepare = await this.doPrepareSaveShipmentEx();
    if (!prepare) {
      console.log('prepare not pass');
      return;
    }

    // const isValid = await this.doValidateSaveShipment();
    // if (!isValid) {
    //   console.log('validate not pass');
    //   return;
    // }



    ////this.requestsDTO.Requests.push
    //const model = new RequestsModel();
    //model.modelCheckInsert = 'Modereq2';
    //this.sentSampleDto.Requests.push(model)

    /*const requestListstest = new RequestsDTO();*/

   




    //oooooooooooooooooooooooooooooooo
    return this.sentSampleService.save(this.sentSampleDto)
      .subscribe(async (res) => {








        /////// ฟังก์ชั่นก่อนมีการสั่งพิมพ์ใบนำส่ง
        //// this.isUpdated = true;
        //this.spinner.hide();
        //this.toastrNotiService.clear();
        //this.notiService.showSuccess('Save Successfully.');
        //this.modalRef.hide();

        //this.requestLists = this.requestLists.map(obj => this.createRequestSelected.find(o => o.requestID === obj.requestID) || obj);
        //console.log('requestsList => ', this.requestLists);

        //this.cdRef.detectChanges();
        /////// ฟังก์ชั่นก่อนมีการสั่งพิมพ์ใบนำส่ง


        /////// ฟังก์ชั่นหลังมีการสั่งพิมพ์ใบนำส่ง


         await Swal.fire({
           text: `ต้องการพิมพ์ใบนำส่งหรือไม่?`,
           icon: `question`,
           showDenyButton: true,
           confirmButtonText: 'ใช่ พิมพ์ใบนำส่ง',
           denyButtonText: 'ไม่ต้องการ',
         }).then((result) => {
           if (result.isConfirmed) {
             console.log('if');
             const sentSampleNo = this.sentSampleForm.get('sentSampleNo').value;
             const sentSampleID = this.sentSampleForm.get('sentSampleID').value;
             this.doPrintPostCover(sentSampleID);
           } else {
             console.log('else');
             const sentSampleID = this.sentSampleForm.get('sentSampleID').value;
             this.UpdateShiptoNo(sentSampleID);
           }






           this.spinner.hide();
           this.toastrNotiService.clear();
           this.notiService.showSuccess('Save Successfully.');
           this.modalRef.hide();
           //this.doSearchData(null);
           this.requestLists = this.requestLists.map(obj => this.createRequestSelected.find(o => o.requestID === obj.requestID) || obj);
           this.cdRef.detectChanges();
         })


        /////// ฟังก์ชั่นหลังมีการสั่งพิมพ์ใบนำส่ง


      }, (err) => {
        this.spinner.hide();
        console.log('executeSaveData error >> ', err);
        return this.handleError(err);
      });
  }

  doPrepareSaveShipment = async (): Promise<boolean> => {
    try {
      this.sentSampleDto = {
        LISSentSampleHDs: [],
        LISSentSampleDTs: [],
        Requests: new Array<RequestsModel>(),
        RequestsPatientMores: new Array<RequestsPatientMoreModel>(),
        AppCode: 'Nbs'
      };

      const guId = Guid.create().toString();    // sentSampleID

      const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
      if (this.utilService.checkDateIsGreaterThanToday(new Date(sentSampleDate))) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '"วันที่นำส่ง" ต้องไม่มากกว่าวันที่ปัจจุบัน',
        });
        return false;
      }

      const query = `select * from MSLabProfile where ProfileCode = 'NBS'`;
      const response = await this.sentSampleService.query({ queryString: query });
      let profileId = '';
      if (response) {
        profileId = response?.data?.response[0]?.profileID;
      }
      if (!profileId) {
        profileId = '';
      }

      const trackingNo = this.sentSampleForm.get('trackingNo').value; // >> request form post api (ems)
      // Requests
      this.createRequestSelected.forEach((req) => {
        req.profileID = profileId;
        req.shiptoNo = this.sentSampleForm.get('sentSampleNo').value;       // เลขที่นำส่ง
        // req.shipmentNo = this.sentSampleForm.get('sentSampleNo').value;     // เลขที่นำส่ง
        req.shiptoDate = this.sentSampleForm.get('sentSampleDate').value;   // วันที่นำส่ง
        // req.sampleNo = '';
        // req.trackingNo = trackingNo;
        req.requestStatus = 'Shipment';
        req.sentSampleID = guId;
        // req.sampleType = this.sentSampleForm.get('sampleType').value;
        // req.filterPaperCompleteness = this.sentSampleForm.get('paperResult').value;
        req.appCode = 'Nbs';
      });

      // LISSentSampleHD
      this.sentSampleForm.patchValue({
        sentSampleID: guId,
        sentSampleDate: this.datePipe.transform(sentSampleDate, 'yyyy-MM-dd', 'en-US'),
        isDeleted: this.isDeleted ? 1 : 0,
        inputPercentage: 0,
        numberOFSamples: this.requestLists.length,
        profileID: profileId,
        trackingNo,
        appCode: 'Nbs',
        deliveryByThaiPost: this.isDeliveryByThaiPost ? 'Y' : 'N',
      });

      this.sentSampleDto.LISSentSampleHDs = [Object.assign({}, this.sentSampleForm.value)];
      this.sentSampleDto.Requests = this.createRequestSelected;

      return true;
    }
    catch (err) {
      console.error('error ', err);
      this.handleError(err);
      return false;
    }
  }

  doValidateSaveShipment = async (): Promise<boolean> => {
    const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
    const sentSampleNo = this.sentSampleForm.get('sentSampleNo').value;
    const trackingNo = this.sentSampleForm.get('trackingNo').value;

    const urgentContactName = this.sentSampleForm.get('urgentContactName').value;
    const urgentContactTel = this.sentSampleForm.get('urgentContactTel').value;
    const senderName = this.sentSampleForm.get('senderName').value;
    const senderTel = this.sentSampleForm.get('senderTel').value;
    const deliveryAppointLocation = this.sentSampleForm.get('deliveryAppointLocation').value;

    let errors = '';
    if (!sentSampleDate) {
      errors = `<li>"วันที่นำส่ง"</li>`;
    }
    if (!sentSampleNo) {
      errors += `<li>"เลขที่นำส่ง"</li>`;
    }

    if (this.isDeliveryByThaiPost) {
      if (!trackingNo) {
        errors += `<li>"Tracking No (EMS)"</li>`;
      }
    }

    if (!urgentContactName) {
      errors += `<li>"ผู้ประสานงานเร่งด่วน"</li>`;
    }
    if (!urgentContactTel) {
      errors += `<li>"เบอร์โทรศัพท์ผู้ประสานงานเร่งด่วน"</li>`;
    }
    if (!senderName) {
      errors += `<li>"ผู้นำส่ง"</li>`;
    }
    if (!senderTel) {
      errors += `<li>"เบอร์โทรศัพท์ผู้นำส่ง"</li>`;
    }
    if (!deliveryAppointLocation) {
      errors += `<li>"สถานที่นัดส่ง"</li>`;
    }

    if (errors) {
      Swal.fire({
        icon: 'error',
        title: `กรุณาตรวจสอบค่าว่าง`,
        html: `<ul style="list-style-type:circle; text-align: left;">${errors}</ul>`
      });

      this.createRequestSelected.forEach((req) => {
        req.requestStatus = 'Draft';
        req.appCode = 'Nbs';
      });

      return false;
    }

    return true;
  }

  doPrepareSaveShipmentEx = async (): Promise<boolean> => {
    let isNew = false;
    try {
      this.sentSampleDto = {
        LISSentSampleHDs: [new LISSentSampleHDModel()],
        LISSentSampleDTs: [new LISSentSampleDTModel()],
        Requests: new Array<RequestsModel>(),
        RequestsPatientMores: new Array<RequestsPatientMoreModel>()
      };

      console.log('doPrepareSaveShipmentEx');
      let guId = Guid.create();
      if (this.sentSampleForm.get('isNew').value) {
        //
        console.log('isnew xx => new');
        isNew = true;
      } else {
        guId = this.sentSampleForm.get('sentSampleID').value;
      }

      console.log('guid => ', guId.toString());

      const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
      if (this.utilService.checkDateIsGreaterThanToday(new Date(sentSampleDate))) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '"วันที่นำส่ง" ต้องไม่มากกว่าวันที่ปัจจุบัน',
        });
        return false;
      }

      let query = '';
      if (this.sentSampleForm.get('numberOfAnalyst').value) {
        query = `select * from MSLabProfile where ProfileCode = 'Down'`;
      } else {
        query = `select * from MSLabProfile where ProfileCode = 'Preeclampsia'`;
      }
      const response = await this.sentSampleService.query({ queryString: query });
      let profileId = '';
      if (response) {
        profileId = response?.data?.response[0]?.profileID;
      }
      if (!profileId) {
        profileId = '';
      }

      this.createRequestSelected.forEach((req) => {
        req.ultrasound_BPD = req.ultrasound_BPD ? req.ultrasound_BPD : null;
        req.ultrasound_CRL = req.ultrasound_CRL ? req.ultrasound_CRL : null;
        req.numberofOther = req.numberofOther ? req.numberofOther : null;
        req.pregnantTypeOther = req.pregnantTypeOther ? req.pregnantTypeOther : null;
        req.gAAgeWeeks = req.gAAgeWeeks ? req.gAAgeWeeks : null;
        req.gAAgeDays = req.gAAgeDays ? req.gAAgeDays : null;
        req.weight = req.weight ? req.weight : null;
        req.profileID = profileId;
        req.requestStatus = this.sentSampleForm.get('requestStatus').value;
        req.siteName = this.sentSampleForm.get('siteName').value;
        req.sampleTypeName = this.sentSampleForm.get('sampleTypeName').value;
      })

      this.sentSampleForm.patchValue({
        sentSampleID: guId.toString(),
        sentSampleDate: this.datePipe.transform(sentSampleDate, 'yyyy-MM-dd', 'en-US'),
        isDeleted: this.isDeleted ? 1 : 0,
        inputPercentage: 0,
        numberOFSamples: this.createRequestSelected.length
        // receiveFlag: 'NotPaid'
      });

      const mores = this.moreForms;
      this.sentSampleDto.LISSentSampleHDs = [Object.assign({}, this.sentSampleForm.value)];
      if (!isNew) {
        this.sentSampleDto.LISSentSampleHDs[0].objectState = 2;
        this.sentSampleDto.LISSentSampleHDs[0].spParmLastSentSampleID = guId.toString();
      }

      console.log('prepare => ', this.sentSampleDto.LISSentSampleHDs[0]);
      // this.sentSampleDto.Requests = this.requestLists;
      this.sentSampleDto.Requests = this.createRequestSelected;

      this.sentSampleDto.LISSentSampleDTs.forEach((dt) => {
        dt.sentSampleID = guId.toString();
        if (!this.sentSampleForm.get('isNew').value) {
          dt.spParmLastSentSampleID = dt.sentSampleID;
        }
      });

      const moresSave = new Array<RequestsPatientMoreModel>();
      this.sentSampleDto.Requests.forEach((request) => {
        request.shiptoNo = this.sentSampleForm.get('sentSampleNo').value; // เลขที่ใบนำส่ง
        request.shiptoDate = this.sentSampleForm.get('sentSampleDate').value;
        request.sampleTypeID = this.sentSampleForm.get('sampleTypeID').value;
        request.siteID = this.sentSampleForm.get('siteID').value;
        request.sentSampleID = guId.toString();

        const patientMoreForms = request['patientMoreForms'] as Array<FormGroup>;
        request['patientMoreForms'] = null;

        if (patientMoreForms) {
          patientMoreForms.forEach((item: any, index) => {
            // const elm = item.value as RequestsPatientMoreModel;
            item.requestID = request.requestID;
            moresSave.push(item);
          });
        }
        else {
        }
      });

      this.sentSampleDto.RequestsPatientMores = (moresSave); // new Array<RequestsPatientMoreModel>();
      return true;
    }
    catch (err) {
      console.error('error ', err);
      this.handleError(err);
      return false;
    }
  }

  clickMe = () => {
    this.range.panelRangeOpenState = !this.range.panelRangeOpenState;
  }

  onSamplesTabChange = () => {
    this.sentSampleForm.get('documentStatus').patchValue('Draft');
    this.executeSaveRequestsData();
  }

  onEditShipment = (value: RequestsModel) => {
    
    this.createShipmentModal(this.createShipmentTemplate, 0, value);
  }

  saveClick = () => {
    this.sentSampleForm.get('documentStatus').patchValue('Draft');
    this.executeSaveRequestsData();

    // Swal.fire({
    //   icon: 'success',
    //   title: 'การบันทึกข้อมูลสำเร็จ',
    //   text: '',
    // });
  }

  private executeSaveRequestsData = async () => {
    const prepare = await this.doPrepareSaveRequests();
    if (!prepare) {
      return;
    }

    const isValid = await this.doValidateSaveRequests();
    if (!isValid) {
      return;
    }

    this.spinner.show();
    return this.requestsRepoService.saveRequests(this.requestsDTO)
      .subscribe((res) => {
        this.spinner.hide();
        this.notiService.showSuccess('Save Successfully.');
        this.doPostSaveRequests(res);
      }, (err) => {
        this.spinner.hide();
        console.log('executeSaveData error >> ', err);
        return this.handleError(err);
      });
  }

  doPrepareSaveRequests = async (): Promise<boolean> => {
    try {
      this.sentSampleDto = {
        LISSentSampleHDs: [new LISSentSampleHDModel()],
        LISSentSampleDTs: [new LISSentSampleDTModel()],
        Requests: new Array<RequestsModel>(),
        RequestsPatientMores: new Array<RequestsPatientMoreModel>(),
        AppCode: 'Nbs'
      };

      let query = '';
      if (this.sentSampleForm.get('numberOfAnalyst').value) {
        query = `select * from MSLabProfile where ProfileCode = 'Down'`;
      } else {
        query = `select * from MSLabProfile where ProfileCode = 'Preeclampsia'`;
      }
      const response = await this.sentSampleService.query({ queryString: query });
      let profileId = '';
      if (response) {
        profileId = response?.data?.response[0]?.profileID;
      }
      if (!profileId) {
        profileId = '';
      }

      const requests = this.requestLists.filter(r => (r.isNew));
      if (requests.length == 0) {
        return false;
      }

      const rangeData = this.range.rangeForm.value as RegisterRangeFormModel;
      for (const [index, el] of requests.entries()) {
        let guId = Guid.create().toString();
        // if (el.isEdit) {
        //   guId = el.requestID;
        // } else {
        //   // new
        // }

        // let [hours, minutes] = (el.babeBloodDrawTime ?? '00:00').split(':');
        // let hour = +hours;
        // let minute = +minutes || 0;
        // const bloodDate = !el.babeBloodDrawDate ? null : new Date(el.babeBloodDrawDate?.getFullYear(), el.babeBloodDrawDate?.getMonth(), el.babeBloodDrawDate?.getDate(), hour, minute);
        // bloodDate?.setTime(bloodDate.getTime() + 7 * 60 * 60 * 1000);

        // [hours, minutes] = (el.babeTimeOfBirth ?? '00:00').split(':');
        // hour = +hours;
        // minute = +minutes || 0;
        // const dob = !el.babeDateOfBirth ? null : new Date(el.babeDateOfBirth.getFullYear(), el.babeDateOfBirth.getMonth(), el.babeDateOfBirth.getDate(), hour, minute);
        // dob?.setTime(dob.getTime() + 7 * 60 * 60 * 1000);

        // el.babeTwinNo = +el.babeTwinNo;
        // el.momGaAgeWeeks = +el.momGaAgeWeeks;
        // el.babeWeight = +el.babeWeight;
        // el.babeTwinNo = +el.babeTwinNo;
        el.appCode = 'down';
        el.requestID = guId;
        el.siteID = rangeData.siteID;
        el.requestStatus = el.requestStatus ? el.requestStatus : rangeData.documentStatus;

        // el.babeBloodDrawDate = bloodDate;
        // el.babeDateOfBirth = dob;

        // el.runPrefix = this.siteInfo.siteRunPrefix;
      }

      this.requestsDTO.Requests = Object.assign([], requests);
      this.requestsDTO.AppCode = 'Nbs';
      // this.requestsDTO.Requests = this.requestLists.map(x => Object.assign({}, x)); // Object.assign({}, this.requestLists.filter(r => r.isNew === true));
      // this.requestsDTO.Requests = Object.assign([], this.requestLists); // Object.assign({}, this.requestLists.filter(r => r.isNew === true));
      // this.requestsDTO.RequestsPatientMores = Object.assign([{}], this.moreForms.value);

      return true;
    }
    catch (err) {
      console.error('error ', err);
      this.handleError(err);
      return false;
    }
  }

  doValidateSaveRequests = async (): Promise<boolean> => {
    const requests = this.requestLists.filter(r => (r.isNew));
    if (requests.length == 0) {
      Swal.fire({
        icon: 'info',
        title: `ไม่มีรายการที่ต้องทำการบันทึก`,
        html: ``
      });
      return false;
    }

    for (const [index, el] of this.requestLists.entries()) {
      if (!el.isNew) {
        continue;
      }

      // el.babeTwinNo = +el.babeTwinNo;
      el.appCode = 'down';

      let errors = '';
      if (!el.firstName || !el.lastName) {
        errors = `<li>"ชื่อ-นามสกุล [มารดา]"</li>`;
      }
      // if ((!el.identityCard) && (el.momNationality == 'Thai')) {
      //   errors += `<li>"บัตรประชาชน [มารดา]"</li>`;
      // }
      // if (!el.momMobileNo) {
      //   errors += `<li>"โทรศัพท์มือถือ [มารดา]"</li>`;
      // }
      if (errors) {
        Swal.fire({
          icon: 'error',
          title: `กรุณาตรวจสอบค่าว่าง [No.${index + 1}]`,
          html: `<ul style="list-style-type:circle; text-align: left;">${errors}</ul>`
        });
        return false;
      }

      // if (!el.babeHn) {
      //   errors += `<li>"HN [ทารก]"</li>`;
      // }
      // if (!el.babeWeight) {
      //   errors += `<li>"น้ำหนักแรกเกิด (g) [ทารก]"</li>`;
      // }
      // if (!el.momGaAgeWeeks) {
      //   errors += `<li>"อายุครรภ์เมื่อคลอด (week) [ทารก]"</li>`;
      // }
      // if (!el.babeDateOfBirth) {
      //   errors += `<li>"วันเดือนปีเกิด [ทารก]"</li>`;
      // }
      // if (!el.babeBloodDrawDate) {
      //   errors += `<li>"วันเจาะเลือด [ทารก]"</li>`;
      // }

      if (errors) {
        Swal.fire({
          icon: 'error',
          title: `กรุณาตรวจสอบค่าว่าง [${index + 1}]`,
          html: `<ul style="list-style-type:circle; text-align: left;">${errors}</ul>`
        });
        return false;
      }
    }

    return true;
  }

  doPostSaveRequests = (responseSave: any) => {
    const responses = responseSave.data.Requests as RequestsModel[];
    const requests = this.requestLists.filter(r => (r.isNew));
    for (const [index, el] of requests.entries()) {
      const found = responses.find((element, idx) => element.requestID = el.requestID);
      el.isNew = false;
      // el.isEdit = false;
      el.objectState = 2;
      // el.labNumber = el.labNumber;
    }

    this.doSearchData(null);
  }

  doSearchData = (ev: any) => {
    // this.getData();

    this.eventResult = ev;
    this.doLoadSample();

    //console.log('evvvvvv ==> ',ev);
    //console.log('this.doLoadSample => ', this.doLoadSample());

  }

  createInitialForm() {
    this.sentSampleForm = this.fb.group(new LISSentSampleHDModel());
    this.sentSampleForm.addControl('requestsForm', this.fb.array([new RequestsModel()]));
    this.sentSampleForm.addControl('patientMoreForms', this.fb.array([]));
    // this.requestFormsArray = this.sentSampleForm.controls.requestsForm as FormArray;
    this.requestLists = new Array<RequestsModel>();
    // this.requestToDelete = new Array<RequestsModel>();
    // this.isReceived = false;

    this.printBarcodeForm = this.fb.group({
      fromSentSampleNo: [''],
      toSentSampleNo: [''],
      fromSampleNo: [''],
      toSampleNo: ['']
    });

    this.runPrefix = '';
    this.authService.currentUser.subscribe((user: any) => {
      this.runPrefix = user?.data?.SecurityUsers?.RunPrefix;
    });

    this.requestsDTO = {
      Requests: new Array<RequestsModel>(),
      RequestsPatientMores: new Array<RequestsPatientMoreModel>(),
      AppCode: 'Nbs'
    };
    // this.receiveNo = '';

    // this.loadSampleType(null)
    //   .subscribe((res) => {
    //     res = this.utilService.camelizeKeys(res);
    //     this.sampleTypeObjCombo = res.data.mSLabSampleTypes;
    //     const idx = this.sampleTypeObjCombo.findIndex(x => x.isDefault === true);
    //     this.selectedSampleType = this.sampleTypeObjCombo[idx];
    //     this.sentSampleForm.get('sampleTypeID').patchValue(this.selectedSampleType.sampleTypeID);
    //   }, (err) => {
    //     console.log('err >> ', err);
    //     this.handleError(err);
    //   });


    ///this.doSetDefault();

  }

  getRunPrefix(): Observable<any> {
    const siteId = this.sentSampleForm.get('siteID').value;
    const item = {
      sqlWhere: `it.SiteID = '${siteId}'`
    };
    return this.repoService.getDataParm('api/MSSite/getByCondition', item).pipe(retry(1));
  }

  doGetRunning = () => {
   
    // tslint:disable-next-line: deprecation
    this.getRunPrefix().subscribe(site => {
      let run: any;
      if (site.data.MSSites.length == 0) {
        run = new MSSiteModel();
      } else {
        run = site.data.MSSites[0] as MSSiteModel;
      }

      run = this.utilService.camelizeKeys(run);
      this.runPrefix = run.runPrefix;

      this.repoService.getData(`api/general/getLastRunning?tableName=LISSentSampleHD&columnName=sentSampleNo&runPrefix=${this.runPrefix}`).pipe(retry(1))
        // tslint:disable-next-line: deprecation
        .subscribe((runno: any) => {
         
          if (runno.data?.RunningNo) {
            this.sentSampleForm.patchValue({
              sentSampleNo: runno.data?.RunningNo
            });
          }
        });
    });
  }

  applySampleRequest(data: any) {
    return;
    const model = new RequestsModel();
    model.shiptoNo = this.sentSampleForm.get('sentSampleNo').value;
    model.shiptoDate = this.sentSampleForm.get('sentSampleDate').value;
    model.sampleTypeID = this.sentSampleForm.get('sampleTypeID').value;
    model.sampleTypeName = this.sentSampleForm.get('sampleTypeName').value;
    model.requestDate = null; // วันที่รับตัวอย่าง
    model.startDate = null;   // กำหนดแล้วเสร็จ
    model.objectState = 1;
    model.profileID = this.sentSampleForm.get('profileID').value;
    model.profileName = this.sentSampleForm.get('profileName').value;
    this.requestLists.push(model);

    // model = new RequestsModel();
    // model.shiptoNo = 'xxx';
    // model.shiptoDate = this.sentSampleForm.get('sentSampleDate').value;
    // model.sampleTypeID = this.sentSampleForm.get('sampleTypeID').value;
    // model.sampleTypeName = this.sentSampleForm.get('sampleTypeName').value;
    // model.requestDate = null; // วันที่รับตัวอย่าง
    // model.startDate = null;   // กำหนดแล้วเสร็จ
    // model.objectState = 1;
    // model.profileID = this.sentSampleForm.get('profileID').value;
    // model.profileName = this.sentSampleForm.get('profileName').value;
    // this.requestLists.push(model);
  }

  public getData = () => {
    const rangeForm: FormGroup = this.range.rangeForm;
    //console.log('RangForm => ',rangeForm);
    const item = {
      sqlSelect: `it.*, MSSite.SiteName As SiteName, emp.FirstName + ' ' + emp.LastName as EmployeeName ` +
        `, (SELECT count(requestid) from Requests where SentSampleID = it.SentSampleID and Requests.RequestStatus = 'Approved') as ApproveCount ` +
        `, (select top 1 isnull(title, '') + isnull(firstname + ' ', '') + isnull(lastname, '') from requests where requests.SentSampleID = it.SentSampleID order by requests.LabNumber asc) as PatientNameLists`,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)`,
      sqlWhere: this.defaultValue.forScienceCenter == true ? `` : `(it.SiteID = '${this.defaultValue.siteID}')`,
      sqlOrder: `Convert(varchar(10), it.SentSampleDate, 112) Desc, it.SentSampleNo Desc`,
      pageIndex: -1
    };

    const dRange = this.utilService.getDateRange(rangeForm.get('dateRangeSelectedValue').value);
    if (dRange) {
      const startDate = this.datepipe.transform(dRange.start, 'yyyyMMdd');
      const endDate = this.datepipe.transform(dRange.end, 'yyyyMMdd');
      item.sqlWhere += item.sqlWhere ? ` and (it.sentSampleDate between '${startDate}' and '${endDate}')` : ` (it.sentSampleDate between '${startDate}' and '${endDate}')`;
    }

    this.sentSampleService.getLISSentSampleHDByCondition(item)
      .subscribe(res => {
        // this.dataSource.data = res.data.LISSentSampleHDs as LISSentSampleHDModel[];
        // this.requestLists = res.data.LISSentSampleHDs as LISSentSampleHDModel[];
      },
        (err) => {
          return this.handleError(err);
        });
  }

  public doLoadSample = async () => {
    this.loading = true;
    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;

    if (objData != null) {

    }

    const item = {
      sqlSelect: `it.*, MSSite.SiteName As SiteName, emp.FirstName + ' ' + emp.LastName as EmployeeName, sent.SiteName as SentToSiteName ` +
        `, type.SampleTypeName`,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSSite as sent On (sent.SiteID = it.SentToSiteID) ` +
        `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) ` +
        `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID) `,
      // sqlWhere: `(it.SentSampleID = '${objData?.sentSampleID}')`,
      sqlOrder: ``,
      pageIndex: -1
    };

    // const promiseHd = await this.sentSampleService.getLISSentSampleHDByCondition(item).toPromise();
    // let modelHd: LISSentSampleHDModel = Object.assign({}, promiseHd?.data.LISSentSampleHDs[0]);
    // modelHd = this.utilService.camelizeKeys(modelHd);

    // this.patchSampleFormValues(modelHd);
    // this.sampleTypeID = this.sentSampleForm.get('sampleTypeID').value;
    // this.isReceived = modelHd.receiveNo ? true : false;
    // this.receiveNo = modelHd.receiveNo;

    const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
    const dueDate = this.sentSampleForm.get('dueDate').value;
    const receiveDate = this.sentSampleForm.get('receiveDate').value;

    this.sentSampleForm.patchValue({
      spParmLastSentSampleID: this.sentSampleForm.get('sentSampleID').value,
      sentSampleDate: sentSampleDate ? new Date(sentSampleDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      receiveDate: receiveDate ? new Date(receiveDate) : null,
      isNew: false
    });


    console.log('เข้าาาาา');
    const requestsItem = {
      
      sqlSelect: `it.*, MSSite.SiteName As SiteName, sent.SiteName as SentToSiteName ` +
        `, type.SampleTypeName,refv.RefuseNameTH as RefuseName,refv.Value as RefuseValue  `,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join LISSentSampleHD On (it.SentSampleID = LISSentSampleHD.SentSampleID) ` +
        `Left Outer Join MSSite as sent On (sent.SiteID = LISSentSampleHD.SentToSiteID) ` +
        `Left Outer Join Refuse_verification as refv On (refv.Value = it.FilterPaperCompleteness) ` +
        `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) `,
      sqlWhere: this.getRangeWhere(),
      sqlOrder: ``,
      pageIndex: -1
    };
    this.spinner.show();
    let promiseRequest = await this.requestsRepoService
      .getRequestsById(requestsItem).toPromise()
      .catch(() => this.loading = false);
    // .getRequestsById({
    //   // sqlSelect: `top 10 it.*, type.SampleTypeName`,
    //   // sqlFrom: `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID)`,
    //   // sqlWhere: `it.SentSampleID = '${objData.sentSampleID}'`,
    //   sqlOrder: `it.LabNumber Asc`
    // }).toPromise();
    promiseRequest = this.utilService.camelizeKeys(promiseRequest);
    this.requestLists = promiseRequest?.data.requests;
    this.spinner.hide();


    //console.log('this.Testttt => ', this.requestLists);










    const reqFilter = this.requestLists.filter(item => item.requestStatus == 'Rejected' || (item.requestStatus == 'Rejected')
    );
    const toastrConfig = {
      positionClass: 'toast-top-center',
      disableTimeOut: true,
      preventDuplicates: true,
      closeButton: true,
      timeOut: 0,
      enableHTML: true,
    };

    if (reqFilter.length > 0) {
      setTimeout(() =>
        this.toastAlertRef = this.toastrNotiService.warning(`
        กรุณาตรวจสอบ
        <ul>
        <li>มีรายการถูก Reject</li>
        </ul>`, '', toastrConfig)
      );
      // this.toastrNotiService.clear(this.toastAlertRef?.toastId);
    } else {
      this.toastrNotiService.clear();
    }

    this.doCheckRequired();

    // this.dataSource.data = promiseRequest?.data.requests as RequestsModel[];

    // const idx = this.sampleTypeObjCombo.findIndex(x => x.sampleTypeID === this.sampleTypeID);
    // this.selectedSampleType = this.sampleTypeObjCombo[idx];

    // this.doCheckRequired();
    this.loading = false;
  }

  getRangeWhere = () => {
    //console.log('this.eventResult => ', this.eventResult.);
    //console.log('1111111122222');


    let sqlWhere = '';
    const rangeData = this.range.rangeForm.value as RegisterRangeFormModel;

 
    //const rangeData = this.eventResult as RegisterRangeFormModel;

    //console.log('rangeData => ', rangeData);



    if (rangeData?.siteID) {
      console.log('www', rangeData?.siteID);
      sqlWhere += (sqlWhere ? ` and ` : ``) + ` (MSSite.siteID = '${rangeData?.siteID}')`;
    }

    const fromDate = this.datePipe.transform(rangeData?.fromSentSampleDate, 'yyyyMMdd');
    const toDate = this.datePipe.transform(rangeData?.toSentSampleDate, 'yyyyMMdd');

  
    if (fromDate && toDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.CreatedDate, 112) between '${fromDate}' and '${toDate}') `;
    } else if (fromDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.CreatedDate, 112) >= '${fromDate}') `;
    } else if (toDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.CreatedDate, 112) <= '${toDate}') `;
    }

    // เลขที่ใบนำส่ง
    if (rangeData.fromSentSampleNo && rangeData.toSentSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(LISSentSampleHD.SentSampleNo between '${rangeData.fromSentSampleNo}' and '${rangeData.toSentSampleNo}') `;
    } else if (rangeData.fromSentSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(LISSentSampleHD.SentSampleNo >= '${rangeData.fromSentSampleNo}') `;
    } else if (rangeData.toSentSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(LISSentSampleHD.SentSampleNo <= '${rangeData.toSentSampleNo}') `;
    }

    // labNumber
    if (rangeData.fromSampleNo && rangeData.toSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(it.labNumber between '${rangeData.fromSampleNo}' and '${rangeData.toSampleNo}') `;
    } else if (rangeData.fromSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(it.labNumber >= '${rangeData.fromSampleNo}') `;
    } else if (rangeData.toSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(it.labNumber <= '${rangeData.toSampleNo}') `;
    }

    // if (rangeData.trackingNo) {
    //   sqlWhere += (sqlWhere ? ` and ` : ``) + `(it.TrackingNo = '${rangeData.trackingNo}') `;
    // }

    if (rangeData.hN) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(it.hN = '${rangeData.hN}') `;
    }

    if (rangeData.identityCard) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(it.identityCard = '${rangeData.identityCard}') `;
    }

    //console.log('documentStatus =>', rangeData.documentStatus);

    // if (rangeData.momPassportNo) {
    //   sqlWhere += (sqlWhere ? ` and ` : ``) + `(it.MomPassportNo = '${rangeData.momPassportNo}') `;
    // }


    if (rangeData.documentStatus) {
      //console.log('This rangeData.documentStatus => ', rangeData.documentStatus);
       if (rangeData.documentStatus !== 'All') {
         sqlWhere += (sqlWhere ? ` and ` : ``) + `(it.RequestStatus = '${rangeData.documentStatus}') `;
       }
     }



    //Search New
    const fromShiptoDate = this.datePipe.transform(rangeData?.fromShiptoDate, 'yyyyMMdd');
    const toShiptoDate = this.datePipe.transform(rangeData?.toShiptoDate, 'yyyyMMdd');
    if (fromShiptoDate && toShiptoDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.ShiptoDate, 112) between '${fromShiptoDate}' and '${toShiptoDate}') `;
    } else if (fromShiptoDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.ShiptoDate, 112) >= '${fromShiptoDate}') `;
    } else if (toShiptoDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.ShiptoDate, 112) <= '${toShiptoDate}') `;
    }




    const fromReceiveDate = this.datePipe.transform(rangeData?.fromReceiveDate, 'yyyyMMdd');
    const toReceiveDate = this.datePipe.transform(rangeData?.toReceiveDate, 'yyyyMMdd');
    if (fromReceiveDate && toReceiveDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.ReceiveDate, 112) between '${fromReceiveDate}' and '${toReceiveDate}') `;
    } else if (fromReceiveDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.ReceiveDate, 112) >= '${fromReceiveDate}') `;
    } else if (toReceiveDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.ReceiveDate, 112) <= '${toReceiveDate}') `;
    }



    return sqlWhere;
  }

  patchSampleFormValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.sentSampleForm.controls[ngName]) {
          this.sentSampleForm.controls[ngName].patchValue(value[name]);
        }
      });
    } catch (error) {
      this.handleError(error);
      console.log('error >> ', error);
    }
  }

  async createShipmentModal(template: TemplateRef<any>, idx: any, item: RequestsModel = null) {




    const isEditShipment = item ? true : false;
    this.sentSampleForm = this.fb.group(new LISSentSampleHDModel());





    this.sentSampleForm.patchValue({
      // userName: this.defaultValue.userName,
      siteID: this.defaultValue.siteID,
      siteName: this.defaultValue.siteName,
      // employeeID: this.defaultValue.employeeID,
      // employeeName: this.defaultValue.employeeName,
      sentToSiteID: this.defaultValue.sentToSiteID,
      sentToSiteName: this.defaultValue.sentToSiteName
    });

    //console.log('isEditShipment => ', isEditShipment);

    let selectedItem = this.requestLists.filter((element, index) => element.isSelected);
    this.createRequestSelected = this.requestLists.filter((element, index) => element.isSelected);


    //console.log('testttttttcllick', selectedItem.length);



    if (selectedItem.length > 0) {
      this.sentSampleForm.get('numberOFSamples').setValue(selectedItem.length);
    }
    selectedItem.forEach((req2) => {
      //console.log('req2 => ', req2);
      //this.sentSampleForm.patchValue({
      //  employeeID: this.defaultValue.employeeID,
      //  employeeName: this.defaultValue.employeeName
      //});
      this.sentSampleForm.get('employeeID').setValue(this.defaultValue.employeeID);
      this.sentSampleForm.get('employeeName').setValue(this.defaultValue.employeeName);


      const query = `SELECT ProfileID, ProfileName
              FROM MSLabProfile
              WHERE ProfileID = '${req2.profileID}' and IsDefault = 1 `;

      const response = this.sentSampleService.query({ queryString: query });
            response.then(data => {
        for (let el of data.data.response) {
          //console.log('elll => ', el);
          this.sentSampleForm.get('profileID').setValue(el.profileID);
          this.sentSampleForm.get('profileName').setValue(el.profileName);
        }
      });


      const query2 = `SELECT SampleTypeID, SampleTypeName
              FROM MSLabSampleType
              WHERE SampleTypeID = '${req2.sampleTypeID}' and IsDefault = 1  and ProfileID = '${req2.profileID}' `;

      const response2 = this.sentSampleService.query({ queryString: query2 });
      response2.then(data => {
        for (let el of data.data.response) {
          //console.log('elll => ', el);
          this.sentSampleForm.get('sampleTypeID').setValue(el.sampleTypeID);
          this.sentSampleForm.get('sampleTypeName').setValue(el.sampleTypeName);
        }
      });

    });





    if (isEditShipment) {
      // กรณี edit ใบนำส่ง
      console.log('item xxx => ', item.sentSampleID);
      let query = `select * from requests where sentSampleID = '${item.sentSampleID}'`;
      const responseRequests = await this.sentSampleService.query({ queryString: query });
      console.log('response => ', responseRequests);
      if (responseRequests) {
        selectedItem = this.utilService.camelizeKeys(responseRequests.data?.response);
        selectedItem.forEach((req) => {
          req.objectState = 2;
          req.spParmLastRequestID = req.requestID;
          req.inputCompleted = this.isInputCompleted(req);
          // const completed = this.isInputCompleted(item);
          // if(completed) {
          //   req.inputCompleted = 
          // }
        });
      }

      this.createRequestSelected = Object.assign([], selectedItem);
      //console.log('createRequestSelected => ', this.createRequestSelected);

      query = `select it.*, req.*,sptype.sampleTypeName, profile.ProfileName as profileName `;
      query += `, isnull(emp.FirstName + ' ', '') + isnull(emp.LastName, '') as employeeName `;
      query += `from LISSentSampleHD as it `
      query += `left outer join MSLabSampleType as sptype on (it.SampleTypeID = sptype.SampleTypeID) `;
      query += `left outer join MSLabProfile as profile on (it.ProfileID = profile.ProfileID) `;
      query += `left outer join MSEmployee emp on (it.EmployeeID = emp.EmployeeID) `;
      query += `left outer join Requests re on (re.SentSampleID = it.SentSampleID) `;
      query += `left outer join RequestsPatientMore req on (req.RequestID = re.RequestID) `
      query += `where SentSampleID = '${item.sentSampleID}' `
      const responseSentSample = await this.sentSampleService.query({ queryString: query });
      //console.log('responseSentSample => ', this.utilService.camelizeKeys(responseSentSample));
      if (responseSentSample) {
        const dataSent = this.utilService.camelizeKeys(responseSentSample.data?.response[0]);
        this.patchSampleFormValues(dataSent);
        // this.sentSampleForm.patchValue(dataSent);
        this.sentSampleForm.patchValue({
          spParmLastSentSampleID: dataSent.sentSampleID,
        })
      }

      this.sentSampleForm.patchValue({
        isNew: false
      });

      //console.log('spParmLastSentSampleID => ', this.sentSampleForm.getRawValue());
    }

    const selected = selectedItem.length ?? 0;
    if (selected === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือกรายการคนไข้ที่จะสร้างใบนำส่ง',
        text: '',
      });
      return;
    }

    // this.samplesTab.itemSelection?.selected.forEach((row: any) => {
    //   console.log('item xx => ', row);
    // });

    const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
    this.sentSampleForm.patchValue({ sentSampleDate: sentSampleDate ? new Date(sentSampleDate) : null });

    if (!isEditShipment) {
      this.sentSampleForm.patchValue({
        urgentContactName: this.defaultValue.employeeName,
        urgentContactTel: this.defaultValue.userTel,
        senderName: this.defaultValue.officerName,
        senderTel: this.defaultValue.userTel,
        deliveryAppointLocation: this.defaultValue.deliveryAppointLocation,
        sendTestTimes: this.sentSampleForm.get('sendTestTimes')?.value ?? 1,
      });
    }

    // ขอเลขที่ใบนำส่ง
    // this.repoService.getData(`api/general/getRunning?tableName=LISSentSampleHD&columnName=sentSampleNo&runPrefix=SM`).pipe(retry(1))
    //   .subscribe((runno: any) => {
    //     console.log('runno => ', runno);
    //     if (runno.data?.RunningNo) {
    //       this.sentSampleForm.patchValue({
    //         sentSampleNo: runno.data?.RunningNo
    //       });
    //     }
    //   });



   /* console.log('isEditShipment => ', isEditShipment);*/

    if (!isEditShipment) {
      try {
        //console.log(555);
        this.loading = true;
        //this.resParameter = 'RunningNo';
        //this.CheckParameter(template,idx, item);



        ////// ถ้าต้องการ Gen เลขแบบเดิม เปิด comment ส่่วนนี้ออก
        //const runno: any = await this.getRunning();
        //this.sentSampleForm.patchValue({
        //  sentSampleNo: runno.data?.RunningNo
        //});


        this.loading = false;
      } catch {
        this.loading = false;
      }
    }

    const notCompleted = this.createRequestSelected.find(it => (it.inputCompleted == false));



    const test = this.createRequestSelected.find(it => (it.nationality));
    
    //console.log('test => ', test);







    //if (test.nationality == 'Foreigner') {
    //  this.disabledSentSample = false;
    //} else {

    //}

    //console.log('this notCompleted => ', notCompleted);


    //if (notCompleted && (this.appSettingsModel.allowSentWhenIncomplete == 'N')) {
    //  if (test.nationality == 'Foreigner') {
    //    this.disabledSentSample = false
    //  } else {
    //    this.disabledSentSample = true;
    //  }
    //} else {
    //  this.disabledSentSample = false;
    //}
    //const CheckfirstName = this.createRequestSelected.find(it => (it.firstName));
    //console.log('CheckfirstName => ', CheckfirstName);

    if (test.nationality == 'Foreigner') {

     

     
    }
    else
    {
      if (notCompleted && (this.appSettingsModel.allowSentWhenIncomplete == 'N')) {
         //console.log('test3');
        this.disabledSentSample = true;   
           // this.disabledSentSample = true;
      } else {
         //console.log('test4');
        this.disabledSentSample = false;
      }
    }


    if (test.title == '') {
      this.disabledSentSample = true;
    }

    if (test.firstName == '') {
      this.disabledSentSample = true;
    }

    if (test.lastName == '') {
      this.disabledSentSample = true;
    }

    if (test.race == '') {
      this.disabledSentSample = true;
    }

    if (test.birthday == null) {
      this.disabledSentSample = true;
    }

    if (test.pregnantFlag == "") {
      this.disabledSentSample = true;
    }

    if (test.pregnantFlag == "") {
      this.disabledSentSample = true;
    }

    if (test.artificialInseminationFlag == "") {
      this.disabledSentSample = true;
    }


    if (test.ultrasoundDate == null) {
      console.log(555);
      if (test.gAAgeWeeks == null && test.gAAgeDays == null) {
        console.log(666);
        if (test.lMPDate == null) {
          console.log(777);
          this.disabledSentSample = true;
        }
      }
    } 

    if (test.ultrasoundDate != null) {
      console.log(888);
      if (test.ultrasound_BPD == null && test.ultrasound_CRL == null) {
        console.log(999);
        this.disabledSentSample = true;
      }
    }
 
    if (test.siteID == '') {
      this.disabledSentSample = true;
    }



    const query = ` SELECT  Value
                    FROM RequestsPatientMore
                    WHERE RequestID = '${test.requestID}' 
                    ORDER BY ListNo ASC
                         `;
    const response = this.sentSampleService.query({ queryString: query });
    response.then(data => {
      //console.log('Response => ', data.data.response);
      for (let el of data.data.response) {
        //console.log('ellllll => ', el);
        if (el.value == 'N') {
          this.disabledSentSample = true;
        } else {
        }
      }
    });






    this.modalRef = this.bsModalService.show(template, { class: 'modal-lg modal-dialog-centered', backdrop: 'static' });
  }

  async createShipmentModalEx(template: TemplateRef<any>, idx: any, item: RequestsModel = null) {

    // console.log('testClick2222');


    const isEditShipment = item ? true : false;

    let selectedItem = this.requestLists.filter((element, index) => element.isSelected);
    this.createRequestSelected = this.requestLists.filter((element, index) => element.isSelected);

    if (isEditShipment) {
      // กรณี edit ใบนำส่ง
      console.log('item xxx => ', item.sentSampleID);
      let query = `select * from requests where sentSampleID = '${item.sentSampleID}'`;
      const responseRequests = await this.sentSampleService.query({ queryString: query });
      console.log('response => ', responseRequests);
      if (responseRequests) {
        selectedItem = this.utilService.camelizeKeys(responseRequests.data?.response);
        selectedItem.forEach((req) => {
          req.objectState = 2;
          req.spParmLastRequestID = req.requestID;
        });
      }

      this.createRequestSelected = Object.assign([], selectedItem);
      console.log('createRequestSelected => ', this.createRequestSelected);

      query = `select * from LISSentSampleHD where SentSampleID = '${item.sentSampleID}'`;
      const responseSentSample = await this.sentSampleService.query({ queryString: query });
      console.log('responseSentSample => ', this.utilService.camelizeKeys(responseSentSample));
      if (responseSentSample) {
        const dataSent = this.utilService.camelizeKeys(responseSentSample.data?.response[0]);
        this.sentSampleForm.patchValue(dataSent);
        this.sentSampleForm.patchValue({
          spParmLastSentSampleID: dataSent.sentSampleID,
          trackingNo: dataSent.trackingNo
        })
      }

      // console.log('spParmLastSentSampleID => ', this.sentSampleForm.getRawValue());
    }

    const selected = selectedItem.length ?? 0;
    if (selected === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือกรายการคนไข้ที่จะสร้างใบนำส่ง',
        text: '',
      });
      return;
    }

    const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
    this.sentSampleForm.patchValue({ sentSampleDate: sentSampleDate ? new Date(sentSampleDate) : null });

    if (!isEditShipment) {
      this.sentSampleForm.patchValue({
        urgentContactName: this.defaultValue.employeeName,
        urgentContactTel: this.defaultValue.userTel,
        // trackingNo: ``,
        senderName: this.defaultValue.officerName,
        senderTel: this.defaultValue.userTel,
        deliveryAppointLocation: this.defaultValue.deliveryAppointLocation, // `${this.siteInfo.siteFloorNo ?? ''} ${this.siteInfo.siteBuilding ?? ''}`
        sendTestTimes: this.sentSampleForm.get('sendTestTimes')?.value ?? 1
      });
    }

    // ขอเลขที่ใบนำส่ง
    // this.repoService.getData(`api/general/getRunning?tableName=LISSentSampleHD&columnName=sentSampleNo&runPrefix=SM`).pipe(retry(1))
    //   .subscribe((runno: any) => {
    //     console.log('runno => ', runno);
    //     if (runno.data?.RunningNo) {
    //       this.sentSampleForm.patchValue({
    //         sentSampleNo: runno.data?.RunningNo
    //       });
    //     }
    //   });

    if (!isEditShipment) {
      try {
        this.loading = true;
        const runno: any = await this.getRunning();
        this.sentSampleForm.patchValue({
          sentSampleNo: runno.data?.RunningNo
        });
        this.loading = false;
      } catch {
        this.loading = false;
      }
    }



    // const isDelivery = this.sentSampleForm.get('deliveryByThaiPost');
    // isDelivery.valueChanges.subscribe(async (value: any) => {
    //   this.isDeliveryByThaiPost = (value && value == 'Y') ? true : false;
    //   console.log('isDeliveryByThaiPost => ', this.isDeliveryByThaiPost);
    //   if (this.isDeliveryByThaiPost) {
    //     await this.getEmsTrackingNo();
    //   }
    // });
    // this.isDeliveryByThaiPost = isDelivery.value;

    if (this.isDeliveryByThaiPost) {
      // await this.getEmsTrackingNo();   // ยกเลิกการ get tracking โดยให้ user กด เอง
    }

    this.modalRef = this.bsModalService.show(template, { class: 'modal-lg modal-dialog-centered', backdrop: 'static' });

  }

  async openWarningAlert(template: TemplateRef<any>) {
    this.modalRefWarningAlert = this.bsModalService.show(template, { class: 'modal-lg modal-dialog-centered', backdrop: 'static' });
  }

  getRunning = async () => {
  
    return this.repoService.getData(`api/general/getRunning?tableName=LISSentSampleHD&columnName=sentSampleNo&runFormat=SMyyMM-0000`).pipe(retry(1)).toPromise();
    // .subscribe((runno: any) => {
    //   if (runno.data?.RunningNo) {
    //     this.sentSampleForm.patchValue({
    //       sentSampleNo: runno.data?.RunningNo
    //     });
    //   }
    // });
  }

  onCloseCreateShipment = () => {
    // $('#createShipmentTemplate').modal('hide');
    this.modalRef.hide();
  }

  onCloseModalRef = (modalId: string) => {
    $(`${modalId}`).modal('hide');
  }

  dateInputChange = (ev) => {
    // console.log('date change : ', ev);
  }

  onProfileBlur = (ev: any) => {
    console.log('evvvv => ',typeof ev);

    if (!ev.target.value) {
      return this.sentSampleForm.patchValue({
        profileID: '',
        profileName: '',
        sampleTypeID: '',
        sampleTypeName: ''
      });
    }

    const item = {
      sqlSelect: `it.*, sample.SampleTypeCode, sample.SampleTypeName, sample.IsDefault as SampleTypeDefault`,
      sqlFrom: `Left Outer Join MSLabSampleType as sample On (sample.ProfileID = it.ProfileID)`,
      sqlWhere: `it.profileName = '${ev.target.value}' `
    };

    try {
      this.getMSLabProfile(item)
        .subscribe((res) => {
          res = this.utilService.camelizeKeys(res);
          if (res.data.mSLabProfiles.length <= 0) {
            this.sentSampleForm.patchValue({
              profileID: '',
              profileName: '',
              sampleTypeID: '',
              sampleTypeName: ''
            });
            return this.openProfilePicker();
          }

          const profiles: MSLabProfileModel[] = res.data.mSLabProfiles as MSLabProfileModel[];
          this.sentSampleForm.patchValue({
            profileID: profiles[0].profileID,
            profileName: profiles[0].profileName,
          });

          const sampleFound = profiles.find((e, index) => e.sampleTypeDefault === true);
          if (sampleFound) {
            this.sentSampleForm.patchValue({
              sampleTypeID: sampleFound.sampleTypeID,
              sampleTypeName: sampleFound.sampleTypeName
            });
          } else {
            this.sentSampleForm.patchValue({
              sampleTypeID: '',
              sampleTypeName: ''
            });
          }

        }, (error) => {
          this.sentSampleForm.patchValue({
            profileID: '',
            profileName: '',
            sampleTypeID: '',
            sampleTypeName: ''
          });
        });

    } catch (err) {
      this.handleError(err);
    }

  }

  openProfilePicker() {
    const initialState = {
      title: 'Profile',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MslabProfilePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.sentSampleForm.patchValue({
          profileID: value.selectedItem['ProfileID'],
          profileName: value.selectedItem['ProfileName']
        });

        const profileName = String(value.selectedItem['ProfileName']);
        if (profileName.toLowerCase().includes('กลุ่มอาการดาวน์') || profileName.toLowerCase().includes('quad test')) {
          this.openWarningAlert(this.warningAlertRef);
        }

        const sample = {
          sqlSelect: ``,
          sqlWhere: `it.ProfileID = '${value.selectedItem['ProfileID']}' And it.IsDefault = 1 `
        };
        this.getMSLabSampleType(sample)
          .subscribe((response) => {
            response = this.utilService.camelizeKeys(response);
            const sampleTypes: MSLabSampleTypeModel[] = response.data.mSLabSampleTypes;
            if (sampleTypes.length > 0) {
              this.sentSampleForm.get('sampleTypeID')?.patchValue(sampleTypes[0].sampleTypeID);
              this.sentSampleForm.get('sampleTypeName')?.patchValue(sampleTypes[0].sampleTypeName);
            } else {
              this.sentSampleForm.patchValue({
                sampleTypeID: ``,
                sampleTypeName: ``
              });
            }


          }, (err) => {
            console.log('set picker error >> ', err);
          });
      },
        (err: any) => {
          console.log(err);
        });
  }

  onSampleTypeBlur = (ev: any) => {
    if (!ev.target.value) {
      return this.sentSampleForm.patchValue({
        sampleTypeID: '',
        sampleTypeName: ''
      });
    }

    let profileId = this.sentSampleForm.get('profileID').value;
    profileId = profileId ?? '@';

    const sample = {
      sqlSelect: ``,
      sqlWhere: `it.SampleTypeName = '${ev.target.value}' And it.ProfileID = '${profileId}' `
    };
    this.getMSLabSampleType(sample)
      .subscribe((response) => {
        response = this.utilService.camelizeKeys(response);
        const sampleTypes: MSLabSampleTypeModel[] = response.data.mSLabSampleTypes;
        if (sampleTypes.length > 0) {
          this.sentSampleForm.get('sampleTypeID')?.patchValue(sampleTypes[0].sampleTypeID);
          this.sentSampleForm.get('sampleTypeName')?.patchValue(sampleTypes[0].sampleTypeName);
        } else {
          this.sentSampleForm.patchValue({
            sampleTypeID: ``,
            sampleTypeName: ``
          });

          return this.openSampleTypePicker();
        }
      }, (err) => {
        console.log('set sample-type error >> ', err);
      });
  }

  openSampleTypePicker() {
    let profileId = this.sentSampleForm.get('profileID').value;
    profileId = profileId ?? '@';

    const initialState = {
      list: [this.sentSampleForm.get('sentSampleID').value],
      title: 'ชนิดตัวอย่าง',
      class: 'my-class',
      sqlWhere: `it.ProfileID = '${profileId}'`,
    };

    this.bsModalRef = this.bsModalService.show(SampleTypePickerComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
    });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action.subscribe(
      (value: any) => {
        if (!value || value.isCancel) {
          return;
        }
        this.sentSampleForm.patchValue({
          sampleTypeID: value.selectedItem['SampleTypeID'],
          sampleTypeName: value.selectedItem['SampleTypeName'],
        });
      },
      (err: any) => {
        console.log(err);
        this.handleError(err);
      }
    );
  }

  openLabNumberPicker = (name: string) => {
    const fromSentSampleNo = this.printBarcodeForm.get('fromSentSampleNo').value;
    const initialState = {
      list: [
        // this.printBarcodeForm.get('sentSampleID').value
      ],
      whereClause: this.defaultValue.forScienceCenter ? null : `SiteID = '${this.defaultValue.siteID}'`,
      siteID: this.defaultValue.forScienceCenter ? null : this.defaultValue.siteID,
      shiptoNo: fromSentSampleNo ? fromSentSampleNo : null,
      title: 'เลขตัวอย่าง',
      class: 'my-class'
    };

    //console.log('TestFunction_StartFunction');

    this.bsModalRef = this.bsModalService.show(LabnumberPickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });

    //console.log('this.bsModalRef => ', this.bsModalRef);
    //console.log('TestFunction_EndFunction');
    
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        console.log('value => ', value);

        if (!value || value.isCancel) { return; }
        if (name == 'from') {
          this.printBarcodeForm.patchValue({
            fromSampleNo: value.selectedItem['labNumber'],
          });
        } else if (name == 'to') {
          this.printBarcodeForm.patchValue({
            toSampleNo: value.selectedItem['labNumber'],
          });
        }

      },
        (err: any) => {
          console.log(err);
        });
  }

  openSentSamplehdPicker = (name: string) => {
    const initialState = {
      list: [
        // this.printBarcodeForm.get('sentSampleID').value
      ],
      whereClause: `it.SiteFlag != 'P'`,
      siteID: this.defaultValue.siteID,
      title: 'ใบนำส่ง',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(SentSamplehdPickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        console.log('value => ', value);

        if (!value || value.isCancel) { return; }
        if (name == 'from') {
          this.printBarcodeForm.patchValue({
            fromSentSampleNo: value.selectedItem['SentSampleNo'],
          });
        } else if (name == 'to') {
          this.printBarcodeForm.patchValue({
            toSentSampleNo: value.selectedItem['SentSampleNo'],
          });
        }

      },
        (err: any) => {
          console.log(err);
        });
  }

  openMSSitePicker() {
    const initialState = {
      list: [
        this.sentSampleForm.get('sentSampleID').value
      ],
      whereClause: `it.SiteFlag != 'P'`,
      title: 'Site',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MssitePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.sentSampleForm.patchValue({
          siteID: value.selectedItem['SiteID'],
          siteName: value.selectedItem['SiteName'],
          deliveryByThaiPost: value.selectedItem['DeliveryByThaiPost'],

          sentToSiteID: value.selectedItem['ParentSiteID'],
          sentToSiteName: value.selectedItem['ParentSiteName'],
        });

        this.defaultValue.siteID = value.selectedItem['SiteID'];
        this.defaultValue.deliveryByThaiPost = value.selectedItem['DeliveryByThaiPost'];
        this.runPrefix = value.selectedItem['RunPrefix'];
      },
        (err: any) => {
          console.log(err);
        });

  }

  openSiteParentPicker() {
    const initialState = {
      list: [
        this.sentSampleForm.get('sentSampleID').value
      ],
      whereClause: `it.SiteFlag = 'P'`,
      title: 'Sent to Site',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MssitePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.sentSampleForm.patchValue({
          sentToSiteID: value.selectedItem['SiteID'],
          sentToSiteName: value.selectedItem['SiteName'],
        });
      },
        (err: any) => {
          console.log(err);
        });

  }

  openEmployeePicker() {
    const initialState = {
      list: [
        this.sentSampleForm.get('sentSampleID').value
      ],
      title: 'ผู้จัดส่ง',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(EmployeePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.sentSampleForm.patchValue({
          employeeID: value.selectedItem['EmployeeID'],
          employeeName: value.selectedItem['FirstName'] + ' ' + (value.selectedItem['LastName'] ? value.selectedItem['LastName'] : ''),
        });
      },
        (err: any) => {
          console.log(err);
        });

  }

  getMSLabSampleType(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
  }

  getMSLabProfile(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabprofile/getByCondition', item).pipe(retry(1));
  }

  public getSentSampleHD = () => {
    const item = {
      sqlSelect: `it.* `,
      sqlFrom: ``,
      sqlWhere: this.defaultValue.forScienceCenter == true ? `` : `(it.SiteID = '${this.defaultValue.siteID}')`,
      sqlOrder: `it.sentSampleDate desc, Convert(varchar(10), it.SentSampleDate, 112) Desc, it.SentSampleNo Desc`,
      pageIndex: -1
    };

    item.sqlWhere += item.sqlWhere ? ` and (isnull(it.SentSampleNo, '') != '') ` : `(isnull(it.SentSampleNo, '') != '')`;

    // const range = this.utilService.getDateRange(this.rangeSelectedValue);
    // if (range) {
    //   const startDate = this.datepipe.transform(range.start, 'yyyyMMdd');
    //   const endDate = this.datepipe.transform(range.end, 'yyyyMMdd');
    //   item.sqlWhere += item.sqlWhere ? ` and (it.sentSampleDate between '${startDate}' and '${endDate}')` : ` (it.sentSampleDate between '${startDate}' and '${endDate}')`;
    // }

    this.sentSampleService.getLISSentSampleHDByCondition(item)
      .subscribe(res => {
        this.sentSampleLists = res.data.LISSentSampleHDs as LISSentSampleHDModel[];
        // this.dataSource.data = res.data.LISSentSampleHDs as LISSentSampleHDModel[];
      },
        (err) => {
          return this.handleError(err);
        });
  }

  doPrintRegisterForm = () => {
    $('#printRegisterFormRef').modal('show');
  }

  onConfirmPrintRegisterForm = () => {
    $('#printRegisterFormRef').modal('hide');

    const fromSentSampleNo = this.printBarcodeForm.get('fromSentSampleNo').value;
    const fromSampleNo = this.printBarcodeForm.get('fromSampleNo').value;
    const toSampleNo = this.printBarcodeForm.get('toSampleNo').value;

    console.log('fromSentSampleNo => ', fromSentSampleNo);
    console.log('fromSampleNo => ', fromSampleNo);
    console.log('toSampleNo => ', toSampleNo);



    let where = fromSentSampleNo ? `it.shiptoNo='${fromSentSampleNo}'` : ``;
    if (fromSampleNo && toSampleNo) {
      where += where ? ` AND (it.LabNumber BETWEEN '${fromSampleNo}' AND '${toSampleNo}')` : `(it.LabNumber BETWEEN '${fromSampleNo}' AND '${toSampleNo}')`;
    } else if (fromSampleNo) {
      //where += where ? ` AND (it.LabNumber >= '${fromSampleNo}' )` : `(it.LabNumber >= '${fromSampleNo}' )`;
      where += where ? ` AND (it.LabNumber = '${fromSampleNo}' )` : `(it.LabNumber = '${fromSampleNo}' )`;
    } else if (toSampleNo) {
      //where += where ? ` AND (it.LabNumber <= '${toSampleNo}' )` : `(it.LabNumber <= '${toSampleNo}' )`;
      where += where ? ` AND (it.LabNumber = '${toSampleNo}' )` : `(it.LabNumber = '${toSampleNo}' )`;
    }


    //Comment ไว้เวลามีปัญหาเรื่อง site ให้เปิด Comment เอาไว้


    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {

        this.forDepartureHospital = user.data?.SecurityUsers?.ForDepartureHospital;
        this.defaultValue.forScienceCenter = user.data?.SecurityUsers?.ForScienceCenter;

        if (this.forDepartureHospital == true) {

          if (this.defaultValue.forScienceCenter == true) {
            //console.log('66666');
          }
          if (this.defaultValue.forScienceCenter == false) {
            where += where ? ` AND (it.SiteID = '${this.defaultValue.siteID}')` : ` (it.SiteID = '${this.defaultValue.siteID}') `;
           

          }

        }
      }
     });




  



    //console.log('where Test_Result => ', where);


    const encryptedData = this.encryptUsingAES256({
      //reportName: `RegisterBloodBlottingPaperForm`,
      reportName: `RegisterBloodBlottingPaperFormTest`,
      parameters: {
        //sqlWhere: where ? where : `(1=0)`,
        sqlWhere: where ? where : `(1=0)`,
      }
    });

    const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
      {
        queryParams:
        {
          data: encryptedData,
        }
      });


    const baseUrl = window.location.href.replace(this.router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }

  doPrintPostCover = (shiptoNo: string = '') => {

    //console.log('shiptoNo => ', shiptoNo);


    const query = ` SELECT  SentSampleNo
                    FROM LISSentSampleHD
                    where SentSampleID = '${shiptoNo}'
                         `;
    const response = this.sentSampleService.query({ queryString: query });
    response.then(data => {
      //console.log('Response => ', data.data.response);
      for (let el of data.data.response) {
        
        //console.log('elllll => ', el.sentSampleNo);


    

     const query2 = ` Update  Requests   
                      set  ShiptoNo = '${el.sentSampleNo}'
                      where SentSampleID = '${shiptoNo}'
                         `;
        const response2 = this.sentSampleService.query({ queryString: query2 });





        this.shiptoNoToPrint = '';
          this.shiptoNoToPrint = el.sentSampleNo;
          this.onConfirmPrintCover();
          return;
       
      }
    });


    




    //this.shiptoNoToPrint = '';

    //if (shiptoNo) {
    //  this.shiptoNoToPrint = shiptoNo;
    //  this.onConfirmPrintCover();
    //  return;
    //}

    //this.getSentSampleHD();
    //$('#printOptionRef').modal('show');




  }

  onConfirmPrintCover = () => {

    //console.log('this.shiptoNoToPrint => ', this.shiptoNoToPrint);


    if (!this.shiptoNoToPrint) {
      return Swal.fire({
        title: `กรุณาเลือกใบนำส่ง`,
        icon: `warning`
      })
    }

    $(this.printOptionRef.nativeElement).modal('hide');

    // const rangeData = this.range.rangeForm.value as RegisterRangeForm;
    //let where = this.shiptoNoToPrint ? `it.shiptoNo='${this.shiptoNoToPrint}'` : `(1=0)`;
    let where = ` sentHd.SentSampleNo = '${this.shiptoNoToPrint}' `;


    if (!this.defaultValue.forScienceCenter) {
      //console.log('wwwwwDatacenter');
      where += ` and sentHd.SiteID = '${this.defaultValue.siteID}' `;
    }

    const encryptedData = this.encryptUsingAES256({
      reportName: `PostCoverReport`,
      parameters: {
        sqlWhere: where,
      }
    });

    const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
      {
        queryParams:
        {
          data: encryptedData,
        }
      });


    const baseUrl = window.location.href.replace(this.router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');

    this.shiptoNoToPrint = '';
  }

  doPrintBarcodeMultiple = () => {
    // this.getSentSampleHD();
    $('#printBarcodeMultipleRef').modal('show');
  }

  onConfirmPrintBarcodeMultiple = () => {
    // $(this.printBarcodeMultipleRef.nativeElement).modal('hide');
    $('#printBarcodeMultipleRef').modal('hide');

    const fromSentSampleNo = this.printBarcodeForm.get('fromSentSampleNo').value;
    const fromSampleNo = this.printBarcodeForm.get('fromSampleNo').value;
    const toSampleNo = this.printBarcodeForm.get('toSampleNo').value;

    console.log('fromSentSampleNo => ', fromSentSampleNo);
    console.log('fromSampleNo => ', fromSampleNo);
    console.log('toSampleNo => ', toSampleNo);
    
    let where = fromSentSampleNo ? `it.shiptoNo='${fromSentSampleNo}'` : ``;
    if (fromSampleNo && toSampleNo) {
      //console.log('wwwww1111');
      where += where ? ` AND (it.LabNumber BETWEEN '${fromSampleNo}' AND '${toSampleNo}')` : `(it.LabNumber BETWEEN '${fromSampleNo}' AND '${toSampleNo}')`;
    } else if (fromSampleNo) {
      //console.log('wwwww222');
      where += where ? ` AND (it.LabNumber >= '${fromSampleNo}' )` : `(it.LabNumber >= '${fromSampleNo}' )`;
    } else if (toSampleNo) {
      //console.log('wwwww333');
      where += where ? ` AND (it.LabNumber <= '${toSampleNo}' )` : `(it.LabNumber <= '${toSampleNo}' )`;
    }


    // เวลา site มีปัญหา ให้เอา comment ออก
    if (this.defaultValue.siteID != null) {
    where += where ? ` AND (it.SiteID = '${this.defaultValue.siteID}')` : ` (it.SiteID = '${this.defaultValue.siteID}') `;
    }


    console.log('where => ', where);

    const encryptedData = this.encryptUsingAES256({
      reportName: `LabNoBarcodeReport`,
      parameters: {
        sqlWhere: where ? where : `(1=0)`,
      }
    });

    const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
      {
        queryParams:
        {
          data: encryptedData,
        }
      });


    const baseUrl = window.location.href.replace(this.router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }

  checkTrackingParamsValid = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
      const sentSampleNo = this.sentSampleForm.get('sentSampleNo').value;
      const urgentContactName = this.sentSampleForm.get('urgentContactName').value;
      const urgentContactTel = this.sentSampleForm.get('urgentContactTel').value;
      const senderName = this.sentSampleForm.get('senderName').value;
      const senderTel = this.sentSampleForm.get('senderTel').value;
      const deliveryAppointLocation = this.sentSampleForm.get('deliveryAppointLocation').value;

      let errors = '';
      if (!sentSampleDate) {
        errors = `<li>"วันที่นำส่ง"</li>`;
      }
      if (!sentSampleNo) {
        errors += `<li>"เลขที่นำส่ง"</li>`;
      }
      if (!urgentContactName) {
        errors += `<li>"ผู้ประสานงานเร่งด่วน"</li>`;
      }
      if (!urgentContactTel) {
        errors += `<li>"เบอร์โทรศัพท์ผู้ประสานงานเร่งด่วน"</li>`;
      }
      if (!senderName) {
        errors += `<li>"ผู้นำส่ง"</li>`;
      }
      if (!senderTel) {
        errors += `<li>"เบอร์โทรศัพท์ผู้นำส่ง"</li>`;
      }
      if (!deliveryAppointLocation) {
        errors += `<li>"สถานที่นัดส่ง"</li>`;
      }

      if (errors) {
        Swal.fire({
          icon: 'error',
          title: `กรุณาตรวจสอบค่าว่าง`,
          html: `<ul style="list-style-type:circle; text-align: left;">${errors}</ul>`
        });
        resolve(false);
        return;
      }

      if (!this.siteInfo.cusName) {
        errors += `<li>"custName [parentSite.PostCenterCusName]"</li>`
      }
      if (!this.siteInfo.cusAddress) {
        errors += `<li>"cusAddress [parentSite.PostCenterCusAddress]"</li>`
      }
      if (!this.siteInfo.cusDistrict) {
        errors += `<li>"cusDistrict [parentSite.PostCenterCusDistrict]"</li>`
      }
      if (!this.siteInfo.cusProvince) {
        errors += `<li>"cusProvince [parentSite.PostCenterCusProvince]"</li>`
      }
      if (!this.siteInfo.cusZipCode) {
        errors += `<li>"cusZipCode [parentSite.PostCenterCusZipcode]"</li>`
      }
      if (!this.siteInfo.cusTel) {
        errors += `<li>"cusTel [parentSite.PostCenterCusTel]"</li>`
      }
      if (!this.siteInfo.custRemark) {
        errors += `<li>"custRemark [parentSite.PostCenterCusRemarks]"</li>`
      }

      if (errors) {
        Swal.fire({
          icon: 'error',
          title: `กรุณาตรวจสอบค่าว่าง`,
          html: `<ul style="list-style-type:circle; text-align: left;">${errors}</ul>`
        });
        resolve(false);
        return;
      }

      resolve(true);
    });
  }

  getEmsTrackingNo = async () => {
    this.isDeliveryByThaiPost = true;

    const isValid = await this.checkTrackingParamsValid();
    if (!isValid) {
      return;
    }

    const sentSampleNo = this.sentSampleForm.get('sentSampleNo').value;
    const senderName = this.sentSampleForm.get('senderName').value;
    const deliveryAppointLocation = this.sentSampleForm.get('deliveryAppointLocation').value;

    const data = {
      'orderno': sentSampleNo,  // เลขที่ใบนำส่ง,
      'token': 'xxxx.xxxxx.xxxx',
      'orderType': 'S',
      'orderDetail': 'รายละเอียดคำสั่งซื้อ',
      'invoiceno': sentSampleNo,

      'shipperName': senderName,
      'shipperAddress': this.siteInfo.shipperAddress,
      'shipperDistrict': this.siteInfo.shipperDistrict,
      'shipperProvince': this.siteInfo.shipperProvince,
      'shipperZipcode': this.siteInfo.shipperZipcode,
      'shipperEmail': '-',
      'shipperMobile': this.siteInfo.shipperMobile,
      'shipperRemarks': deliveryAppointLocation,

      'cusName': this.siteInfo.cusName ?? '',
      'cusAddress': this.siteInfo.cusAddress ?? '',
      'cusDistrict': this.siteInfo.cusDistrict ?? '',
      'cusProvince': this.siteInfo.cusProvince ?? '',
      'cusZipcode': this.siteInfo.cusZipCode ?? '',
      'cusTel': this.siteInfo.cusTel ?? '',
      'cusRemarks': this.siteInfo.custRemark ?? '',

      'productPrice': 0,
      'productInbox': 'N',
      'productWeight': 0,
      'reportGroup': '',
      'reportSubGroup': '',
      'orderline': [
        {
          'title': 'กระดาษซับเลือด',
          'price': 0,
          'quantity': this.createRequestSelected.length,
          'sku': '',
          'type': ''
        }
      ]
    }

    console.log('Data sent to TrackingNo (EMS) => ', data);

    try {
      this.loading = true;
      const postTracking = ''; // await this.repoService.getPostTracking(`Trackingno`, data).toPromise();

      this.sentSampleForm.patchValue({
        trackingNo: postTracking
      });

      // const res = {
      //   "data": {
      //     "orderno": "OD123456789",
      //     "trackingno": "EB391281258TH",
      //     "gentype": "PRE",
      //     "expecteddate": "2022-08-26 00:00:00",
      //     "timestamp": "2022-08-24 16:24:15"
      //   },
      //   "message": "Success",
      //   "result": true,
      //   "status": true,
      //   "timestamp": "2022-08-24 16:24:15"
      // }
      this.loading = false;

    } catch (err) {
      console.log('get tracking no error => ', err);
      this.notiService.showError(err?.message);
      this.loading = false;
    }

  }

  selectedSentSampleRow = (item: any, ev: any) => {
    console.log('item2131 => ', item);
    this.currentSampleToPrint = item;
    this.shiptoNoToPrint = item.SentSampleNo;
  }

  printPageChanged(event: any) {
    this.printPageConfig.currentPage = event;
  }


  //doPrintPaperblod = (item: RequestsModel = null) => {

  //  //console.log('hdrequestID => ', this.sentSampleForm.get('hdrequestID').value);
  //  console.log(item,'ytesttttt');
  //}


  //async doPrintPaperblod(template: TemplateRef<any>, idx: any, item: RequestsModel = null) {

  //  //console.log('test');
  //  //console.log('item =>', item);

  //  //const isEditShipment = item ? true : false;
  //  //this.sentSampleForm = this.fb.group(new LISSentSampleHDModel());
  //  //this.sentSampleForm.patchValue({
  //  //  siteID: this.defaultValue.siteID,
  //  //  siteName: this.defaultValue.siteName,
  //  //  sentToSiteID: this.defaultValue.sentToSiteID,
  //  //  sentToSiteName: this.defaultValue.sentToSiteName
  //  //});
  // /* console.log('isEditShipment => ', isEditShipment);*/

  //  let selectedItem = this.requestLists.filter((element, index) => element.isSelected);
  //  this.createRequestSelected = this.requestLists.filter((element, index) => element.isSelected);
  // //console.log(' this.createRequestSelected  => ', this.createRequestSelected);

  //  //var datarequestID = selectedItem[0].requestID;
  //  //console.log('datarequestID => ', datarequestID);

  //  if (selectedItem.length == 0) {
  //    Swal.fire({
  //      icon: 'warning',
  //      title: 'กรุณาเลือกรายการคนไข้ก่อนที่จะพิมพ์ข้อมูลกระดาษซับเลือด',
  //      text: '',
  //    });
  //    return;
  //  }

  //  if (selectedItem.length != 0) {

  //    selectedItem.forEach((items: any, val: any) => {
  //      var datarequestID = items.requestID;
  //      //console.log('datarequestID => ', datarequestID);

  //      let where = datarequestID ? `it.RequestID='${datarequestID}'` : ``;
  //      where += where ? ` AND (it.RequestID = '${datarequestID}')` : ` (it.RequestID = '${datarequestID}') `;

  //      const encryptedData = this.encryptUsingAES256({
  //        reportName: `RegisterBloodBlottingPaperForm`,
  //        parameters: {
  //          sqlWhere: where ? where : `(1=0)`,
  //        }
  //      });

  //      const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
  //        {
  //          queryParams:
  //          {
  //            data: encryptedData,
  //          }
  //        });

  //      const baseUrl = window.location.href.replace(this.router.url, '');
  //      window.open(baseUrl + newRelativeUrl, '_blank');



  //    })

  //  }



  //}
  closeModal = () => {
     $('#printRegisterFormRef').modal('hide');
  }


  doPrintPaperblod = () => {
    $('#printRegisterFormRef').modal('show');
  }







  doExportNshoClick = () => {

    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.forDepartureHospital = user.data?.SecurityUsers?.ForDepartureHospital;
        this.forScienceCenter = user.data?.SecurityUsers?.ForScienceCenter;
        console.log('this.forDepartureHospital => ', this.forDepartureHospital);
        console.log('this.forScienceCenter => ', this.forScienceCenter);
        if (this.forDepartureHospital == true)
        {
          if (this.forScienceCenter == true) {
            //console.log('ssss');
            this.clCheckHospital = '';
            this.clCheckHospital2 = '';
            //$('#input-siteName').attr('readonly', false);
            //this.Checkreadonly = true;
          } 
        }
      }
    });

    $('#exportNhsoRangeRef').modal('show');


  }

  onConfirmExportNhsoRange = () => {
    $('#exportNhsoRangeRef').modal('hide');
    this.exportCsvToNHSO();
  }



 //closePick.

  
  doLoadDataToNHSO = async () => {
    //let query = `Select * From uv_NhsoExport as it `;
    //let sqlWhere = '';



    // ไว้แก้ต่อไม่วันจันทร์ ก็ อังคาร
    let query = `SELECT 
                   isnull(it.IdentityCard ,'')เลขบัตรประชาชนของหญิงตั้งครรภ์
                  ,DATEDIFF(yy,CONVERT(DATETIME, it.Birthday),GETDATE()) as อายุ
                  ,Concat(it.GAAgeWeeks,', ',it.GAAgeDays)อายุครรภ์
                  ,isnull(it.PregnantNo ,'')ครรภ์ที่เท่าไหร่
                  ,isnull(MSSite.SiteName ,'')ศูนย์ที่ส่งตรวจquad_test 

                  from Requests it
                  left outer join LISSentSampleHD on it.SentSampleID = LISSentSampleHD.SentSampleID
                  left outer join MSSite on LISSentSampleHD.SentToSiteID = MSSite.SiteID
                  left outer join MSSite as NewSite on NewSite.SiteID = it.SiteID `;
    let sqlWhere = '';


    let siteName = this.exportNhsoRangeForm.get('siteName').value;
    console.log('SiteName => ', siteName);
    if (siteName != '') {
      sqlWhere += (sqlWhere ? ` And ` : ` Where `) + `(NewSite.SiteName = '${siteName}') `;
    }


    let fromCreateDate = this.exportNhsoRangeForm.get('fromCreateDate').value;
    let toCreateDate = this.exportNhsoRangeForm.get('toCreateDate').value;
    fromCreateDate = this.datePipe.transform(fromCreateDate, 'yyyyMMdd');
    toCreateDate = this.datePipe.transform(toCreateDate, 'yyyyMMdd');
    if (fromCreateDate && toCreateDate) {
      sqlWhere += (sqlWhere ? ` And ` : ` Where `) + `(convert(varchar(10), it.CreatedDate, 112) between '${fromCreateDate}' and '${toCreateDate}') `;
    } else if (fromCreateDate) {
      sqlWhere += (sqlWhere ? ` And ` : ` Where `) + `(convert(varchar(10), it.CreatedDate, 112) >= '${fromCreateDate}') `;
    } else if (toCreateDate) {
      sqlWhere += (sqlWhere ? ` And ` : ` Where `) + `(convert(varchar(10), it.CreatedDate, 112) <= '${toCreateDate}') `;
    }

    const nationality = this.exportNhsoRangeForm.get('nationality').value;
    if (nationality == 'thaiOnly') {
      sqlWhere += (sqlWhere ? ` And ` : ` Where `) + `(it.Nationality = 'thai') `;
    } else if (nationality == 'foreignerOnly') {
      sqlWhere += (sqlWhere ? ` And ` : ` Where `) + `(it.Nationality = 'Foreigner') `;
    }

    const slpayment = this.exportNhsoRangeForm.get('slpayment').value;
    if (slpayment) {
      if (slpayment != 'all') {
        sqlWhere += (sqlWhere ? ` And ` : ` Where `) + `(it.PaymentFlag = '${slpayment}') `;
      }
    }

    query += sqlWhere;


    //console.log('This query => ', query);


    try {
      const result = await this.requestsRepoService.queries({ queryString: query }).toPromise();
      const nhsoResults = Object.assign([], result.data.results) as Array<any>;
      //console.log('nhso => ', nhsoResults);

      return nhsoResults;
    }
    catch (err) {
      //console.log('err => ', err);
    }
  }



  exportCsvToNHSO = async () => {
    this.spinner.show();
    try {
      const nhso = await this.doLoadDataToNHSO();
      if (nhso.length == 0) {
        this.spinner.hide();
        return Swal.fire({
          title: `ไม่พบข้อมูลในการส่งออก`,
          icon: 'warning'
        })
      }


      //console.log('This nhso => ', nhso);


      const currentDate = new Date();
      const timeFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
      const localDate = currentDate.toLocaleDateString('th-TH', timeFormat);
      const [date, times] = localDate.split(' ');
      const [dd, MM, yyyy] = date.split('/');
      const time = times.split(':').join('');
      const formattedDate = `${yyyy}${MM}${dd}_${time}`;

      this.excelService.exportAsCsvFile(nhso, `ข้อมูลนำส่ง สปสช_${formattedDate}`);
      this.spinner.hide();
    }
    catch (er) {
      //console.log('er => ', er);
      this.notiService.showError(er);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }

    return;
  }

  clearSite = () => {
    this.exportNhsoRangeForm.patchValue({
      siteID: '',
      siteName: ''
    });
  }




  openMSSitePicker2() {

    //console.log('eeweee');

    
    const initialState = {
      list: [
        //this.exportNhsoRangeForm.get('siteCode').value
      ],
      whereClause: `it.SiteFlag != 'P'`,
      title: 'Site',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MssitePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.exportNhsoRangeForm.patchValue({
          siteID: value.selectedItem['SiteID'],
          siteName: value.selectedItem['SiteName'],

          sentToSiteID: value.selectedItem['ParentSiteID'],
          sentToSiteName: value.selectedItem['ParentSiteName'],
        });
        // this.defaultValue.siteID = value.selectedItem['SiteID'];
        // this.runPrefix = value.selectedItem['RunPrefix'];
      },
        (err: any) => {
          console.log(err);
        });

  }



  exportDataList = () => {
    let dataToExport: ExportPatientModel[] = [];

      console.log('This Checkrequest List => ', this.requestLists.length);
    if (this.requestLists.length == 0) {
      return Swal.fire({
        title: `ไม่พบข้อมูลสำหรับการ Export`,
        text: `กรุณาตรวจสอบ`,
        icon: 'warning',
      })
    }

    this.requestLists.forEach((request, idx) => {
      //console.log('This request => ', request.requestStatus);
      const item: ExportPatientModel = {
        ListNo: idx + 1,
        สถานะ: request.requestStatus,
        วันที่บันทึก: request.createdDate,
        วันที่เจาะเลือด: request.shiptoDate,
        วันที่รับตัวอย่าง: request.receiveDate,
        เลขที่ใบนำส่ง: request.shiptoNo,
        เลขที่ตัวอย่าง: request.labNumber,
        หน่วยงานส่งตรวจ: request.siteName,
        ชื่อ_สกุล: request.firstName + ' ' + request.lastName,
        HN: request.hN,
        บัตรประชาชน: request.identityCard,
        เบอร์โทรศัพท์: request.phoneNo,
      }
      dataToExport.push(item);
    });

    const currentDate = new Date();
    const timeFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
    const localDate = currentDate.toLocaleDateString('th-TH', timeFormat);
    const [date, times] = localDate.split(' ');
    const [dd, MM, yyyy] = date.split('/');
    const time = times.split(':').join('');
    const formattedDate = `${yyyy}${MM}${dd}_${time}`;

    this.excelService.exportAsCsvFile(dataToExport, `ข้อมูลคนไข้_${formattedDate}`);
  }




  ReturnResultListRequests = async () => {
    //console.log('wwwwwwwwww');
    this.loading = true;
    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;

    if (objData != null) {

    }

    const item = {
      sqlSelect: `it.*, MSSite.SiteName As SiteName, emp.FirstName + ' ' + emp.LastName as EmployeeName, sent.SiteName as SentToSiteName ` +
        `, type.SampleTypeName`,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSSite as sent On (sent.SiteID = it.SentToSiteID) ` +
        `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) ` +
        `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID) `,
      // sqlWhere: `(it.SentSampleID = '${objData?.sentSampleID}')`,
      sqlOrder: ``,
      pageIndex: -1
    };

    // const promiseHd = await this.sentSampleService.getLISSentSampleHDByCondition(item).toPromise();
    // let modelHd: LISSentSampleHDModel = Object.assign({}, promiseHd?.data.LISSentSampleHDs[0]);
    // modelHd = this.utilService.camelizeKeys(modelHd);

    // this.patchSampleFormValues(modelHd);
    // this.sampleTypeID = this.sentSampleForm.get('sampleTypeID').value;
    // this.isReceived = modelHd.receiveNo ? true : false;
    // this.receiveNo = modelHd.receiveNo;

    const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
    const dueDate = this.sentSampleForm.get('dueDate').value;
    const receiveDate = this.sentSampleForm.get('receiveDate').value;

    this.sentSampleForm.patchValue({
      spParmLastSentSampleID: this.sentSampleForm.get('sentSampleID').value,
      sentSampleDate: sentSampleDate ? new Date(sentSampleDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      receiveDate: receiveDate ? new Date(receiveDate) : null,
      isNew: false
    });

    //console.log('เข้า22222222');
    const requestsItem = {
    
      sqlSelect: `it.*, MSSite.SiteName As SiteName, sent.SiteName as SentToSiteName ` +
        `, type.SampleTypeName`,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join LISSentSampleHD On (it.SentSampleID = LISSentSampleHD.SentSampleID) ` +
        `Left Outer Join MSSite as sent On (sent.SiteID = LISSentSampleHD.SentToSiteID) ` +
        `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) `,
      sqlWhere: this.getRangeWhere(),
      sqlOrder: ``,
      pageIndex: -1
    };

    let promiseRequest = await this.requestsRepoService
      .getRequestsById(requestsItem).toPromise()
      .catch(() => this.loading = false);
    // .getRequestsById({
    //   // sqlSelect: `top 10 it.*, type.SampleTypeName`,
    //   // sqlFrom: `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID)`,
    //   // sqlWhere: `it.SentSampleID = '${objData.sentSampleID}'`,
    //   sqlOrder: `it.LabNumber Asc`
    // }).toPromise();
    promiseRequest = this.utilService.camelizeKeys(promiseRequest);
    this.requestLists = promiseRequest?.data.requests;



    //console.log('this.Testttt22222 => ', this.requestLists);


    const reqFilter = this.requestLists.filter(item =>
      item.requestStatus == 'Rejected'
      || (item.requestStatus == 'Rejected')
    );
    const toastrConfig = {
      positionClass: 'toast-top-center',
      disableTimeOut: true,
      preventDuplicates: true,
      closeButton: true,
      timeOut: 0,
      enableHTML: true,
    };

    if (reqFilter.length > 0) {
      setTimeout(() =>
        this.toastAlertRef = this.toastrNotiService.warning(`
        กรุณาตรวจสอบ
        <ul>
        <li>มีรายการถูก Reject</li>
        <li>ผลอนุมัติเป็นบวกที่ต้องติดต่อภายใน 24, 48 ชั่วโมง</li>
        <li>มีรายการติดตามบัตรประชาชนบุตร</li>
        </ul>`, '', toastrConfig)
      );
      // this.toastrNotiService.clear(this.toastAlertRef?.toastId);
    } else {
      this.toastrNotiService.clear();
    }

    this.doCheckRequired();

    // this.dataSource.data = promiseRequest?.data.requests as RequestsModel[];

    // const idx = this.sampleTypeObjCombo.findIndex(x => x.sampleTypeID === this.sampleTypeID);
    // this.selectedSampleType = this.sampleTypeObjCombo[idx];

    // this.doCheckRequired();
    this.loading = false;


  }

  async CheckParameter  (template: TemplateRef<any>, idx: any, item: RequestsModel = null) {


    const isEditShipment = item ? true : false;

    //const runno: any = this.getRunning();
    //    this.sentSampleForm.patchValue({
    //      sentSampleNo: runno.data?.RunningNo
    //    });
    //console.log('sentSampleNo => ', runno);
    if (!isEditShipment) {
      try {
        this.loading = true;

        ////// ถ้าต้องการ Gen เลขแบบเดิม เปิด comment ส่่วนนี้ออก
        const runno: any = await this.getRunning();
        this.sentSampleForm.patchValue({
          sentSampleNo: runno.data?.RunningNo
        });

        console.log('runno => ', runno);



        //this.loading = false;
      } catch {
        //this.loading = false;
      }
    }

  }


  getRunning2 = () => {

    return this.repoService.getData(`api/general/getRunning?tableName=LISSentSampleHD&columnName=sentSampleNo&runFormat=SMyyMM-0000`).pipe(retry(1)).toPromise();
    // .subscribe((runno: any) => {
    //   if (runno.data?.RunningNo) {
    //     this.sentSampleForm.patchValue({
    //       sentSampleNo: runno.data?.RunningNo
    //     });
    //   }
    // });
  }


  UpdateShiptoNo = (shiptoNo: string = '') => {
    const query = ` SELECT  SentSampleNo
                    FROM LISSentSampleHD
                    where SentSampleID = '${shiptoNo}'
                         `;
    const response = this.sentSampleService.query({ queryString: query });
    response.then(data => {
      //console.log('Response => ', data.data.response);
      for (let el of data.data.response) {
        //console.log('elllll => ', el.sentSampleNo);
        const query2 = ` Update  Requests   
                      set  ShiptoNo = '${el.sentSampleNo}'
                      where SentSampleID = '${shiptoNo}'
                         `;
        const response2 = this.sentSampleService.query({ queryString: query2 });
      }
    });
  }



  doPrintPostCover2 = (shiptoNo: string = '') => {
    this.shiptoNoToPrint = '';

    if (shiptoNo) {
      this.shiptoNoToPrint = shiptoNo;
      this.onConfirmPrintCover();
      return;
    }

    this.getSentSampleHD();
    $('#printOptionRef').modal('show');

  }



  public doLoadSample2 = async () => {
    this.loading = true;
    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;

    if (objData != null) {

    }

    const currentDate: Date = new Date(); // Get the current date
    const firstDayOfMonth: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const formatDateString = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it is zero-based
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const fromDate: string = formatDateString(firstDayOfMonth);
    const toDate: string = formatDateString(lastDayOfMonth);

    //console.log('fromDate => ', fromDate);
    //console.log('toDate => ', toDate);

    const query = `SELECT it.*,MSSite.SiteName As SiteName
              FROM Requests it
              Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) 
              WHERE (convert(varchar(10), it.CreatedDate, 112) between '${fromDate}' and '${toDate}') and it.RequestStatus = 'Draft' and MSSite.SiteID = '${this.defaultValue.siteID}' `;

    const response = this.sentSampleService.query({ queryString: query });
    response.then(data => {
      console.log('data.data.response=> ', data.data.response);
      this.requestLists = data.data.response;
    });

  }






}

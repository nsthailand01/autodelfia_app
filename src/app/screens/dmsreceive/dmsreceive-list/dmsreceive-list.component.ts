import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { LISSentSampleHDModel, RequestsDTO, MSLabSampleTypeModel } from '@app/models';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
import { UtilitiesService, AuthenticationService, ToastrNotificationService } from '@app/services';
import { RepositoryService } from '@app/shared/repository.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RegisterRangeFormModel } from '@app/models/register-range-form.model';
import { OptionsReceiptForm } from '@app/models/option-receipt-form';
import { MssitePickerComponent, SentSamplehdPickerComponent, LabnumberPickerComponent } from '@app/pickers';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { RequestsModel } from '@app/models/requests.model';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { cloneDeep as _cloneDeep, differenceWith as _differenceWith, isEqual as _isEqual } from 'lodash';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
//import { async } from '@angular/core/testing';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
//import { BLACK_ON_WHITE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';

defineLocale('th', thBeLocale);
declare var $: any;

@Component({
  selector: 'app-dmsreceive-list',
  templateUrl: './dmsreceive-list.component.html',
  styleUrls: ['./dmsreceive-list.component.scss']
})



////DmsreceiveListComponent

export class DmsreceiveListComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Output() uploaded = new EventEmitter<any>();

  requestLists: Array<RequestsModel>;
  locale = 'th';
  rangeForm: FormGroup;
  public printBarcodeForm: FormGroup;
  optionsForm: FormGroup;
  public sentSampleLists: LISSentSampleHDModel[] = [];
  @Input() multiSelection: boolean = true;
  selection = new SelectionModel<RequestsModel>(true, []);
  itemSelection = new SelectionModel<any>(true, []);
  private requestsDTO: RequestsDTO;
  printPageConfig: any;
  shiptoNoToPrint: string = '';

  public displayedColumns: string[] =
    [
      'id', 'SentSampleDate', 'SentSampleNo',
      'ReceiveNo', 'status', 'percentage',
      'numberOfSamples', 'SiteName', 'EmployeeName', 'PatientNameLists',
      'details'
    ];
  public dataSource = new MatTableDataSource<LISSentSampleHDModel>();


  //@Input() itemLists: Array<RequestsModel>;
  public currentSampleToPrint: LISSentSampleHDModel;
  public itemLists: Array<RequestsModel>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public requester: string = '';
  isDisabled: boolean = true;

  @Input() CheckStatus: boolean = true;
  @ViewChild('btnSearch') btnSearch: ElementRef;
  @Input() referenceName: string = '';
  rangeSelectedValue: string = 'ThisMonth';
  @Output() public editShipment = new EventEmitter<any>();

  public bsModalRef: BsModalRef;
  private defaultValue = {
    siteID: '',
    siteName: '',
    userName: '',
    employeeID: '',
    employeeName: '',
    sentToSiteID: '',
    sentToSiteName: '',
    forScienceCenter: false
  };


  listPageSizes = [20, 50, 100, 200, 300, 500];
  public pageListConfig: any;
  dataArrayTest: any[] = [];
  originalItems: Array<RequestsModel> = [];
  public DataList: Array<RequestsModel>;
  //DataList: Array<RequestsModel> = [];
  public CheckStrResult = '';

  dateRange = [
    { value: 'LastYear', text: 'Last Year' },
    { value: 'LastMonth', text: 'Last Month' },
    { value: 'LastWeek', text: 'Last Week' },
    { value: 'ThisYear', text: 'This Year' },
    { value: 'ThisMonth', text: 'This Month' },
    { value: 'ThisWeek', text: 'This Week' },
    { value: 'Today', text: 'Today' },
    { value: 'All', text: 'All' },
  ];

  //sampleTypes = [
  //  { value: 'Paper', text: 'กระดาษ' },
  //  { value: 'Serum', text: 'ซีรั่ม' },
  //];


  //public sampleTypes: Array<MSLabSampleTypeModel>;
  public sampleTypes = [];

  public paperResults = [];

  sampleStatus = [
    { value: 'Received', text: 'Received' },
    { value: 'Rejected', text: 'Rejected' },
  ];

  constructor(
    private repoService: RepositoryService,
    private router: Router,
    private sentSampleService: SentSampleService,
    private utilService: UtilitiesService,
    public datepipe: DatePipe,
    private localeService: BsLocaleService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private requestsRepoService: RequestsRepoService,
    private notiService: ToastrNotificationService,
    private http: HttpClient,
  ) {
    super();


    this.localeService.use(this.locale);
    this.originalItems = _cloneDeep(this.itemLists);
    this.printPageConfig = {
      itemsPerPage: 15,
      currentPage: 1,
      totalItems: this.items.count
    };

    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.defaultValue.siteID = user?.data?.SecurityUsers?.SiteID;
        this.defaultValue.siteName = user?.data?.SecurityUsers?.SiteName;
        this.defaultValue.employeeID = user?.data?.SecurityUsers?.EmployeeID;
        this.defaultValue.sentToSiteID = user?.data?.SecurityUsers?.ParentSiteID;
      }
    });



    this.pageListConfig = {
      id: `itemListPage`,
      itemsPerPage: 100,
      currentPage: 1,
      totalItems: this.dataSource?.data?.length
    };



  }




  ngOnInit() {


    //const resultCheck = this.CheckStrResult;
    //console.log('result Check11 => ', resultCheck);
    this.getRefuse_verification();

    this.getSampleType();
    this.createInitialForm();
    this.createInitialRangeForm();

    this.rangeForm.get('dateRangeSelectedValue').valueChanges
      .subscribe(f => {
        this.onRangeChange();
      });

    this.optionsForm.patchValue({ sampleStatus: 'Received' });

    ///
    /*//this.optionsForm.patchValue({ paperResult: '1' });*/
    this.rangeForm.patchValue({
      //siteID: this.defaultValue.siteID,
      siteID: '',
      siteName: '',
      //siteName: this.defaultValue.siteName,
    });

    this.rangeForm.patchValue({ dateRangeSelectedValue: 'ThisMonth' });
    this.rangeForm.patchValue({ documentStatus: 'Approved' });

    this.optionsForm.patchValue({ paperResults: '0' });

    ////ถ้ามีปัญหาเอาฟังก์ชั่นนี้ comment ไว้
    //document.getElementById('btnSearch').click();
    //this.getData();
  }

  createInitialRangeForm = () => {
    this.rangeForm = this.fb.group(new RegisterRangeFormModel());
    this.optionsForm = this.fb.group(new OptionsReceiptForm());
  }

  triggerButtonClick() {
    this.btnSearch.nativeElement.click();
  }
  public getData = () => {

    this.spinner.show();

    const range = this.rangeForm.value;
    const siteID = range.siteID;
    const siteName = range.siteName;
    const fromSentSampleDate = this.datePipe.transform(range?.fromSentSampleDate, 'yyyyMMdd');
    const toSentSampleDate = this.datePipe.transform(range?.toSentSampleDate, 'yyyyMMdd');
    const fromBirthday = this.datePipe.transform(range?.fromBirthday, 'yyyyMMdd');
    const toBirthday = this.datePipe.transform(range?.toBirthday, 'yyyyMMdd');
    const fromReceiveSampleDate = this.datePipe.transform(range?.fromReceiveSampleDate, 'yyyyMMdd');
    const toReceiveSampleDate = this.datePipe.transform(range?.toReceiveSampleDate, 'yyyyMMdd');
    const hN = range.hN;
    const identityCard = range.identityCard;
    const nationality = range.nationality;
    const fromSentSampleNo = range.fromSentSampleNo;
    const toSentSampleNo = range.toSentSampleNo;
    const fromLabNumber = range.fromLabNumber;
    const toLabNumber = range.toLabNumber;
    const documentStatus = range.documentStatus;
    const hdInvoiceApi = range.hdInvoiceApi;
    let sqlWhere = '';


    //////เช็ค Site
    if (siteID != '') {
      //console.log('Thsi siteID => ', siteID);
      sqlWhere += sqlWhere ? ` and  req.SiteID = '${siteID}' ` : ` and  req.SiteID = '${siteID}'  `;
    }

    //////เช็ควันที่นำส่ง
    if (fromSentSampleDate && toSentSampleDate) {
      sqlWhere += (sqlWhere ? ` and ` : `and`) + `(convert(varchar(10), it.CreatedDate, 112) between '${fromSentSampleDate}' and '${toSentSampleDate}') `;
    } else if (fromSentSampleDate) {
      sqlWhere += (sqlWhere ? ` and ` : `and`) + `(convert(varchar(10), it.CreatedDate, 112) >= '${fromSentSampleDate}') `;
    } else if (toSentSampleDate) {
      sqlWhere += (sqlWhere ? ` and ` : `and`) + `(convert(varchar(10), it.CreatedDate, 112) <= '${toSentSampleDate}') `;
    }


    //////เช็ควันเกิด
    if (fromBirthday && toBirthday) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.Birthday, 112) between '${fromBirthday}' and '${toBirthday}') `;
    } else if (fromBirthday) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.Birthday, 112) >= '${fromBirthday}') `;
    } else if (toBirthday) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.Birthday, 112) <= '${toBirthday}') `;
    }

    ////เช็ควันที่รับตัวอย่าง
    if (fromReceiveSampleDate && toReceiveSampleDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.ReceiveDate, 112) between '${fromReceiveSampleDate}' and '${toReceiveSampleDate}') `;
    } else if (fromReceiveSampleDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.ReceiveDate, 112) >= '${fromReceiveSampleDate}') `;
    } else if (toReceiveSampleDate) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.ReceiveDate, 112) <= '${toReceiveSampleDate}') `;
    }

    /////เช้ค HN
    if (hN) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(req.hN = '${hN}') `;
    }


    ////เช็คบัตรประชาชน
    if (identityCard) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(req.identityCard = '${identityCard}') `;
    }


    /////เช็คสถานะ
    if (documentStatus) {
      //console.log('documentStatus => ',documentStatus);
      //console.log('This rangeData.documentStatus => ', rangeData.documentStatus);
      if (documentStatus !== 'All') {
        sqlWhere += (sqlWhere ? ` and ` : ``) + `(req.RequestStatus = '${documentStatus}') `;
      } else {
        sqlWhere += `  `;
      }
    }


    /////เช็คสัญชาติ
    if (nationality) {
      if (nationality == 'thaiOnly') {
        sqlWhere += (sqlWhere ? ` and ` : ``) + `(req.Nationality = 'thai') `;
      } else if (nationality == 'foreignerOnly') {
        sqlWhere += (sqlWhere ? ` and ` : ``) + `(req.Nationality = 'Foreigner') `;
      }
    }



    /////เช็คเลขที่ใบนำส่ง
    if (fromSentSampleNo && toSentSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + ` (it.SentSampleNo between '${fromSentSampleNo}' and '${toSentSampleNo}') `;
    } else if (fromSentSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + ` (it.SentSampleNo >= '${fromSentSampleNo}') `;
    } else if (toSentSampleNo) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + ` (it.SentSampleNo <= '${toSentSampleNo}') `;
    }




    /////Labnumber
    if (fromLabNumber && toLabNumber) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + ` (req.labNumber between '${fromLabNumber}' and '${toLabNumber}') `;
    } else if (fromLabNumber) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + ` (req.labNumber >= '${fromLabNumber}') `;
    } else if (toLabNumber) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + ` (req.labNumber <= '${toLabNumber}') `;
    }

    if (hdInvoiceApi == 'SSOPayment') {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(  it.PaymentFlag  = 'SSOPayment') `;

    }
    if (hdInvoiceApi == 'SitePayment') {
      //console.log('test');
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(  it.PaymentFlag  = 'SitePayment') `;
    }
    sqlWhere += ` and NOT EXISTS(select InvoiceDetail.requestid from InvoiceDetail where InvoiceDetail.requestid =it.requestid and ISNULL(InvoiceDetail.PaymentSatatus,'') <> 'Cancel' )`;

    //this.itemLists = data.lISSentSampleHDs;

    const querySelect = ` select DISTINCT it.RequestID,
       it.LabNumber,
	  it.RequestStatus ,
    it.DoctorAppvDate,
    (isnull(it.Title,'') + it.FirstName +' ' + it.LastName)FullName,
     MSSite.SiteCode,
    MSSite.SiteName,
    (Case isnull(it.PaymentFlag,'') when 'SSOPayment' then 'สปสช.' when 'SitePayment' then 'หน่วยงานส่งตรวจ' when 'CashPayment' then 'เงินสด' when 'AnyJobPayment' then 'โครงการอื่น ๆ' when 'OtherPayment'  then 'อื่น ๆ : ' + isnull(it.PaymentOther,'') else '' end)วิธีชำระเงิน,
    isnull(Customer.dmsc_id,'')customer_CustomerGroupID,
    ('')customer_IDCard,
  ('')customer_PrefixID,
  ('')customer_TaxID,
  (Customer.SiteName)customer_Firstname,
  ('')customer_LastName,
  ('')customer_Email,
  (Customer.tel)customer_PhoneNumber,
  ('')customer_MobileNumber,
  (Customer.Address)customer_AddressNumber,
  (Customer.Moo)customer_Moo,
  (Customer.Village)customer_Village,
  (Customer.Street)customer_Road,
  (Customer.Lane)customer_Soi,
  isnull(Province.code,'')customer_ProvinceID,
  isnull(Amphur.code,'')customer_DistrictID,
  isnull(District.code,'')customer_SubDistrictID,
  isnull(Customer.PostCode,'')customer_Postcode,
    (it.DmscInvoiceAndReceiptStatus)dmscInvoiceAndReceiptStatus,

  (ParentSite.dmsc_id)DepartmentID,
  (0)CreditTerm,
  ('ค่าธรรมเนียม' + ProfileName)Detail,
     it.Price,
  ('ค่าเก็บและขนส่งเลือดทางห้องปฏิบัติการ')Detail2,
  ( Case isnull(it.PaymentFlag,'') when 'SSOPayment' then 100.00 else 0.00 end)ShipmentPrice 
  ,Customer.Province
     ,it.[RequestCode]
      ,it.[ExternalNo]
      ,it.[RequestDate]
      ,it.[RequestByID]
      ,it.[BatchID]
      ,it.[ReceiveNo]
      ,it.[ReceiveDate]
      ,it.[ShiptoNo]
      ,it.[ShiptoDate]
      ,it.[NonShiptoDateFlag]
      ,it.[SampleTypeID]
      ,it.[ProfileID]
      ,it.[ReceiveByID]
      ,it.[LabNumber]
      ,it.[SentSampleID]
      ,it.[SentLabbyID]
      ,it.[SentLabTel]
      ,it.[RecieveResultby]
      ,it.[PatientID]
      ,it.[HN]
      ,it.[Title]
      ,it.[FirstName]
      ,it.[MiddleName]
      ,it.[LastName]
      ,it.[NickName]
      ,it.[IdentityCard]
      ,it.[TitleEng]
      ,it.[FirstNameEng]
      ,it.[MiddleNameEng]
      ,it.[LastNameEng]
      ,it.[NickNameEng]
      ,it.[Sex]
      ,it.[MaritalStatus]
      ,it.[Birthday]
      ,it.[Height]
      ,it.[Weight]
      ,it.[StartDate]
      ,it.[EndDate]
      ,it.[DueDate]
      ,it.[Address]
      ,it.[Moo]
      ,it.[RoomNo]
      ,it.[FloorNo]
      ,it.[Building]
      ,it.[Village]
      ,it.[Lane]
      ,it.[Street]
      ,it.[District]
      ,it.[Amphur]
      --,it.[Province]
      ,it.[PostCode]
      ,it.[SiteID]
      ,it.[BloodGroups]
      ,it.[Race]
      ,it.[Nationality]
      ,it.[Religion]
      ,it.[PregnantNo]
      ,it.[PregnantFlag]
      ,it.[NumberofOther]
      ,it.[PregnantType]
      ,it.[PregnantTypeOther]
      ,it.[RiskAnalystAgeFlag]
      ,it.[GAAgeWeeks]
      ,it.[GAAgeDays]
      ,it.[UltrasoundDate]
      ,it.[UltrasoundFlag]
      ,it.[Ultrasound_BPD]
      ,it.[Ultrasound_CRL]
      ,it.[LMPWeeks]
      ,it.[LMPDays]
      ,it.[LMPDate]
      ,it.[Ultrasound_NT]
      ,it.[Ultrasound_UTPI_LUA]
      ,it.[Ultrasound_UTPI_RUA]
      ,it.[BloodPressureDate]
      ,it.[BloodPressureLeftSyst1]
      ,it.[BloodPressureLeftDiast1]
      ,it.[BloodPressureLeftSyst2]
      ,it.[BloodPressureLeftDiast2]
      ,it.[BloodPressureRightSyst1]
      ,it.[BloodPressureRightDiast1]
      ,it.[BloodPressureRightSyst2]
      ,it.[BloodPressureRightDiast2]
      ,it.[SampleDate]
      ,it.[SalumIntersectionDate]
      ,it.[SavetoNHSOStatus]
      ,it.[SavetoNHSODate]
      ,it.[SavetoNHSOByID]
      ,it.[NonSaveToNHSOFlag]
      ,it.[NonSaveToNHSORemark]
      ,it.[AnalystDate]
      ,it.[CreatedBy]
      ,it.[CreatedDate]
      ,it.[ModifiedBy]
      ,it.[IsDeleted]
      ,it.[ModifiedDate]
      ,it.[NoofSon]
      ,it.[NoofDaughter]
      ,it.[Remark]
      ,it.[LabAppvFlag]
      ,it.[LabAppvDate]
      ,it.[LabAppvComment]
      ,it.[LabMGRAppvFlag]
      ,it.[LabMGRAppvDate]
      ,it.[LabMGRAppvComment]
      ,it.[DoctorAppvFlag]
      --,it.[DoctorAppvDate]
      ,it.[DoctorAppvComment]
      ,it.[Picture]
      --,it.[RequestStatus]
      ,it.[PhoneNo]
      ,it.[IsExported]
      ,it.[ExportedDate]
      ,it.[IsImported]
      ,it.[ImportedDate]
      ,it.[PaymentFlag]
      ,it.[PaymentNo]
      ,it.[PaymentOther]
      ,it.[AnsValuePlain_AFP]
      ,it.[AnsValuePlain_HCGB]
      ,it.[AnsValuePlain_INHIBIN]
      ,it.[AnsValuePlain_UE3UPD]
      ,it.[AnsValueCorrMoM_AFP]
      ,it.[AnsValueCorrMoM_HCGB]
      ,it.[AnsValueCorrMoM_INHIBIN]
      ,it.[AnsValueCorrMoM_UE3UPD]
      ,it.[RiskValueT21]
      ,it.[RiskValueT18]
      ,it.[RiskValueT13]
      ,it.[RiskValueNTD]
      ,it.[RiskCutOffT21]
      ,it.[RiskCutOffT18]
      ,it.[RiskCutOffT13]
      ,it.[RiskCutOffNTD]
      ,it.[RiskAssessmentValueT21]
      ,it.[RiskAssessmentValueT18]
      ,it.[RiskAssessmentValueT13]
      ,it.[RiskAssessmentValueNTD]
      ,it.[CD1AgeAtDeliveryDate]
      ,it.[CD1DeliveryDate]
      ,it.[CD1AgeAtExtraction]
      ,it.[SD1GestAtSampleDate]
      ,it.[USSD1GestAtSampleDate]
      ,it.[RiskAgeT21]
      ,it.[RiskEnumValueTwinT21]
      ,it.[RiskValueTwinT21]
      ,it.[RiskAgeT18]
      ,it.[RiskEnumValueTwinT18]
      ,it.[RiskValueTwinT18]
      ,it.[RiskAgeNTD]
      ,it.[RiskValueTwinNTD]
      ,it.[RiskValueTwin1TNTD]
      ,it.[RiskAgeT13]
      ,it.[RiskEnumValueTwinT13]
      ,it.[RiskValueTwinT13]
      ,it.[HpvReceiveStatus]
      ,it.[HpvPostToCxs2020Status]
      ,it.[LabTestDate]
      ,it.[LabResultDate]
      ,it.[LabStaff]
      ,it.[LabResult]
      ,it.[ArtificialInseminationFlag]
      ,it.[ArtificialInseminationValue]
      ,it.[OvumCollectDate]
      ,it.[EmbryoTransferDate]
      ,it.[DonorBirthdate]
      ,it.[BloodDrawingTime]
      ,it.[SerumSeparateTime]
      ,it.[GAAgeTotalDays]
      ,it.[RaceLifeCycleCode]
      ,it.[ReportDate]
      ,it.[ReportNo]
      ,it.[ReportBy]
      ,it.[SentReportNo]
      ,it.[SentReportDate]
      ,it.[SentNo]
      ,it.[ApproveByID]
      ,it.[ReportByID]
      ,it.[SampleStyle]
      ,it.[ResultType]
      ,it.[FetalSex]
      ,it.[RiskResultT21Downs]
      ,it.[RiskResultT18Edwards]
      ,it.[RiskResultT13Patau]
      ,it.[RiskValueT21Downs]
      ,it.[RiskValueT18Edwards]
      ,it.[RiskValueT13Patau]
      ,it.[RiskCutOffT21Downs]
      ,it.[RiskCutOffT18Edwards]
      ,it.[RiskCutOffT13Patau]
      ,it.[RiskResultZScoreT21]
      ,it.[RiskResultZScoreT18]
      ,it.[RiskResultZScoreT13]
      ,it.[RiskValueZScoreT21]
      ,it.[RiskValueZScoreT18]
      ,it.[RiskValueZScoreT13]
      ,it.[RiskCutOffZScoreT21]
      ,it.[RiskCutOffZScoreT18]
      ,it.[RiskCutOffZScoreT13]
      ,it.[ChromeT21Value]
      ,it.[ChromeT18Value]
      ,it.[ChromeT13Value]
      ,it.[ChromeT21SD]
      ,it.[ChromeT18SD]
      ,it.[ChromeT13SD]
      ,it.[AmnioticDate]
      ,it.[AmnioticLab]
      ,it.[AmnioticGAWeek]
      ,it.[AmnioticGADays]
      ,it.[AmnioticAnalysTechnique]
      ,it.[AmnioticOtherTechnique]
      ,it.[AmnioticChromosomeAbnormal]
      ,it.[AmnioticOtherAbnormal]
      ,it.[AmnioticMiscarriage]
      ,it.[AmnioticRecorder]
      ,it.[AmnioticPhoneNo]
      ,it.[AmnioticAnalysisReportFile]
      ,it.[AmnioticPhysicalFileName]
      ,it.[NiptGAAgeTotalDays]
      ,it.[NiptGAAgeWeeks]
      ,it.[NiptGAAgeDays]
      ,it.[NiptTestValueChrT21]
      ,it.[NiptTestValueChrT18]
      ,it.[NiptTestValueChrT13]
      ,it.[NiptSDChrT21]
      ,it.[NiptSDChrT18]
      ,it.[NiptSDChrT13]
      ,it.[EDCDate]
      ,it.[Uncertain_LMP]
      ,it.[Corrected_EDCDate]
      ,it.[Corrected_GA]
      ,it.[Ultrasoundby]
      ,it.[Ultrasound_GA]
      ,it.[Ultasound_Detail]
      ,it.[NT_Test]
      ,it.[CRL_Detail]
      ,it.[ART]
      ,it.[ART_Technical]
      ,it.[ART_Detail]
      ,it.[GAbyLMP]
      ,it.[ERExportFlag]
      ,it.[Import_FileName]
      ,it.[SampleType]
      ,it.[FilterPaperCompleteness]
      ,it.[ReceiptRemark]
      --,it.[Price]
     --,it.[DmscInvoiceAndReceiptStatus]


                            from Requests it

                            Left Outer Join MSLabProfile on MSLabProfile.ProfileID =it.ProfileID
                            Left Outer Join MSSite  On (MSSite.SiteID = it.SiteID) 
                            --Left Outer Join MSSite ON MSSite.SiteID = it.SiteID
                            Left Outer Join Requests as req On (req.SentSampleID = it.SentSampleID)
                            LEFT Outer Join MSSite ParentSite On ( ParentSite.SiteID = isnull(MSSite.ParentSiteID, MSSite.SiteID)  and ParentSite.SiteFlag ='P')
                            Left Outer JOin MSSite SSO ON SSO.SiteCode ='สปสช'
                            Left Outer Join MSSite Customer ON  Customer.SiteID = ( Case isnull(it.PaymentFlag,'') when 'SSOPayment' then SSO.SiteID when 'SitePayment' then it.SiteID else it.SiteID end)
                            Left Outer Join DMSC_ProvinceInfo Province ON   ( Province.text =Customer.Province or  'จ.' + Province.text =Customer.Province or  'จังหวัด' + Province.text =Customer.Province or (Province.text ='กรุงเทพมหานคร' and Customer.Province in ('กรุงเทพฯ','กทม','กทม.','กรุงเทพ'))) 
                            Left Outer Join DMSC_DistrictInfo Amphur ON  Amphur.ProvinceID_API =Province.code and ( Amphur.text =Customer.Amphur or  'จ.' +  Amphur.text =Customer.Amphur or  'อำเภอ' +  Amphur.text =Customer.Amphur) 
                            Left Outer Join DMSC_SubDistrictInfo District ON   District.ProvinceID_API  =Province.code and  District.DistrictID_API =Amphur.code 
                            and   ( District.text =Customer.District or  'ต.' + District.text =Customer.District or  'ตำบล' + District.text =Customer.District) 
                        Where 1=1 ${sqlWhere} 
                         `;





    //console.log('this.sqlWhere => ', sqlWhere);
    //console.log('this.querySelect => ', querySelect);


    const response = this.sentSampleService.query({ queryString: querySelect });
    response.then(data => {
      //console.log('data => ',data);
      this.spinner.hide();
      for (let el of data.data.response) {
        this.spinner.hide();
        this.itemLists = data.data.response;

        //console.log('elklll -> ', el);
      }
    });

  }



  createInitialForm() {
    this.requestLists = new Array<RequestsModel>();
    this.printBarcodeForm = this.fb.group({
      fromSentSampleNo: [''],
      toSentSampleNo: [''],
      fromSampleNo: [''],
      toSampleNo: ['']
    });
  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public onRangeChange = () => {
    //////// const range = this.utilService.getDateRange(this.rangeSelectedValue);
    const rangeValue = this.rangeForm.get('dateRangeSelectedValue').value;
    const range = this.utilService.getDateRange(rangeValue);

    this.rangeForm.patchValue({
      fromSentSampleDate: range ? range.start : null,
      toSentSampleDate: range ? range.end : null
    });


    //this.getData();
    /////// console.log('range >> ', range);
  }

  public customSort = (event) => {
    console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (id: string) => {
    const model: LISSentSampleHDModel = {} as LISSentSampleHDModel;
    model.sentSampleID = id;
    sessionStorage.setItem('LISSentSampleHDDataStorage', JSON.stringify(model));
    this.router.navigate(['/receive-sample/edit']);
  }

  public redirectToUpdate = (id: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully </br>ccccccccccccc</br> cccccccccccccc'
    });
  }

  public redirectToDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to delete this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.repoService.delete('api/LISSentSampleHD/delete', [{ SentSampleID: id }])
          // tslint:disable-next-line: deprecation
          .subscribe((res) => {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            ).then(() => {
              this.getData();
            });
          });
      }
    });
  }

  public onCreateNew = () => {
    sessionStorage.removeItem('LISSentSampleHDDataStorage');
    this.router.navigate(['/receive-sample/create']);
  }



  /////Function NewSearch

  clearSite = () => {
    this.rangeForm.patchValue({
      siteID: '',
      siteName: '',
      sentToSiteID: '',
      sentToSiteName: ''
    });
  }



  openMSSitePicker() {
    const initialState = {
      list: [
        this.rangeForm.get('siteCode').value
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
        this.rangeForm.patchValue({
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

  dateInputChange = (ev) => {
    // console.log('date change : ', ev);
  }


  fromReceiveSampleDateInputChange = (ev) => {
    this.rangeForm.patchValue({
      toReceiveSampleDate: ev
    })
  }


  fromBabeDoBChange = (ev) => {
    this.rangeForm.patchValue({
      toBabeDateOfBirth: ev
    })
  }

  fromSentSampleNoKeyup = (ev) => {
    this.rangeForm.patchValue({
      toSentSampleNo: ev.target.value
    })
  }

  fromSampleNoKeyup = (ev) => {
    this.rangeForm.patchValue({
      toLabNumber: ev.target.value
    })
  }

  doSearchClick = () => {
    ////console.log('tttt => ', this.rangeForm);
    //this.uploaded.emit(this.rangeForm);



    ////this.getData();
    //console.log('', this.getData());


    const rangeData = this.rangeForm.value;
    if (rangeData.hdInvoiceApi == '') {
      return Swal.fire({
        icon: 'error',
        title: 'คำเตือน',
        html: `กรุณาเลือกช่องทางการส่ง Api`,
        allowOutsideClick: false,
      });
    } else {
      this.uploaded.emit(this.rangeForm);
      //this.getData();
      console.log('', this.getData());
    }


  }



  getSampleType = () => {
    const sample = {
      sqlSelect: ``,
      sqlWhere: ``,
      sqlOrder: `SampleTypeName Asc`
    };
    this.getMSLabSampleType(sample)
      .subscribe((response) => {
        response = this.utilService.camelizeKeys(response);



        const types: MSLabSampleTypeModel[] = response.data.mSLabSampleTypes;

        if (types.length > 0) {

          this.sampleTypes = [];


          //console.log('nnnnn => ', types);

          types.forEach((t) => {
            const n = { value: t.sampleTypeCode, text: t.sampleTypeName };
            //this.sampleTypes = data;
            this.sampleTypes.push(n);
          })

          let found = types.find((element) => {
            return element.isDefault == true;
          });

          this.optionsForm.patchValue({ sampleType: found?.sampleTypeCode });

        } else {
        }
      }, (err) => {
        console.log('load sample-type error >> ', err);
      });
  }


  getMSLabSampleType(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
  }



  getRefuse_verification() {
    const query = ` SELECT  Value
                           ,RefuseNameTH
                    FROM Refuse_verification
                    ORDER BY SortOrder ASC
                         `;
    const response = this.sentSampleService.query({ queryString: query });
    response.then(data => {
      //console.log('Response => ', data.data.response);
      for (let el of data.data.response) {
        const n = { value: el.value, text: el.refuseNameTH };
        this.paperResults.push(n);
      }
    });
  }



  doSaveReceiptSample = async () => {


    ///////NewFunctionSaveData
    const prepare = await this.doPrepareSaveReceipt();

  }



  doPrepareSaveReceipt = async (): Promise<boolean> => {
    //console.log('ssssssss'); this.spinner.show();

    try {
      const requests = this.itemLists.filter(r => (r.isSelected));
      const rangeOptionForm = this.optionsForm.value;
      //console.log('This Value In Value => ', rangeOptionForm);

      const sampleType = rangeOptionForm.sampleType;
      const sampleStatus = rangeOptionForm.sampleStatus;
      const paperResult = rangeOptionForm.paperResult;
      const remark = rangeOptionForm.remark;
      let respaper = '';
      if (paperResult != null) {
        //console.log('check!=');
        respaper = rangeOptionForm.paperResult;
      } else {
        //console.log('check==');
        respaper = '';
      }

      this.spinner.show();
      if (requests.length > 0) {

        for (let el of requests) {

          if (sampleStatus == 'Rejected') {
            const query = `
                           update  Requests
                           set RequestStatus = '${sampleStatus}'
                              ,SampleType = '${sampleType}'
                              ,FilterPaperCompleteness = '${respaper}'
                              ,ReceiptRemark = '${remark}'
                           where RequestID =  '${el.requestID}'
                         `;
            const response = this.sentSampleService.query({ queryString: query });
          } else {
            const query = `
                           update  Requests
                           set RequestStatus = '${sampleStatus}'
                              ,SampleType = '${sampleType}'
                              ,FilterPaperCompleteness = '${respaper}'
                              ,ReceiptRemark = '${remark}'
                              ,ReceiveDate = GETDATE()
                           where RequestID =  '${el.requestID}'
                         `;
            const response = this.sentSampleService.query({ queryString: query });
          }

        }

        document.getElementById('btnSearch').click();
        this.getData();
        this.spinner.hide();
        this.notiService.showSuccess('Save Successfully.');
        document.getElementById('btnSearch').click();
        this.getData();
      } else {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'กรุณาเลือกรายการ!',
          html: `กรุณาเลือกรายก่อนรับตัวอย่าง`,
          allowOutsideClick: false,
        });
      }

      document.getElementById('btnSearch').click();
      this.getData();

    } catch (err) {

    }

    //try {
    //  const now = new Date();
    //  now.setTime(now.getTime() + 7 * 60 * 60 * 1000);

    //  const requests = this.requestLists.filter(r => (r.isSelected));
    //  console.log('ThisRequests => ', requests);
    //  requests.forEach((req) => {
    //    req.receiveDate = now;
    //    req.sampleType = this.optionsForm.get('sampleType').value;
    //    req.requestStatus = this.optionsForm.get('sampleStatus').value;
    //    req.filterPaperCompleteness = this.optionsForm.get('paperResult').value;
    //    req.receiptRemark = this.optionsForm.get('remark').value;
    //    //req.appCode = 'Nbs';
    //  });

    //  // this.sentSampleDto.LISSentSampleHDs = [Object.assign({}, this.sentSampleForm.value)];
    //  // this.sentSampleDto.Requests = Object.assign([], this.itemLists);

    //  this.requestsDTO.Requests = Object.assign([], requests);
    //  //this.requestsDTO.AppCode = 'Nbs';

    //} catch (err) {
    //  console.error('error ', err);
    //  this.handleError(err);
    //  return false;
    //}
    return true;
  }

  doValidateSaveReceipt = async (): Promise<boolean> => {
    if (this.requestLists.length == 0) {
      this.notiService.showWarning('ไม่พบข้อมูลสำหรับบันทึก', '');
      return false;
    }

    return true;
  }



  doPostSaveReceiptSample = async (sample: any) => {
    //const trackingList = [];
    //const now = new Date();
    //now.setTime(now.getTime() + 7 * 60 * 60 * 1000);    // timeZone +7

    //const requests = this.requestLists.filter(r => (r.isSelected));
    //console.log('requests => ', requests);
    //requests.forEach((req) => {
    //  const tracking: IConfirmDeliveredBulk = {
    //    orderno: req.shiptoNo,
    //    trackingno: req.trackingNo,
    //    status: `1200`,
    //    status_date: now
    //  }

    //  trackingList.push(tracking);
    //});

    //const data = {
    //  "tracklist": trackingList,
    //  "token": "xxxxx.xxxxx.xxxxx"
    //}

    //console.log('data to confirm => ', data);

    //try {
    //  this.loading = true;
    //  const confirmBulk = await this.repoService.postThaiPostAPI(`ConfirmDeliveredBulk`, data).toPromise();
    //  this.loading = false;
    //  return confirmBulk;

    //} catch (err) {
    //  console.log('get tracking no error => ', err);
    //  this.notiService.showError(err?.message);
    //  this.loading = false;
    //}
  }





  doGetSampleByBarcode = () => {
    this.createInitialForm();    // reset value
    this.router.navigate(['get-sample', 'barcode']);

  }

  doPrintBarcodeMultiple = () => {
    $('#printBarcodeMultipleRef').modal('show');
  }


  pageListChanged(event: any) {
    // console.log('event page => ', event);
    this.pageListConfig.currentPage = event;
  }



  handlePageSizeChange(event): void {
    this.pageListConfig.currentPage = 1;
  }

  isAllCheckBoxChecked() {

  }



  checkAllCheckBox(ev: any) {


    //this.itemLists.forEach(x => {
    //  if (this.requester == 'sent-sample') {
    //    // กรณีลงทะเบียน & สร้างใบนำส่ง
    //    if (x.shipmentNo || x.isNew || x.isEdit || x.requestStatus?.toLowerCase() != 'draft') {
    //      x.isSelected = false;
    //    } else {
    //      x.isSelected = ev.checked;
    //    }
    //  } else {
    //    x.isSelected = ev.checked;
    //  }
    //});


    for (let el of this.itemLists) {
      el.isSelected = ev.checked;

    }



  }






  onCheckedChange = (ev: any, item: any) => {


    if (this.requester == 'sent-sample') {
      if (item.shiptoNo) {
        ev.source.checked = false;
        item.isSelected = false;
        return Swal.fire({
          icon: 'error',
          title: 'คนไข้รายนี้ได้ทำการสร้างใบนำส่งแล้ว!',
          html: `เลขที่ใบนำส่ง [${item.shiptoNo}]`,
          // footer: '<a href="">Why do I have this issue?</a>'
          allowOutsideClick: false,
        });
      }

      if (item.isNew || item.isEdit) {
        ev.source.checked = false;
        item.isSelected = false;
        return Swal.fire({
          icon: 'error',
          title: 'คนไข้รายนี้เป็นรายการใหม่ หรือมีการแก้ไข!',
          html: `กรุณาบันทึกก่อนเลือกรายการ`,
          allowOutsideClick: false,
        });
      }

    }



    this.highlightRow(item);
  }



  doSaveReceiptClick = (ev: any) => {

    //// ถ้าค้นหาไม่ได้ให้ commemnt ส่วนนี้ทิ้งไว้
    this.doSaveReceiptSample();

  }

  public highlightRow(item: any) {
    // this.selectedItem = item;
    this.itemSelection.toggle(item);

    //this.doSaveReceiptClick(item,0);
  }



  onPrintBarcodeClick = async (item: any) => {
    this.goToReport('LabNoBarcodeReport', item);
  }


  goToReport(reportName: string, item: any) {
    const encryptedData = this.encryptUsingAES256({
      reportName,
      parameters: {
        sqlWhere: `it.LabNumber='${item.labNumber}'`,
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


  doPrintRegisterForm = async (item: any) => {
    //this.goToReport('NbsRegisterBloodBlottingPaperForm', item);
  }


  doEditShipment = (item: any) => {
    console.log('emit => ', item);
    this.editShipment.emit(item);
  }



  onSelectChange(event: any) {
    const selectedValue = event.target.value;
    //console.log('Selected value:', selectedValue);
    if (selectedValue == 'Received') {
      $('#input-paperResult').attr('disabled', 'disabled');
      this.optionsForm.patchValue({ paperResult: '0' });
      //this.isDisabled = true;
    }
    if (selectedValue == 'Rejected') {
      //this.isDisabled = false;
      $('#input-paperResult').removeAttr('disabled');
      this.optionsForm.patchValue({ paperResult: '1' });
    }

  }

  setRowSelectedCheck($event) {
    //console.log('Event => ', $event);

  }

  isAllSelected() {
    //console.log('This Selected');
    //console.log('this.selection.selected => ', this.selection.selected.length);
    //return this.selection.selected.length == 0;
    return this.selection.selected.length > 0;
  }

  masterToggle() {

    this.isAllSelected() ?

      this.selection.clear() :
      this.itemLists.forEach((row) => {


        if (this.selection.selected.length <= 1000) {
          this.selection.select(row);
          //console.log('this this.isAllSelected()=> ', this.isAllSelected());
        } else {
          return Swal.fire({
            icon: 'error',
            title: 'คำเตือน',
            html: `เลือกข้อมูลได้ครั้งละไม่เกิน 1001 รายการ`,
            allowOutsideClick: false,
          });
        }
      });
  }

  onCloseModalRef = (modalId: string) => {
    $(`${modalId}`).modal('hide');
  }






  openSentSamplehdPicker = (name: string) => {
    const initialState = {
      list: [
        // this.printBarcodeForm.get('sentSampleID').value
      ],
      whereClause: `it.SiteFlag != 'P'`,
      siteID: this.defaultValue.forScienceCenter ? null : this.defaultValue.siteID,
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






  openLabNumberPicker = (name: string) => {
    //console.log('thiss => ', this.defaultValue.siteID);
    const fromSentSampleNo = this.printBarcodeForm.get('fromSentSampleNo').value;
    const initialState = {
      list: [
        // this.printBarcodeForm.get('sentSampleID').value
      ],

      ////เอาอันนี้ออก

      //whereClause: this.defaultValue.forScienceCenter ? null : `SiteID = '${this.defaultValue.siteID}'`,
      siteID: this.defaultValue.forScienceCenter ? null : this.defaultValue.siteID,
      shiptoNo: fromSentSampleNo ? fromSentSampleNo : null,
      title: 'เลขตัวอย่าง',
      class: 'my-class'
    };



    this.bsModalRef = this.bsModalService.show(LabnumberPickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
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



  selectedSentSampleRow = (item: any, ev: any) => {
    //console.log('item => ', item);
    this.currentSampleToPrint = item;
    this.shiptoNoToPrint = item.SentSampleNo;
  }

  printPageChanged(event: any) {
    this.printPageConfig.currentPage = event;
  }


  onConfirmPrintBarcodeMultiple = () => {
    // $(this.printBarcodeMultipleRef.nativeElement).modal('hide');
    $('#printBarcodeMultipleRef').modal('hide');

    const fromSentSampleNo = this.printBarcodeForm.get('fromSentSampleNo').value;
    const fromSampleNo = this.printBarcodeForm.get('fromSampleNo').value;
    const toSampleNo = this.printBarcodeForm.get('toSampleNo').value;

    let where = fromSentSampleNo ? `it.shiptoNo='${fromSentSampleNo}'` : ``;
    if (fromSampleNo && toSampleNo) {
      where += where ? ` AND (it.LabNumber BETWEEN '${fromSampleNo}' AND '${toSampleNo}')` : `(it.LabNumber BETWEEN '${fromSampleNo}' AND '${toSampleNo}')`;
    } else if (fromSampleNo) {
      where += where ? ` AND (it.LabNumber >= '${fromSampleNo}' )` : `(it.LabNumber >= '${fromSampleNo}' )`;
    } else if (toSampleNo) {
      where += where ? ` AND (it.LabNumber <= '${toSampleNo}' )` : `(it.LabNumber <= '${toSampleNo}' )`;
    }

    ////เอาออก
    //if (!this.defaultValue.forScienceCenter) {
    //  where += where ? ` AND (it.SiteID = '${this.defaultValue.siteID}')` : ` (it.SiteID = '${this.defaultValue.siteID}') `;
    //}

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




  doPrintNewForm = async (item: any) => {
    //console.log('เข้าาาา => ', item);

    if (item.requestID != '') {


      let where = `it.RequestID='${item.requestID}'`;
      const encryptedData = this.encryptUsingAES256({
        //reportName: `RegisterBloodBlottingPaperForm`,
        reportName: `RegisterBloodBlottingPaperFormTest`,
        parameters: {
          sqlWhere: where ? where : `(1=0)`,
        }
      })
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


  }



  /////Function NewSearch









  ////Send Api
  radioButtonChange = (event: any) => {

    if (event.value == "SSOPayment") {
      return Swal.fire({
        icon: 'error',
        title: 'คำเตือน',
        html: `กรุณากดค้นหาทุกครั้ง ก่อนส่ง Api`,
        allowOutsideClick: false,
      });
    }
    if (event.value == "SitePayment") {
      return Swal.fire({
        icon: 'error',
        title: 'คำเตือน',
        html: `กรุณากดค้นหาทุกครั้ง ก่อนส่ง Api`,
        allowOutsideClick: false,
      });
    }
  }



  doSendApiInvoice = async () => {
    const rangeData = this.rangeForm.value;
    if (rangeData.hdInvoiceApi == '') {
      return Swal.fire({
        icon: 'error',
        title: 'คำเตือน',
        html: `กรุณาเลือกช่องทางการส่ง Api`,
        allowOutsideClick: false,
      });
    } else {
      try {
        const item = '';
        const rangeData = this.rangeForm.value;
        this.spinner.show();
        if (this.selection.selected.length > 0) {

          if (rangeData.hdInvoiceApi == 'SSOPayment') {

            const query = `
            select top(1) it.RequestID,
       it.LabNumber,
	  it.RequestStatus ,
    it.DoctorAppvDate,
    (isnull(it.Title,'') + it.FirstName +' ' + it.LastName)FullName,
     MSSite.SiteCode,
    MSSite.SiteName,
    (Case isnull(it.PaymentFlag,'') when 'SSOPayment' then 'สปสช.' when 'SitePayment' then 'หน่วยงานส่งตรวจ' when 'CashPayment' then 'เงินสด' when 'AnyJobPayment' then 'โครงการอื่น ๆ' when 'OtherPayment'  then 'อื่น ๆ : ' + isnull(it.PaymentOther,'') else '' end)วิธีชำระเงิน,
    isnull(Customer.dmsc_id,'')customer_CustomerGroupID,
    ('')customer_IDCard,
  ('')customer_PrefixID,
  ('')customer_TaxID,
  (Customer.SiteName)customer_Firstname,
  ('')customer_LastName,
  ('')customer_Email,
  (Customer.tel)customer_PhoneNumber,
  ('')customer_MobileNumber,
  (Customer.Address)customer_AddressNumber,
  (Customer.Moo)customer_Moo,
  (Customer.Village)customer_Village,
  (Customer.Street)customer_Road,
  (Customer.Lane)customer_Soi,
  isnull(Province.code,'')customer_ProvinceID,
  isnull(Amphur.code,'')customer_DistrictID,
  isnull(District.code,'')customer_SubDistrictID,
  isnull(Customer.PostCode,'')customer_Postcode,


  (ParentSite.dmsc_id)DepartmentID,
  (0)CreditTerm,
  ('ค่าธรรมเนียม' + ProfileName)Detail,
     it.Price,
  ('ค่าเก็บและขนส่งเลือดทางห้องปฏิบัติการ')Detail2,
  ( Case isnull(it.PaymentFlag,'') when 'SSOPayment' then 100.00 else 0.00 end)ShipmentPrice 
  ,Customer.Province
     ,it.[RequestCode]
      ,it.[ExternalNo]
      ,it.[RequestDate]
      ,it.[RequestByID]
      ,it.[BatchID]
      ,it.[ReceiveNo]
      ,it.[ReceiveDate]
      ,it.[ShiptoNo]
      ,it.[ShiptoDate]
      ,it.[NonShiptoDateFlag]
      ,it.[SampleTypeID]
      ,it.[ProfileID]
      ,it.[ReceiveByID]
      ,it.[LabNumber]
      ,it.[SentSampleID]
      ,it.[SentLabbyID]
      ,it.[SentLabTel]
      ,it.[RecieveResultby]
      ,it.[PatientID]
      ,it.[HN]
      ,it.[Title]
      ,it.[FirstName]
      ,it.[MiddleName]
      ,it.[LastName]
      ,it.[NickName]
      ,it.[IdentityCard]
      ,it.[TitleEng]
      ,it.[FirstNameEng]
      ,it.[MiddleNameEng]
      ,it.[LastNameEng]
      ,it.[NickNameEng]
      ,it.[Sex]
      ,it.[MaritalStatus]
      ,it.[Birthday]
      ,it.[Height]
      ,it.[Weight]
      ,it.[StartDate]
      ,it.[EndDate]
      ,it.[DueDate]
      ,it.[Address]
      ,it.[Moo]
      ,it.[RoomNo]
      ,it.[FloorNo]
      ,it.[Building]
      ,it.[Village]
      ,it.[Lane]
      ,it.[Street]
      ,it.[District]
      ,it.[Amphur]
      --,it.[Province]
      ,it.[PostCode]
      ,it.[SiteID]
      ,it.[BloodGroups]
      ,it.[Race]
      ,it.[Nationality]
      ,it.[Religion]
      ,it.[PregnantNo]
      ,it.[PregnantFlag]
      ,it.[NumberofOther]
      ,it.[PregnantType]
      ,it.[PregnantTypeOther]
      ,it.[RiskAnalystAgeFlag]
      ,it.[GAAgeWeeks]
      ,it.[GAAgeDays]
      ,it.[UltrasoundDate]
      ,it.[UltrasoundFlag]
      ,it.[Ultrasound_BPD]
      ,it.[Ultrasound_CRL]
      ,it.[LMPWeeks]
      ,it.[LMPDays]
      ,it.[LMPDate]
      ,it.[Ultrasound_NT]
      ,it.[Ultrasound_UTPI_LUA]
      ,it.[Ultrasound_UTPI_RUA]
      ,it.[BloodPressureDate]
      ,it.[BloodPressureLeftSyst1]
      ,it.[BloodPressureLeftDiast1]
      ,it.[BloodPressureLeftSyst2]
      ,it.[BloodPressureLeftDiast2]
      ,it.[BloodPressureRightSyst1]
      ,it.[BloodPressureRightDiast1]
      ,it.[BloodPressureRightSyst2]
      ,it.[BloodPressureRightDiast2]
      ,it.[SampleDate]
      ,it.[SalumIntersectionDate]
      ,it.[SavetoNHSOStatus]
      ,it.[SavetoNHSODate]
      ,it.[SavetoNHSOByID]
      ,it.[NonSaveToNHSOFlag]
      ,it.[NonSaveToNHSORemark]
      ,it.[AnalystDate]
      ,it.[CreatedBy]
      ,it.[CreatedDate]
      ,it.[ModifiedBy]
      ,it.[IsDeleted]
      ,it.[ModifiedDate]
      ,it.[NoofSon]
      ,it.[NoofDaughter]
      ,it.[Remark]
      ,it.[LabAppvFlag]
      ,it.[LabAppvDate]
      ,it.[LabAppvComment]
      ,it.[LabMGRAppvFlag]
      ,it.[LabMGRAppvDate]
      ,it.[LabMGRAppvComment]
      ,it.[DoctorAppvFlag]
      --,it.[DoctorAppvDate]
      ,it.[DoctorAppvComment]
      ,it.[Picture]
      --,it.[RequestStatus]
      ,it.[PhoneNo]
      ,it.[IsExported]
      ,it.[ExportedDate]
      ,it.[IsImported]
      ,it.[ImportedDate]
      ,it.[PaymentFlag]
      ,it.[PaymentNo]
      ,it.[PaymentOther]
      ,it.[AnsValuePlain_AFP]
      ,it.[AnsValuePlain_HCGB]
      ,it.[AnsValuePlain_INHIBIN]
      ,it.[AnsValuePlain_UE3UPD]
      ,it.[AnsValueCorrMoM_AFP]
      ,it.[AnsValueCorrMoM_HCGB]
      ,it.[AnsValueCorrMoM_INHIBIN]
      ,it.[AnsValueCorrMoM_UE3UPD]
      ,it.[RiskValueT21]
      ,it.[RiskValueT18]
      ,it.[RiskValueT13]
      ,it.[RiskValueNTD]
      ,it.[RiskCutOffT21]
      ,it.[RiskCutOffT18]
      ,it.[RiskCutOffT13]
      ,it.[RiskCutOffNTD]
      ,it.[RiskAssessmentValueT21]
      ,it.[RiskAssessmentValueT18]
      ,it.[RiskAssessmentValueT13]
      ,it.[RiskAssessmentValueNTD]
      ,it.[CD1AgeAtDeliveryDate]
      ,it.[CD1DeliveryDate]
      ,it.[CD1AgeAtExtraction]
      ,it.[SD1GestAtSampleDate]
      ,it.[USSD1GestAtSampleDate]
      ,it.[RiskAgeT21]
      ,it.[RiskEnumValueTwinT21]
      ,it.[RiskValueTwinT21]
      ,it.[RiskAgeT18]
      ,it.[RiskEnumValueTwinT18]
      ,it.[RiskValueTwinT18]
      ,it.[RiskAgeNTD]
      ,it.[RiskValueTwinNTD]
      ,it.[RiskValueTwin1TNTD]
      ,it.[RiskAgeT13]
      ,it.[RiskEnumValueTwinT13]
      ,it.[RiskValueTwinT13]
      ,it.[HpvReceiveStatus]
      ,it.[HpvPostToCxs2020Status]
      ,it.[LabTestDate]
      ,it.[LabResultDate]
      ,it.[LabStaff]
      ,it.[LabResult]
      ,it.[ArtificialInseminationFlag]
      ,it.[ArtificialInseminationValue]
      ,it.[OvumCollectDate]
      ,it.[EmbryoTransferDate]
      ,it.[DonorBirthdate]
      ,it.[BloodDrawingTime]
      ,it.[SerumSeparateTime]
      ,it.[GAAgeTotalDays]
      ,it.[RaceLifeCycleCode]
      ,it.[ReportDate]
      ,it.[ReportNo]
      ,it.[ReportBy]
      ,it.[SentReportNo]
      ,it.[SentReportDate]
      ,it.[SentNo]
      ,it.[ApproveByID]
      ,it.[ReportByID]
      ,it.[SampleStyle]
      ,it.[ResultType]
      ,it.[FetalSex]
      ,it.[RiskResultT21Downs]
      ,it.[RiskResultT18Edwards]
      ,it.[RiskResultT13Patau]
      ,it.[RiskValueT21Downs]
      ,it.[RiskValueT18Edwards]
      ,it.[RiskValueT13Patau]
      ,it.[RiskCutOffT21Downs]
      ,it.[RiskCutOffT18Edwards]
      ,it.[RiskCutOffT13Patau]
      ,it.[RiskResultZScoreT21]
      ,it.[RiskResultZScoreT18]
      ,it.[RiskResultZScoreT13]
      ,it.[RiskValueZScoreT21]
      ,it.[RiskValueZScoreT18]
      ,it.[RiskValueZScoreT13]
      ,it.[RiskCutOffZScoreT21]
      ,it.[RiskCutOffZScoreT18]
      ,it.[RiskCutOffZScoreT13]
      ,it.[ChromeT21Value]
      ,it.[ChromeT18Value]
      ,it.[ChromeT13Value]
      ,it.[ChromeT21SD]
      ,it.[ChromeT18SD]
      ,it.[ChromeT13SD]
      ,it.[AmnioticDate]
      ,it.[AmnioticLab]
      ,it.[AmnioticGAWeek]
      ,it.[AmnioticGADays]
      ,it.[AmnioticAnalysTechnique]
      ,it.[AmnioticOtherTechnique]
      ,it.[AmnioticChromosomeAbnormal]
      ,it.[AmnioticOtherAbnormal]
      ,it.[AmnioticMiscarriage]
      ,it.[AmnioticRecorder]
      ,it.[AmnioticPhoneNo]
      ,it.[AmnioticAnalysisReportFile]
      ,it.[AmnioticPhysicalFileName]
      ,it.[NiptGAAgeTotalDays]
      ,it.[NiptGAAgeWeeks]
      ,it.[NiptGAAgeDays]
      ,it.[NiptTestValueChrT21]
      ,it.[NiptTestValueChrT18]
      ,it.[NiptTestValueChrT13]
      ,it.[NiptSDChrT21]
      ,it.[NiptSDChrT18]
      ,it.[NiptSDChrT13]
      ,it.[EDCDate]
      ,it.[Uncertain_LMP]
      ,it.[Corrected_EDCDate]
      ,it.[Corrected_GA]
      ,it.[Ultrasoundby]
      ,it.[Ultrasound_GA]
      ,it.[Ultasound_Detail]
      ,it.[NT_Test]
      ,it.[CRL_Detail]
      ,it.[ART]
      ,it.[ART_Technical]
      ,it.[ART_Detail]
      ,it.[GAbyLMP]
      ,it.[ERExportFlag]
      ,it.[Import_FileName]
      ,it.[SampleType]
      ,it.[FilterPaperCompleteness]
      ,it.[ReceiptRemark]
      --,it.[Price]
     --,it.[DmscInvoiceAndReceiptStatus]


                            from Requests it

                            Left Outer Join MSLabProfile on MSLabProfile.ProfileID =it.ProfileID
                            Left Outer Join MSSite  On (MSSite.SiteID = it.SiteID) 
                            --Left Outer Join MSSite ON MSSite.SiteID = it.SiteID
                            LEFT Outer Join MSSite ParentSite On ( ParentSite.SiteID = isnull(MSSite.ParentSiteID, MSSite.SiteID)  and ParentSite.SiteFlag ='P')
                            Left Outer JOin MSSite SSO ON SSO.SiteCode ='สปสช'
                            Left Outer Join MSSite Customer ON  Customer.SiteID = ( Case isnull(it.PaymentFlag,'') when 'SSOPayment' then SSO.SiteID when 'SitePayment' then it.SiteID else it.SiteID end)
                            Left Outer Join DMSC_ProvinceInfo Province ON   ( Province.text =Customer.Province or  'จ.' + Province.text =Customer.Province or  'จังหวัด' + Province.text =Customer.Province or (Province.text ='กรุงเทพมหานคร' and Customer.Province in ('กรุงเทพฯ','กทม','กทม.','กรุงเทพ'))) 
                            Left Outer Join DMSC_DistrictInfo Amphur ON  Amphur.ProvinceID_API =Province.code and ( Amphur.text =Customer.Amphur or  'จ.' +  Amphur.text =Customer.Amphur or  'อำเภอ' +  Amphur.text =Customer.Amphur) 
                            Left Outer Join DMSC_SubDistrictInfo District ON   District.ProvinceID_API  =Province.code and  District.DistrictID_API =Amphur.code 
                            and   ( District.text =Customer.District or  'ต.' + District.text =Customer.District or  'ตำบล' + District.text =Customer.District) 
                            where 1=1  and it.RequestStatus ='Approved' and it.PaymentFlag  = 'SSOPayment'
                            and NOT EXISTS(select InvoiceDetail.requestid from InvoiceDetail where InvoiceDetail.requestid =it.requestid and ISNULL(InvoiceDetail.PaymentSatatus,'') <> 'Cancel' )
                            `;
            try {
              const response = await this.sentSampleService.query({ queryString: query });
              for (let el of response.data.response) {
                //console.log('response => ', el);
                var DepartmentID = el.departmentID;
                if (DepartmentID == '' || DepartmentID == "" || DepartmentID == null || DepartmentID == "0") {
                  DepartmentID = "";
                } else {
                  DepartmentID = el.departmentID;
                }
                var CreditTerm = String(el.creditTerm);
                if (CreditTerm == '' || CreditTerm == "" || CreditTerm == null || CreditTerm == "0") {
                  CreditTerm = '';
                } else {
                  CreditTerm = String(el.creditTerm);
                }
                var ReferenceDetail = "";
                if (ReferenceDetail == '' || ReferenceDetail == "" || ReferenceDetail == null || ReferenceDetail == "0") {
                  ReferenceDetail = '';
                } else {
                  ReferenceDetail = "";
                }
                var PaymentDetail = "ทดสอบเรียกเก็บต้นสังกัด";
                //if (PaymentDetail == '' || PaymentDetail == "" || PaymentDetail == null || PaymentDetail == "0") {
                //  PaymentDetail = '';
                //} else {
                //  PaymentDetail = "";
                //}

                let res1 = '';
                let res2 = '';



                var CustomerGroupID = el.customer_CustomerGroupID;
                if (CustomerGroupID == '' || CustomerGroupID == "" || CustomerGroupID == null || CustomerGroupID == "0") {
                  CustomerGroupID = '';
                } else {
                  CustomerGroupID = el.customer_CustomerGroupID;
                }
                var RequestStatusID = "1";
                if (RequestStatusID == '' || RequestStatusID == "" || RequestStatusID == null || RequestStatusID == "0") {
                  RequestStatusID = '';
                } else {
                  RequestStatusID = "1";
                }
                var PrefixID = el.customer_PrefixID;
                if (PrefixID == '' || PrefixID == "" || PrefixID == null || PrefixID == "0") {
                  PrefixID = '';
                } else {
                  PrefixID = el.customer_PrefixID;
                }
                var IDCard = el.customer_IDCard;
                if (IDCard == '' || IDCard == "" || IDCard == null || IDCard == "0") {
                  IDCard = '';
                } else {
                  IDCard = el.customer_IDCard;
                }
                var TaxID = el.customer_TaxID;
                if (TaxID == '' || TaxID == "" || TaxID == null || TaxID == "0") {
                  TaxID = '';
                } else {
                  TaxID = el.customer_TaxID;
                }
                var Firstname = el.customer_Firstname;
                if (Firstname == '' || Firstname == "" || Firstname == null || Firstname == "0") {
                  Firstname = '';
                } else {
                  Firstname = el.customer_Firstname;
                }
                var Lastname = el.customer_LastName;
                if (Lastname == '' || Lastname == "" || Lastname == null || Lastname == "0") {
                  Lastname = '';
                } else {
                  Lastname = el.customer_LastName;
                }
                var Email = el.customer_Email;
                if (Email == '' || Email == "" || Email == null || Email == "0") {
                  Email = '';
                } else {
                  Email = el.customer_Email;
                }
                var PhoneNumber = el.customer_PhoneNumber;
                if (PhoneNumber == '' || PhoneNumber == "" || PhoneNumber == null || PhoneNumber == "0") {
                  PhoneNumber = '';
                } else {
                  PhoneNumber = el.customer_PhoneNumber;
                }
                var MobileNumber = el.customer_MobileNumber;
                if (MobileNumber == '' || MobileNumber == "" || MobileNumber == null || MobileNumber == "0") {
                  MobileNumber = '';
                } else {
                  MobileNumber = el.customer_MobileNumber;
                }
                var AddressNumber = el.customer_AddressNumber;
                if (AddressNumber == '' || AddressNumber == "" || AddressNumber == null || AddressNumber == "0") {
                  AddressNumber = '';
                } else {
                  AddressNumber = el.customer_AddressNumber;
                }
                var Moo = el.customer_Moo;
                if (Moo == '' || Moo == "" || Moo == null || Moo == "0") {
                  Moo = '';
                } else {
                  Moo = el.customer_Moo;
                }
                var Village = el.customer_Village;
                if (Village == '' || Village == "" || Village == null || Village == "0") {
                  Village = '';
                } else {
                  Village = el.customer_Village;
                }
                var Road = el.customer_Road;
                if (Road == '' || Road == "" || Road == null || Road == "0") {
                  Road = '';
                } else {
                  Road = el.customer_Road;
                }
                var Soi = el.customer_Soi;
                if (Soi == '' || Soi == "" || Soi == null || Soi == "0") {
                  Soi = '';
                } else {
                  Soi = el.customer_Soi;
                }
                var ProvinceID = el.customer_ProvinceID;
                if (ProvinceID == '' || ProvinceID == "" || ProvinceID == null || ProvinceID == "0") {
                  ProvinceID = '';
                } else {
                  ProvinceID = el.customer_ProvinceID;
                }
                var DistrictID = el.customer_DistrictID;
                if (DistrictID == '' || DistrictID == "" || DistrictID == null || DistrictID == "0") {
                  DistrictID = '';
                } else {
                  DistrictID = el.customer_DistrictID;
                }
                var SubDistrictID = el.customer_SubDistrictID;
                if (SubDistrictID == '' || SubDistrictID == "" || SubDistrictID == null || SubDistrictID == "0") {
                  SubDistrictID = '';
                } else {
                  SubDistrictID = el.customer_SubDistrictID;
                }
                var Postcode = el.customer_Postcode;
                if (Postcode == '' || Postcode == "" || Postcode == null || Postcode == "0") {
                  Postcode = '';
                } else {
                  Postcode = el.customer_Postcode;
                }

                var SubmitTo = el.customer_Remark;
                if (SubmitTo == '' || SubmitTo == "" || SubmitTo == null || SubmitTo == "0") {
                  SubmitTo = '';
                } else {
                  SubmitTo = el.customer_Remark;
                }


                let InvoiceItems = [];
                let InvoiceItems2 = ',';


               
                if (this.selection.selected.length > 0) {
                  var num = 0;
                  for (let el of this.selection.selected) {
                    num++;
                    const query = `
                    select (Customer.SiteName)customer_Firstname,
                                (it.Price)Price,
                                ('ค่าธรรมเนียม' + ProfileName + ' หมายเลขตัวอย่าง ' + LabNumber)Detail,
                                 ('')Detail2,
                                 ('')ShipmentPrice


                            from Requests it

                            Left Outer Join MSLabProfile on MSLabProfile.ProfileID =it.ProfileID
                            Left Outer Join MSSite  On (MSSite.SiteID = it.SiteID)
                            --Left Outer Join MSSite ON MSSite.SiteID = it.SiteID
                            LEFT Outer Join MSSite ParentSite On ( ParentSite.SiteID = isnull(MSSite.ParentSiteID, MSSite.SiteID)  and ParentSite.SiteFlag ='P')
                            Left Outer JOin MSSite SSO ON SSO.SiteCode ='สปสช'
                            Left Outer Join MSSite Customer ON  Customer.SiteID = ( Case isnull(it.PaymentFlag,'') when 'SSOPayment' then SSO.SiteID when 'SitePayment' then it.SiteID else it.SiteID end)
                            Left Outer Join DMSC_ProvinceInfo Province ON   ( Province.text =Customer.Province or  'จ.' + Province.text =Customer.Province or  'จังหวัด' + Province.text =Customer.Province or (Province.text ='กรุงเทพมหานคร' and Customer.Province in ('กรุงเทพฯ','กทม','กทม.','กรุงเทพ')))
                            Left Outer Join DMSC_DistrictInfo Amphur ON  Amphur.ProvinceID_API =Province.code and ( Amphur.text =Customer.Amphur or  'จ.' +  Amphur.text =Customer.Amphur or  'อำเภอ' +  Amphur.text =Customer.Amphur)
                            Left Outer Join DMSC_SubDistrictInfo District ON   District.ProvinceID_API  =Province.code and  District.DistrictID_API =Amphur.code
                            and   ( District.text =Customer.District or  'ต.' + District.text =Customer.District or  'ตำบล' + District.text =Customer.District)
                            where 1=1  and it.RequestStatus ='Approved' and it.PaymentFlag  = 'SSOPayment' and   it.RequestID = '${el.requestID}'
                            and NOT EXISTS(select InvoiceDetail.requestid from InvoiceDetail where InvoiceDetail.requestid =it.requestid and ISNULL(InvoiceDetail.PaymentSatatus,'') <> 'Cancel' )
                        `;
                    const response = await this.sentSampleService.query({ queryString: query });
                    if (response.data.response.length == 0) {
                      InvoiceItems;
                    } else {
                      for (let el of response.data.response) {

                        const invoiceItem = {
                          Detail: el.detail,
                          Quantity: 1,
                          Price: el.price,
                          TotalPrice: el.price
                        };
                        InvoiceItems.push(invoiceItem);
                      }
                    }
                  }
                }
                const jsonString = JSON.stringify(InvoiceItems);
                //console.log('JSON.parse("[" + jsonString + "]") => ', JSON.parse("[" + jsonString + "]"));
                //console.log('InvoiceItems => ', InvoiceItems);
                //const url = 'https://ilabplusbackend.dmsc.moph.go.th/PaymentService/GenerateReceiptReport';
                const url = 'http://192.168.200.28/PaymentService/GenerateReceiptReport';
                const headers = new HttpHeaders().set('Content-Type', 'application/json')
                const body =
                {
                  //"User": "test",
                  //"Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDVmYTk2Yy1hMmE0LTQzZTctOWZjMy05NTAwZTMwYjQxMTMiLCJ2YWxpZCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsImV4cCI6MTY4ODYxMTYxOCwiaXNzIjoiRE1TQ19QYXltZW50IiwiYXVkIjoiRE1TQ19QYXltZW50In0.zBiLbCiyK0bhkepy82Jk7Y81wtEeSf1r2XJhPLlSbQY",
                  "User": "iem_user",
                  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTQzN2JiZC0yMGY5LTRjYWQtODg3Yy0yMTQ5MjYxMjE1NmYiLCJ2YWxpZCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaWVtX3VzZXIiLCJleHAiOjE3MDExNTg2MTAsImlzcyI6IkRNU0NfUGF5bWVudCIsImF1ZCI6IkRNU0NfUGF5bWVudCJ9.T0S9Swm4axTmyabcBj8_r0EeloFPoEvluCECnANfEDY",
                  "Data": {
                    "RequestStatusID": RequestStatusID,
                    "RequestNo": "",
                    "DepartmentID": DepartmentID,
                    "ReceiptMethodID": "0",
                    "ReceiptMethodDetail": "ทดสอบการส่ง API Test",
                    "Remark": "ส่งมาจากทาง API",
                    "ReceiptTypeID": "14",
                    "ReceiptItems":
                      JSON.parse(jsonString)
                    ,
                    "Customer": {
                      "CustomerGroupID": CustomerGroupID,
                      "PrefixID": PrefixID,
                      "IDCard": IDCard,
                      "TaxID": TaxID,
                      "Firstname": Firstname,
                      "Lastname": Lastname,
                      "Email": Email,
                      "PhoneNumber": PhoneNumber,
                      "MobileNumber": MobileNumber,
                      "AddressNumber": AddressNumber,
                      "Moo": Moo,
                      "Village": Village,
                      "Road": Road,
                      "Soi": Soi,
                      "ProvinceID": ProvinceID,
                      "DistrictID": DistrictID,
                      "SubDistrictID": SubDistrictID,
                      "Postcode": Postcode,
                      "SubmitTo": SubmitTo
                    },
                    "ReceiptAlt": {
                      "AltName": "",
                      "AltAddress": "",
                      "AltTax": ""
                    }
                  }
                }
                try {
                  ////// Send Parameter

                  this.http.post(url, body, { observe: 'response' }).pipe(
                    catchError((error: HttpErrorResponse) => {
                      console.error('Error:', error);
                      //return throwError('Something went wrong. Please try again later.');
                      return throwError(error.message|| 'Server error');

                    })
                  ).subscribe(
                    (response: HttpResponse<any>) => {

                      var convertedString = JSON.stringify(response)
                      //console.log('convertedString => ', convertedString);
                      //console.log('response.body.Status => ', response.body.Status);
                      if (response.body.Status == "0101" || response.body.Status == "0102" || response.body.Status == "0103") {

                        console.log('success', response.body.Status);
                        //Update Status
                        //this.saveType = "SentAPI_Invoice";
                        //this.rangeForm.patchValue({
                        //  requestStatus: this.saveType,
                        //});
                        //this.executeSaveData3(this.selection.selected);


                        for (let el of this.selection.selected) {

                          const query = `
                          UPDATE  Requests
                          SET dmscInvoiceAndReceiptStatus = 'SentAPI_Receipt'
                          WHERE requestID = '${el.requestID}'
                         `;
                          const response = this.sentSampleService.query({ queryString: query });
                        }
                        //document.getElementById('btnSearch').click();
                        this.selection.clear();
                        this.getData();

                        this.spinner.hide();
                        this.toastrNotiService.success('ส่งใบเสร็จ Receipt เรียบร้อยแล้ว', 'Message');

                      }
                      else if (response.body.Status == "02") {
                        //console.log('02');
                        //this.spinner.hide();
                        //Update Status
                        //this.saveType = "CancelAPI_Invoice";
                        //this.rangeForm.patchValue({
                        //  requestStatus: this.saveType,
                        //});
                        //this.executeSaveData4(this.selection.selected);

                        for (let el of this.selection.selected) {
                          const query = `
                          Update  Requests
                          Set DmscInvoiceAndReceiptStatus = 'CancelAPI_Receipt'
                          WHERE requestID = '${el.requestID}'
                         `;
                          const response = this.sentSampleService.query({ queryString: query });
                        }
                        this.selection.clear();
                        this.getData();

                        // กรณีที่ Status เป็น 02 ให้ไปยิง api ตัวที่ 2
                        let DataCheckStatus = `{"RequestNo": "${response.body.RequestNo}"}`;

                        //const urlCheckStatus = 'https://ilabplusbackend.dmsc.moph.go.th/PaymentService/CheckReceiptStatus';
                        const urlCheckStatus = 'http://192.168.200.28/PaymentService/CheckReceiptStatus';
                        const headersCheckStatus = new HttpHeaders().set('Content-Type', 'application/json')
                        const bodyCheckStatus =
                        {
                          //"User": "test",
                          //"Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZjliOGQ1Ny0zMjk5LTQ1MGYtYWIyMy04NjU3NWJiNTRiZjUiLCJ2YWxpZCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsImV4cCI6MTY4OTA4MDI2OSwiaXNzIjoiRE1TQ19QYXltZW50IiwiYXVkIjoiRE1TQ19QYXltZW50In0.QX96SpJuZlG4cT061pT_tnUuAqTm9rnLxwxIfoD-U_E",
                          "User": "iem_user",
                          "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTQzN2JiZC0yMGY5LTRjYWQtODg3Yy0yMTQ5MjYxMjE1NmYiLCJ2YWxpZCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaWVtX3VzZXIiLCJleHAiOjE3MDExNTg2MTAsImlzcyI6IkRNU0NfUGF5bWVudCIsImF1ZCI6IkRNU0NfUGF5bWVudCJ9.T0S9Swm4axTmyabcBj8_r0EeloFPoEvluCECnANfEDY",
                          "Data":
                            JSON.parse("[" + DataCheckStatus + "]")
                        }
                        this.http.post(urlCheckStatus, bodyCheckStatus, { observe: 'response' }).pipe(
                          catchError((error: HttpErrorResponse) => {
                            console.error('Error:', error);
                            return throwError('Something went wrong. Please try again later.');
                          })
                        ).subscribe(
                          (response2: HttpResponse<any>) => {
                            var convertedString2 = JSON.stringify(response2)
                            console.log('convertedString2 => ', convertedString2);
                          })
                        this.selection.clear();
                        this.spinner.hide();
                        this.toastrNotiService.success('ใบแจ้งหนี้บุคคลนี้ถูกยกเลิก', 'Message');
                      }
                      else {
                        //Error Another
                        //const query = ` update  Requests  set DMScDatacenterStatus = 'CancelAPI_Invoice'  where RequestID =  '${el.requestID}'`;
                        console.log('Errrorrrrr');
                        this.selection.clear();
                        this.spinner.hide();
                        this.toastrNotiService.success(convertedString, 'Message');
                      }
                    }
                  );
                } catch (e) {
                  console.log('Error Invoice', e);
                }
              }
            } catch (e) {
              console.log('catch => ', e);
            }
          }



          if (rangeData.hdInvoiceApi == 'SitePayment') {
            console.log('this Input => ', $('#input-siteName').val());
            if ($('#input-siteName').val() != '') {

              const query = `

                             select top(1) it.RequestID,
       it.LabNumber,
	  it.RequestStatus ,
    it.DoctorAppvDate,
    (isnull(it.Title,'') + it.FirstName +' ' + it.LastName)FullName,
     MSSite.SiteCode,
    MSSite.SiteName,
    (Case isnull(it.PaymentFlag,'') when 'SSOPayment' then 'สปสช.' when 'SitePayment' then 'หน่วยงานส่งตรวจ' when 'CashPayment' then 'เงินสด' when 'AnyJobPayment' then 'โครงการอื่น ๆ' when 'OtherPayment'  then 'อื่น ๆ : ' + isnull(it.PaymentOther,'') else '' end)วิธีชำระเงิน,
    isnull(Customer.dmsc_id,'')customer_CustomerGroupID,
    ('')customer_IDCard,
  ('')customer_PrefixID,
  ('')customer_TaxID,
  (Customer.SiteName)customer_Firstname,
  ('')customer_LastName,
  ('')customer_Email,
  (Customer.tel)customer_PhoneNumber,
  ('')customer_MobileNumber,
  (Customer.Address)customer_AddressNumber,
  (Customer.Moo)customer_Moo,
  (Customer.Village)customer_Village,
  (Customer.Street)customer_Road,
  (Customer.Lane)customer_Soi,
  isnull(Province.code,'')customer_ProvinceID,
  isnull(Amphur.code,'')customer_DistrictID,
  isnull(District.code,'')customer_SubDistrictID,
  isnull(Customer.PostCode,'')customer_Postcode,


  (ParentSite.dmsc_id)DepartmentID,
  (0)CreditTerm,
  ('ค่าธรรมเนียม' + ProfileName)Detail,
     it.Price,
  ('ค่าเก็บและขนส่งเลือดทางห้องปฏิบัติการ')Detail2,
  ( Case isnull(it.PaymentFlag,'') when 'SSOPayment' then 100.00 else 0.00 end)ShipmentPrice 
  ,Customer.Province
     ,it.[RequestCode]
      ,it.[ExternalNo]
      ,it.[RequestDate]
      ,it.[RequestByID]
      ,it.[BatchID]
      ,it.[ReceiveNo]
      ,it.[ReceiveDate]
      ,it.[ShiptoNo]
      ,it.[ShiptoDate]
      ,it.[NonShiptoDateFlag]
      ,it.[SampleTypeID]
      ,it.[ProfileID]
      ,it.[ReceiveByID]
      ,it.[LabNumber]
      ,it.[SentSampleID]
      ,it.[SentLabbyID]
      ,it.[SentLabTel]
      ,it.[RecieveResultby]
      ,it.[PatientID]
      ,it.[HN]
      ,it.[Title]
      ,it.[FirstName]
      ,it.[MiddleName]
      ,it.[LastName]
      ,it.[NickName]
      ,it.[IdentityCard]
      ,it.[TitleEng]
      ,it.[FirstNameEng]
      ,it.[MiddleNameEng]
      ,it.[LastNameEng]
      ,it.[NickNameEng]
      ,it.[Sex]
      ,it.[MaritalStatus]
      ,it.[Birthday]
      ,it.[Height]
      ,it.[Weight]
      ,it.[StartDate]
      ,it.[EndDate]
      ,it.[DueDate]
      ,it.[Address]
      ,it.[Moo]
      ,it.[RoomNo]
      ,it.[FloorNo]
      ,it.[Building]
      ,it.[Village]
      ,it.[Lane]
      ,it.[Street]
      ,it.[District]
      ,it.[Amphur]
      --,it.[Province]
      ,it.[PostCode]
      ,it.[SiteID]
      ,it.[BloodGroups]
      ,it.[Race]
      ,it.[Nationality]
      ,it.[Religion]
      ,it.[PregnantNo]
      ,it.[PregnantFlag]
      ,it.[NumberofOther]
      ,it.[PregnantType]
      ,it.[PregnantTypeOther]
      ,it.[RiskAnalystAgeFlag]
      ,it.[GAAgeWeeks]
      ,it.[GAAgeDays]
      ,it.[UltrasoundDate]
      ,it.[UltrasoundFlag]
      ,it.[Ultrasound_BPD]
      ,it.[Ultrasound_CRL]
      ,it.[LMPWeeks]
      ,it.[LMPDays]
      ,it.[LMPDate]
      ,it.[Ultrasound_NT]
      ,it.[Ultrasound_UTPI_LUA]
      ,it.[Ultrasound_UTPI_RUA]
      ,it.[BloodPressureDate]
      ,it.[BloodPressureLeftSyst1]
      ,it.[BloodPressureLeftDiast1]
      ,it.[BloodPressureLeftSyst2]
      ,it.[BloodPressureLeftDiast2]
      ,it.[BloodPressureRightSyst1]
      ,it.[BloodPressureRightDiast1]
      ,it.[BloodPressureRightSyst2]
      ,it.[BloodPressureRightDiast2]
      ,it.[SampleDate]
      ,it.[SalumIntersectionDate]
      ,it.[SavetoNHSOStatus]
      ,it.[SavetoNHSODate]
      ,it.[SavetoNHSOByID]
      ,it.[NonSaveToNHSOFlag]
      ,it.[NonSaveToNHSORemark]
      ,it.[AnalystDate]
      ,it.[CreatedBy]
      ,it.[CreatedDate]
      ,it.[ModifiedBy]
      ,it.[IsDeleted]
      ,it.[ModifiedDate]
      ,it.[NoofSon]
      ,it.[NoofDaughter]
      ,it.[Remark]
      ,it.[LabAppvFlag]
      ,it.[LabAppvDate]
      ,it.[LabAppvComment]
      ,it.[LabMGRAppvFlag]
      ,it.[LabMGRAppvDate]
      ,it.[LabMGRAppvComment]
      ,it.[DoctorAppvFlag]
      --,it.[DoctorAppvDate]
      ,it.[DoctorAppvComment]
      ,it.[Picture]
      --,it.[RequestStatus]
      ,it.[PhoneNo]
      ,it.[IsExported]
      ,it.[ExportedDate]
      ,it.[IsImported]
      ,it.[ImportedDate]
      ,it.[PaymentFlag]
      ,it.[PaymentNo]
      ,it.[PaymentOther]
      ,it.[AnsValuePlain_AFP]
      ,it.[AnsValuePlain_HCGB]
      ,it.[AnsValuePlain_INHIBIN]
      ,it.[AnsValuePlain_UE3UPD]
      ,it.[AnsValueCorrMoM_AFP]
      ,it.[AnsValueCorrMoM_HCGB]
      ,it.[AnsValueCorrMoM_INHIBIN]
      ,it.[AnsValueCorrMoM_UE3UPD]
      ,it.[RiskValueT21]
      ,it.[RiskValueT18]
      ,it.[RiskValueT13]
      ,it.[RiskValueNTD]
      ,it.[RiskCutOffT21]
      ,it.[RiskCutOffT18]
      ,it.[RiskCutOffT13]
      ,it.[RiskCutOffNTD]
      ,it.[RiskAssessmentValueT21]
      ,it.[RiskAssessmentValueT18]
      ,it.[RiskAssessmentValueT13]
      ,it.[RiskAssessmentValueNTD]
      ,it.[CD1AgeAtDeliveryDate]
      ,it.[CD1DeliveryDate]
      ,it.[CD1AgeAtExtraction]
      ,it.[SD1GestAtSampleDate]
      ,it.[USSD1GestAtSampleDate]
      ,it.[RiskAgeT21]
      ,it.[RiskEnumValueTwinT21]
      ,it.[RiskValueTwinT21]
      ,it.[RiskAgeT18]
      ,it.[RiskEnumValueTwinT18]
      ,it.[RiskValueTwinT18]
      ,it.[RiskAgeNTD]
      ,it.[RiskValueTwinNTD]
      ,it.[RiskValueTwin1TNTD]
      ,it.[RiskAgeT13]
      ,it.[RiskEnumValueTwinT13]
      ,it.[RiskValueTwinT13]
      ,it.[HpvReceiveStatus]
      ,it.[HpvPostToCxs2020Status]
      ,it.[LabTestDate]
      ,it.[LabResultDate]
      ,it.[LabStaff]
      ,it.[LabResult]
      ,it.[ArtificialInseminationFlag]
      ,it.[ArtificialInseminationValue]
      ,it.[OvumCollectDate]
      ,it.[EmbryoTransferDate]
      ,it.[DonorBirthdate]
      ,it.[BloodDrawingTime]
      ,it.[SerumSeparateTime]
      ,it.[GAAgeTotalDays]
      ,it.[RaceLifeCycleCode]
      ,it.[ReportDate]
      ,it.[ReportNo]
      ,it.[ReportBy]
      ,it.[SentReportNo]
      ,it.[SentReportDate]
      ,it.[SentNo]
      ,it.[ApproveByID]
      ,it.[ReportByID]
      ,it.[SampleStyle]
      ,it.[ResultType]
      ,it.[FetalSex]
      ,it.[RiskResultT21Downs]
      ,it.[RiskResultT18Edwards]
      ,it.[RiskResultT13Patau]
      ,it.[RiskValueT21Downs]
      ,it.[RiskValueT18Edwards]
      ,it.[RiskValueT13Patau]
      ,it.[RiskCutOffT21Downs]
      ,it.[RiskCutOffT18Edwards]
      ,it.[RiskCutOffT13Patau]
      ,it.[RiskResultZScoreT21]
      ,it.[RiskResultZScoreT18]
      ,it.[RiskResultZScoreT13]
      ,it.[RiskValueZScoreT21]
      ,it.[RiskValueZScoreT18]
      ,it.[RiskValueZScoreT13]
      ,it.[RiskCutOffZScoreT21]
      ,it.[RiskCutOffZScoreT18]
      ,it.[RiskCutOffZScoreT13]
      ,it.[ChromeT21Value]
      ,it.[ChromeT18Value]
      ,it.[ChromeT13Value]
      ,it.[ChromeT21SD]
      ,it.[ChromeT18SD]
      ,it.[ChromeT13SD]
      ,it.[AmnioticDate]
      ,it.[AmnioticLab]
      ,it.[AmnioticGAWeek]
      ,it.[AmnioticGADays]
      ,it.[AmnioticAnalysTechnique]
      ,it.[AmnioticOtherTechnique]
      ,it.[AmnioticChromosomeAbnormal]
      ,it.[AmnioticOtherAbnormal]
      ,it.[AmnioticMiscarriage]
      ,it.[AmnioticRecorder]
      ,it.[AmnioticPhoneNo]
      ,it.[AmnioticAnalysisReportFile]
      ,it.[AmnioticPhysicalFileName]
      ,it.[NiptGAAgeTotalDays]
      ,it.[NiptGAAgeWeeks]
      ,it.[NiptGAAgeDays]
      ,it.[NiptTestValueChrT21]
      ,it.[NiptTestValueChrT18]
      ,it.[NiptTestValueChrT13]
      ,it.[NiptSDChrT21]
      ,it.[NiptSDChrT18]
      ,it.[NiptSDChrT13]
      ,it.[EDCDate]
      ,it.[Uncertain_LMP]
      ,it.[Corrected_EDCDate]
      ,it.[Corrected_GA]
      ,it.[Ultrasoundby]
      ,it.[Ultrasound_GA]
      ,it.[Ultasound_Detail]
      ,it.[NT_Test]
      ,it.[CRL_Detail]
      ,it.[ART]
      ,it.[ART_Technical]
      ,it.[ART_Detail]
      ,it.[GAbyLMP]
      ,it.[ERExportFlag]
      ,it.[Import_FileName]
      ,it.[SampleType]
      ,it.[FilterPaperCompleteness]
      ,it.[ReceiptRemark]
      --,it.[Price]
     --,it.[DmscInvoiceAndReceiptStatus]


                            from Requests it

                            Left Outer Join MSLabProfile on MSLabProfile.ProfileID =it.ProfileID
                            Left Outer Join MSSite  On (MSSite.SiteID = it.SiteID) 
                            --Left Outer Join MSSite ON MSSite.SiteID = it.SiteID
                            LEFT Outer Join MSSite ParentSite On ( ParentSite.SiteID = isnull(MSSite.ParentSiteID, MSSite.SiteID)  and ParentSite.SiteFlag ='P')
                            Left Outer JOin MSSite SSO ON SSO.SiteCode ='สปสช'
                            Left Outer Join MSSite Customer ON  Customer.SiteID = ( Case isnull(it.PaymentFlag,'') when 'SSOPayment' then SSO.SiteID when 'SitePayment' then it.SiteID else it.SiteID end)
                            Left Outer Join DMSC_ProvinceInfo Province ON   ( Province.text =Customer.Province or  'จ.' + Province.text =Customer.Province or  'จังหวัด' + Province.text =Customer.Province or (Province.text ='กรุงเทพมหานคร' and Customer.Province in ('กรุงเทพฯ','กทม','กทม.','กรุงเทพ'))) 
                            Left Outer Join DMSC_DistrictInfo Amphur ON  Amphur.ProvinceID_API =Province.code and ( Amphur.text =Customer.Amphur or  'จ.' +  Amphur.text =Customer.Amphur or  'อำเภอ' +  Amphur.text =Customer.Amphur) 
                            Left Outer Join DMSC_SubDistrictInfo District ON   District.ProvinceID_API  =Province.code and  District.DistrictID_API =Amphur.code 
                            and   ( District.text =Customer.District or  'ต.' + District.text =Customer.District or  'ตำบล' + District.text =Customer.District) 
                            where 1=1  and it.RequestStatus ='Approved'
                            and MSSite.SiteName = '${$('#input-siteName').val()}'
                            and it.PaymentFlag  = 'SitePayment'
                            and NOT EXISTS(select InvoiceDetail.requestid from InvoiceDetail where InvoiceDetail.requestid =it.requestid and ISNULL(InvoiceDetail.PaymentSatatus,'') <> 'Cancel' )

                              `;

              const response = await this.sentSampleService.query({ queryString: query });

              //console.log('Result => ', response.data.response);
              for (let el of response.data.response) {
                var DepartmentID = el.departmentID;
                if (DepartmentID == '' || DepartmentID == "" || DepartmentID == null || DepartmentID == "0") {
                  DepartmentID = "";
                } else {
                  DepartmentID = el.departmentID;
                }
                var CreditTerm = String(el.creditTerm);
                if (CreditTerm == '' || CreditTerm == "" || CreditTerm == null || CreditTerm == "0") {
                  CreditTerm = '';
                } else {
                  CreditTerm = String(el.creditTerm);
                }
                var ReferenceDetail = "";
                if (ReferenceDetail == '' || ReferenceDetail == "" || ReferenceDetail == null || ReferenceDetail == "0") {
                  ReferenceDetail = '';
                } else {
                  ReferenceDetail = "";
                }
                var PaymentDetail = "ทดสอบเรียกเก็บต้นสังกัด";
                //if (PaymentDetail == '' || PaymentDetail == "" || PaymentDetail == null || PaymentDetail == "0") {
                //  PaymentDetail = '';
                //} else {
                //  PaymentDetail = "";
                //}

                let res1 = '';
                let res2 = '';



                var CustomerGroupID = el.customer_CustomerGroupID;
                if (CustomerGroupID == '' || CustomerGroupID == "" || CustomerGroupID == null || CustomerGroupID == "0") {
                  CustomerGroupID = '';
                } else {
                  CustomerGroupID = el.customer_CustomerGroupID;
                }
                var RequestStatusID = "1";
                if (RequestStatusID == '' || RequestStatusID == "" || RequestStatusID == null || RequestStatusID == "0") {
                  RequestStatusID = '';
                } else {
                  RequestStatusID = "1";
                }
                var PrefixID = el.customer_PrefixID;
                if (PrefixID == '' || PrefixID == "" || PrefixID == null || PrefixID == "0") {
                  PrefixID = '';
                } else {
                  PrefixID = el.customer_PrefixID;
                }
                var IDCard = el.customer_IDCard;
                if (IDCard == '' || IDCard == "" || IDCard == null || IDCard == "0") {
                  IDCard = '';
                } else {
                  IDCard = el.customer_IDCard;
                }
                var TaxID = el.customer_TaxID;
                if (TaxID == '' || TaxID == "" || TaxID == null || TaxID == "0") {
                  TaxID = '';
                } else {
                  TaxID = el.customer_TaxID;
                }
                var Firstname = el.customer_Firstname;
                if (Firstname == '' || Firstname == "" || Firstname == null || Firstname == "0") {
                  Firstname = '';
                } else {
                  Firstname = el.customer_Firstname;
                }
                var Lastname = el.customer_LastName;
                if (Lastname == '' || Lastname == "" || Lastname == null || Lastname == "0") {
                  Lastname = '';
                } else {
                  Lastname = el.customer_LastName;
                }
                var Email = el.customer_Email;
                if (Email == '' || Email == "" || Email == null || Email == "0") {
                  Email = '';
                } else {
                  Email = el.customer_Email;
                }
                var PhoneNumber = el.customer_PhoneNumber;
                if (PhoneNumber == '' || PhoneNumber == "" || PhoneNumber == null || PhoneNumber == "0") {
                  PhoneNumber = '';
                } else {
                  PhoneNumber = el.customer_PhoneNumber;
                }
                var MobileNumber = el.customer_MobileNumber;
                if (MobileNumber == '' || MobileNumber == "" || MobileNumber == null || MobileNumber == "0") {
                  MobileNumber = '';
                } else {
                  MobileNumber = el.customer_MobileNumber;
                }
                var AddressNumber = el.customer_AddressNumber;
                if (AddressNumber == '' || AddressNumber == "" || AddressNumber == null || AddressNumber == "0") {
                  AddressNumber = '';
                } else {
                  AddressNumber = el.customer_AddressNumber;
                }
                var Moo = el.customer_Moo;
                if (Moo == '' || Moo == "" || Moo == null || Moo == "0") {
                  Moo = '';
                } else {
                  Moo = el.customer_Moo;
                }
                var Village = el.customer_Village;
                if (Village == '' || Village == "" || Village == null || Village == "0") {
                  Village = '';
                } else {
                  Village = el.customer_Village;
                }
                var Road = el.customer_Road;
                if (Road == '' || Road == "" || Road == null || Road == "0") {
                  Road = '';
                } else {
                  Road = el.customer_Road;
                }
                var Soi = el.customer_Soi;
                if (Soi == '' || Soi == "" || Soi == null || Soi == "0") {
                  Soi = '';
                } else {
                  Soi = el.customer_Soi;
                }
                var ProvinceID = el.customer_ProvinceID;
                if (ProvinceID == '' || ProvinceID == "" || ProvinceID == null || ProvinceID == "0") {
                  ProvinceID = '';
                } else {
                  ProvinceID = el.customer_ProvinceID;
                }
                var DistrictID = el.customer_DistrictID;
                if (DistrictID == '' || DistrictID == "" || DistrictID == null || DistrictID == "0") {
                  DistrictID = '';
                } else {
                  DistrictID = el.customer_DistrictID;
                }
                var SubDistrictID = el.customer_SubDistrictID;
                if (SubDistrictID == '' || SubDistrictID == "" || SubDistrictID == null || SubDistrictID == "0") {
                  SubDistrictID = '';
                } else {
                  SubDistrictID = el.customer_SubDistrictID;
                }
                var Postcode = el.customer_Postcode;
                if (Postcode == '' || Postcode == "" || Postcode == null || Postcode == "0") {
                  Postcode = '';
                } else {
                  Postcode = el.customer_Postcode;
                }

                var SubmitTo = el.customer_Remark;
                if (SubmitTo == '' || SubmitTo == "" || SubmitTo == null || SubmitTo == "0") {
                  SubmitTo = '';
                } else {
                  SubmitTo = el.customer_Remark;
                }


                let InvoiceItems = [];
                let InvoiceItems2 = ',';

                if (this.selection.selected.length > 0) {
                  var num = 0;
                  for (let el of this.selection.selected) {
                    num++;
                    const query = `
                    select (Customer.SiteName)customer_Firstname,
                                (it.Price)Price,
                                ('ค่าธรรมเนียม' + ProfileName + ' หมายเลขตัวอย่าง ' + LabNumber)Detail,
                                 ('')Detail2,
                                 ('')ShipmentPrice


                            from Requests it

                            Left Outer Join MSLabProfile on MSLabProfile.ProfileID =it.ProfileID
                            Left Outer Join MSSite  On (MSSite.SiteID = it.SiteID)
                            --Left Outer Join MSSite ON MSSite.SiteID = it.SiteID
                            LEFT Outer Join MSSite ParentSite On ( ParentSite.SiteID = isnull(MSSite.ParentSiteID, MSSite.SiteID)  and ParentSite.SiteFlag ='P')
                            Left Outer JOin MSSite SSO ON SSO.SiteCode ='สปสช'
                            Left Outer Join MSSite Customer ON  Customer.SiteID = ( Case isnull(it.PaymentFlag,'') when 'SSOPayment' then SSO.SiteID when 'SitePayment' then it.SiteID else it.SiteID end)
                            Left Outer Join DMSC_ProvinceInfo Province ON   ( Province.text =Customer.Province or  'จ.' + Province.text =Customer.Province or  'จังหวัด' + Province.text =Customer.Province or (Province.text ='กรุงเทพมหานคร' and Customer.Province in ('กรุงเทพฯ','กทม','กทม.','กรุงเทพ')))
                            Left Outer Join DMSC_DistrictInfo Amphur ON  Amphur.ProvinceID_API =Province.code and ( Amphur.text =Customer.Amphur or  'จ.' +  Amphur.text =Customer.Amphur or  'อำเภอ' +  Amphur.text =Customer.Amphur)
                            Left Outer Join DMSC_SubDistrictInfo District ON   District.ProvinceID_API  =Province.code and  District.DistrictID_API =Amphur.code
                            and   ( District.text =Customer.District or  'ต.' + District.text =Customer.District or  'ตำบล' + District.text =Customer.District)
                            where 1=1  and it.RequestStatus ='Approved' and it.PaymentFlag  = 'SitePayment' and   it.RequestID = '${el.requestID}'
                            and NOT EXISTS(select InvoiceDetail.requestid from InvoiceDetail where InvoiceDetail.requestid =it.requestid and ISNULL(InvoiceDetail.PaymentSatatus,'') <> 'Cancel' )
                        `;
                    const response = await this.sentSampleService.query({ queryString: query });

                    if (response.data.response.length == 0) {
                      InvoiceItems;
                    } else {
                      for (let el of response.data.response) {

                        const invoiceItem = {
                          Detail: el.detail,
                          Quantity: 1,
                          Price: el.price,
                          TotalPrice: el.price
                        };
                        InvoiceItems.push(invoiceItem);
                      }
                    }
                  }
                }
                const jsonString = JSON.stringify(InvoiceItems);
                //console.log('jsonstring => ', jsonString);
                //const url = 'https://ilabplusbackend.dmsc.moph.go.th/PaymentService/GenerateReceiptReport';
                const url = 'http://192.168.200.28/PaymentService/GenerateReceiptReport';
                const headers = new HttpHeaders().set('Content-Type', 'application/json')
                const body =
                {
                  //"User": "test",
                  //"Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDVmYTk2Yy1hMmE0LTQzZTctOWZjMy05NTAwZTMwYjQxMTMiLCJ2YWxpZCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsImV4cCI6MTY4ODYxMTYxOCwiaXNzIjoiRE1TQ19QYXltZW50IiwiYXVkIjoiRE1TQ19QYXltZW50In0.zBiLbCiyK0bhkepy82Jk7Y81wtEeSf1r2XJhPLlSbQY",
                  "User": "iem_user",
                  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTQzN2JiZC0yMGY5LTRjYWQtODg3Yy0yMTQ5MjYxMjE1NmYiLCJ2YWxpZCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaWVtX3VzZXIiLCJleHAiOjE3MDExNTg2MTAsImlzcyI6IkRNU0NfUGF5bWVudCIsImF1ZCI6IkRNU0NfUGF5bWVudCJ9.T0S9Swm4axTmyabcBj8_r0EeloFPoEvluCECnANfEDY",
                  "Data": {
                    "RequestStatusID": RequestStatusID,
                    "RequestNo": "",
                    "DepartmentID": DepartmentID,
                    "ReceiptMethodID": "0",
                    "ReceiptMethodDetail": "ทดสอบการส่ง API Test",
                    "Remark": "ส่งมาจากทาง API",
                    "ReceiptTypeID": "14",
                    "ReceiptItems":
                      JSON.parse(jsonString)
                    ,
                    "Customer": {
                      "CustomerGroupID": CustomerGroupID,
                      "PrefixID": PrefixID,
                      "IDCard": IDCard,
                      "TaxID": TaxID,
                      "Firstname": Firstname,
                      "Lastname": Lastname,
                      "Email": Email,
                      "PhoneNumber": PhoneNumber,
                      "MobileNumber": MobileNumber,
                      "AddressNumber": AddressNumber,
                      "Moo": Moo,
                      "Village": Village,
                      "Road": Road,
                      "Soi": Soi,
                      "ProvinceID": ProvinceID,
                      "DistrictID": DistrictID,
                      "SubDistrictID": SubDistrictID,
                      "Postcode": Postcode,
                      "SubmitTo": SubmitTo
                    },
                    "ReceiptAlt": {
                      "AltName": "",
                      "AltAddress": "",
                      "AltTax": ""
                    }
                  }
                }
                try {
                  ////// Send Parameter

                  this.http.post(url, body, { observe: 'response' }).pipe(
                    catchError((error: HttpErrorResponse) => {
                      console.error('Error:', error);
                      return throwError('Something went wrong. Please try again later.');
                    })
                  ).subscribe(
                    (response: HttpResponse<any>) => {

                      var convertedString = JSON.stringify(response)
                      //console.log('convertedString => ', convertedString);
                      //console.log('response.body.Status => ', response.body.Status);
                      if (response.body.Status == "0101" || response.body.Status == "0102" || response.body.Status == "0103") {

                        console.log('success', response.body.Status);
                        //Update Status
                        //this.saveType = "SentAPI_Invoice";
                        //this.rangeForm.patchValue({
                        //  requestStatus: this.saveType,
                        //});
                        //this.executeSaveData3(this.selection.selected);


                        for (let el of this.selection.selected) {

                          const query = `
                          UPDATE  Requests
                          SET dmscInvoiceAndReceiptStatus = 'SentAPI_Receipt'
                          WHERE requestID = '${el.requestID}'
                         `;
                          const response = this.sentSampleService.query({ queryString: query });
                        }
                        //document.getElementById('btnSearch').click();
                        this.selection.clear();
                        this.getData();

                        this.spinner.hide();
                        this.toastrNotiService.success('ส่งใบเสร็จ Receipt เรียบร้อยแล้ว', 'Message');

                      }
                      else if (response.body.Status == "02") {
                        //console.log('02');
                        //this.spinner.hide();
                        //Update Status
                        //this.saveType = "CancelAPI_Invoice";
                        //this.rangeForm.patchValue({
                        //  requestStatus: this.saveType,
                        //});
                        //this.executeSaveData4(this.selection.selected);

                        for (let el of this.selection.selected) {
                          const query = `
                          Update  Requests
                          Set DmscInvoiceAndReceiptStatus = 'CancelAPI_Receipt'
                          WHERE requestID = '${el.requestID}'
                         `;
                          const response = this.sentSampleService.query({ queryString: query });
                        }
                        this.selection.clear();
                        this.getData();

                        // กรณีที่ Status เป็น 02 ให้ไปยิง api ตัวที่ 2
                        let DataCheckStatus = `{"RequestNo": "${response.body.RequestNo}"}`;

                        //const urlCheckStatus = 'https://ilabplusbackend.dmsc.moph.go.th/PaymentService/CheckReceiptStatus';
                        const urlCheckStatus = 'http://192.168.200.28/PaymentService/CheckReceiptStatus';
                        const headersCheckStatus = new HttpHeaders().set('Content-Type', 'application/json')
                        const bodyCheckStatus =
                        {
                          //"User": "test",
                          //"Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZjliOGQ1Ny0zMjk5LTQ1MGYtYWIyMy04NjU3NWJiNTRiZjUiLCJ2YWxpZCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGVzdCIsImV4cCI6MTY4OTA4MDI2OSwiaXNzIjoiRE1TQ19QYXltZW50IiwiYXVkIjoiRE1TQ19QYXltZW50In0.QX96SpJuZlG4cT061pT_tnUuAqTm9rnLxwxIfoD-U_E",
                          "User": "iem_user",
                          "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTQzN2JiZC0yMGY5LTRjYWQtODg3Yy0yMTQ5MjYxMjE1NmYiLCJ2YWxpZCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaWVtX3VzZXIiLCJleHAiOjE3MDExNTg2MTAsImlzcyI6IkRNU0NfUGF5bWVudCIsImF1ZCI6IkRNU0NfUGF5bWVudCJ9.T0S9Swm4axTmyabcBj8_r0EeloFPoEvluCECnANfEDY",
                          "Data":
                            JSON.parse("[" + DataCheckStatus + "]")
                        }
                        this.http.post(urlCheckStatus, bodyCheckStatus, { observe: 'response' }).pipe(
                          catchError((error: HttpErrorResponse) => {
                            console.error('Error:', error);
                            return throwError('Something went wrong. Please try again later.');
                          })
                        ).subscribe(
                          (response2: HttpResponse<any>) => {
                            var convertedString2 = JSON.stringify(response2)
                            console.log('convertedString2 => ', convertedString2);
                          })
                        this.selection.clear();
                        this.spinner.hide();
                        this.toastrNotiService.success('ใบแจ้งหนี้บุคคลนี้ถูกยกเลิก', 'Message');
                      }
                      else {
                        //Error Another
                        //const query = ` update  Requests  set DMScDatacenterStatus = 'CancelAPI_Invoice'  where RequestID =  '${el.requestID}'`;
                        console.log('Errrorrrrr');
                        this.selection.clear();
                        this.spinner.hide();
                        this.toastrNotiService.success(convertedString, 'Message');
                      }
                    }
                  );

                } catch (e) {
                  console.log('Error Invoice', e);
                }


              }



            } else {
              Swal.fire({
                icon: 'error',
                title: 'คำเตือน',
                html: `กรุณาเลือกหน่วยงานเดียวกัน แล้วกดค้นหาใหม่`,
                allowOutsideClick: false,
              });
              this.spinner.hide();
            }
            this.spinner.hide();
          }



        } else {
          Swal.fire({
            icon: 'error',
            title: 'คำเตือน',
            html: `กรุณาเลือกคนไข้ก่อนทำรายการ`,
            allowOutsideClick: false,
          });
          this.spinner.hide();
        }

      } catch (e) {
        console.log('Catch => ', e);
      }

    }






  }






}

export interface IConfirmDeliveredBulk {
  orderno: string;
  trackingno: string;
  status: string;
  status_date;
}


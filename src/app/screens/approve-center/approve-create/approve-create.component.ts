import { MpAppSettingsModel } from './../../../models/mpappsettings.model';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Renderer2, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { RequestsDTO, RequestsModel } from '@app/models';
import { RequestsService } from '@app/screens/request-sample/requests.service';
import { AuthenticationService, ToastrNotificationService, UtilitiesService } from '@app/services';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { defineLocale, formatDate } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';

import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
import { Guid } from 'guid-typescript';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddNewCommentComponent } from '../add-new-comment/add-new-comment.component';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultsModel, RecalModal } from '@app/models/results.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { MssitePickerComponent } from '@app/pickers/mssite-picker/mssite-picker.component';
import { environment } from '@environments/environment';
import { ConfigService } from '@app/app-core/config.service';
import { UploadDownloadService } from '@app/services/upload-download.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from '@app/services/excel.service';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
import { LabtestPickerComponent } from '@app/pickers/labtest-picker/labtest-picker.component';
import { clearLine } from 'readline';
defineLocale('th', thBeLocale);

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-approve-create',
  templateUrl: './approve-create.component.html',
  styleUrls: ['./approve-create.component.scss'],
  // encapsulation: ViewEncapsulation.None
})

export class ApproveCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
  private settingsFileName: string;
  username: string = '';
  userPassword: string = '';
  saveType: string = 'Reported'; // approve
  public ListNewFunction: Array<RecalModal>;
  requestsForm: FormGroup;
  patientMoreForms: FormArray;
  patientMoreLists: Array<RequestsPatientMoreModel>;
  public exportNhsoRangeForm: FormGroup;
  requestLists: Array<RequestsModel>;
  requestAlls: Array<RequestsModel>;
  requestsItem: RequestsModel;
  requestsDTO: RequestsDTO;

  isPending: boolean = true;
  isReceived: boolean = true;
  isReported: boolean = true;
  isApproved: boolean = true;
  isUpdated: boolean = true;
  clCheckHospital: string = 'd-none';
  clCheckHospital2: string = 'd-none';
  //Checkreadonly: string = 'true';
  Checkreadonly: boolean;
  disabledReporte: boolean = false;
  disabledApproved: boolean = false;
  forDepartureHospital: boolean = false;
  forScienceCenter: boolean = false;
  isReporter: boolean = false;
  isApprover: boolean = false;
  requestStatus: string = '';
  userID: string = '';
  reportOption: any = 1;
  printReportOption: any = 2;

  private isDragging = false;
  private startX: number;
  private scrollLeft: number;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild('tableScrollable') tableScrollable: ElementRef;

  selectedRowIndex = -1;
  public selectedRow: any;
  age: number = 0;
  selectedpayment: string;
  statusOptions = ['Pending', 'Reported', 'Approved'];
  statusOptionSelected = ['Pending', 'Reported', 'Approved'];

  public displayedColumns: string[] = [
    'listNo', 'status','recal', 'labNumber','hn', 'fullName',
  ];
  public dataSource = new MatTableDataSource<RequestsModel>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  goToPage = null;
  pageSize = 20;
  pageSizeOptions: number[] = [100, 200, 300, 400, 500, 1000];
  pageEvent: PageEvent;
  rangeSelectedValue: string = 'ThisWeek';
  rangeForm: FormGroup;

  @ViewChild('confirmPass') confirmPass: ElementRef;
  @ViewChild('printOptionRef') printOptionRef: ElementRef;

  userType: string = 'Departure';
  public resultsLists: Array<ResultsModel>;

  appSettings: MpAppSettingsModel;

  public defaultValue = {
    siteID: '',
    siteName: '',
    userName: '',
    employeeID: '',
    employeeName: '',
    sentToSiteID: '',
    sentToSiteName: '',
    forScienceCenter: false,
    forDepartureHospital: false,
    isReporter: false,
    isApprover: false,
  };





  ssoRights = [
    { value: 'หลักประกันสุขภาพแห่งชาติ (UC)', text: 'หลักประกันสุขภาพแห่งชาติ (UC)' },
    { value: 'สิทธิจ่ายตรง (non UC)', text: 'สิทธิจ่ายตรง (non UC)' },
    { value: 'สิทธิชำระเงินเอง', text: 'สิทธิชำระเงินเอง' },
  ]

  private appConfig;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestsService,
    private utilService: UtilitiesService,
    private localeService: BsLocaleService,
    private notiService: ToastrNotificationService,
    private requestsRepoService: RequestsRepoService,
    private modalService: BsModalService,
    private authService: AuthenticationService,
    private http: HttpClient,
    private repoService: RepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private _configSvc: RuntimeConfigLoaderService,
    private cfg: ConfigService,
    private fileService: UploadDownloadService,
    private readonly cdRef: ChangeDetectorRef,
    protected datePipe: DatePipe,
    private excelService: ExcelService,
    private sentSampleService: SentSampleService,
    private renderer: Renderer2, private el: ElementRef
  ) {
    super();
    this.localeService.use('th');
    // tslint:disable-next-line: deprecation
    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.username = user.data.SecurityUsers.UserName;

        this.defaultValue.siteID = user?.data?.SecurityUsers?.SiteID;
        this.defaultValue.siteName = user?.data?.SecurityUsers?.SiteName;
        this.defaultValue.employeeID = user?.data?.SecurityUsers?.EmployeeID;
        this.defaultValue.sentToSiteID = user?.data?.SecurityUsers?.ParentSiteID;
        this.defaultValue.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;
        this.defaultValue.userName = user?.data?.SecurityUsers?.UserName;
        this.defaultValue.forDepartureHospital = user?.data?.SecurityUsers?.ForDepartureHospital;
        this.defaultValue.isReporter = user?.data?.SecurityUsers?.IsReporter;
        this.defaultValue.isApprover = user?.data?.SecurityUsers?.IsApprover;
      }
    });

    this.rangeSelectedValue = this.defaultValue.forScienceCenter ? 'ThisMonth' : 'ThisWeek';

    // tslint:disable-next-line: deprecation
    this.route.queryParams.subscribe(params => {
      this.userType = params['utype'];
    });

    const appSettings = this.route.snapshot.data['appSettings'];
    this.appSettings = (appSettings.appSettings as MpAppSettingsModel);
    console.log('appsettingsssssss xxxx => ', this.appSettings);

  }

  async loadAppConfig() {
    this.settingsFileName = environment.production ? 'appsettings.json' : 'appsettings.dev.json';
    const baseUrl = document.location.pathname.split('/')[1];
    let settingsUrl = '';
    if (baseUrl === '') {
      settingsUrl = `/assets/configs/${this.settingsFileName}`;
    } else {
      settingsUrl = `/${baseUrl}/assets/configs/${this.settingsFileName}`;
    }
    const data = await this.http.get(settingsUrl).toPromise();
    this.appConfig = data;
  }

  ngOnInit(): void {
    this.selectedpayment = 'SSOPayment';
    this.loadAppConfig();
    this.requestsForm = this.fb.group(new RequestsModel());

    const isAvailable = this.requestsForm.contains('patientMoreForms');
    if (isAvailable) {
      this.requestsForm.removeControl('patientMoreForms');
    }
    this.requestsForm.addControl('patientMoreForms', this.fb.array([]));
    this.requestsForm.addControl('resultsForms', this.fb.array([]));

    this.rangeForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      siteID: [''],
      siteName: [''],
      labNumber: [''],
      //siteName: this.defaultValue.siteName,
      //siteID: this.defaultValue.siteID,
    });

    const range = this.utilService.getDateRange(this.rangeSelectedValue);
    //console.log('this.defaultValue => ', this.username);
    /*this.requestsForm.get('approveByID').setValue(this.defaultValue.userName);*/
   /* this.requestsForm.get('approveByID').setValue(this.username);*/

    //console.log('this.forScienceCenter => ', this.defaultValue.forScienceCenter);
    //console.log('this DefaultValue=> ', this.defaultValue);
    //console.log('thisthis.defaultValue', this.defaultValue.forDepartureHospital);

    if (this.defaultValue.forDepartureHospital == true && this.defaultValue.forScienceCenter != true) {
      $("#btn1").addClass('d-none');
      $("#btn2").addClass('d-none');
     /* $("#btn3").addClass('d-none');*/
    }




    this.rangeForm.patchValue({
      fromDate: range.start,
      toDate: range.end,
      siteID: this.defaultValue.siteID,
      siteName: this.defaultValue.siteName
    });

    if (this.defaultValue.forScienceCenter) {
      this.rangeForm.patchValue({
        siteID: '',
        siteName: ''
      });
    }


    this.exportNhsoRangeForm = this.fb.group({
      fromCreateDate: [''],
      toCreateDate: [''],
      nationality: ['all'],
      slpayment: [''],
      siteName: this.defaultValue.siteName,
      siteID: this.defaultValue.siteID,
    });

    // this.getPatientData();
  }

  ngAfterViewInit() {
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
  }

  updateGoToPage() {
    this.paginator.pageIndex = this.goToPage - 1;
  }

  public customSort = (event: any) => {

  }

  setRowSelected(item: any, rowIdx: number) {

    //console.log('test', item);
    //console.log('test', rowIdx);
    //console.log('item.riskAssessmentValueT21 => ',  item.riskAssessmentValueT21);
    //console.log('item.riskAssessmentValueT13 => ',  item.riskAssessmentValueT13);
    //console.log('item.riskAssessmentValueT18 => ',  item.riskAssessmentValueT18);
    //console.log('item.riskAssessmentValueNTD => ',  item.riskAssessmentValueNTD);
    if (item.riskAssessmentValueT21 == '1') {
      //console.log(11);
      item.riskAssessmentValueT21_2 = 'ความเสี่ยงต่ำ (Low Risk)';
    }
    if (item.riskAssessmentValueT21 == '2') {
      //console.log(22);
      item.riskAssessmentValueT21_2 = 'ความเสี่ยงสูง (High Risk)';
    }
    if (item.riskAssessmentValueT21 == '') {
      item.riskAssessmentValueT21_2 = '-';
    }

    if (item.riskAssessmentValueT18 == '1') {
      //console.log(11);
      item.riskAssessmentValueT18_2 = 'ความเสี่ยงต่ำ (Low Risk)';
    }
    if (item.riskAssessmentValueT18 == '2') {
      console.log(222);
      item.riskAssessmentValueT18_2 = 'ความเสี่ยงสูง (High Risk)';
    }
    if (item.riskAssessmentValueT18 == '') {
      item.riskAssessmentValueT18_2 = '-';
    } 

    if (item.riskAssessmentValueT13 == '1') {
      console.log(111);
      item.riskAssessmentValueT13_2 = 'ความเสี่ยงต่ำ (Low Risk)';
    }
    if (item.riskAssessmentValueT13 == '2') {
      //console.log(22);
      item.riskAssessmentValueT13_2 = 'ความเสี่ยงสูง (High Risk)';
    }
    if (item.riskAssessmentValueT13 == '') {
      item.riskAssessmentValueT13_2 = '-';
    }

    if (item.riskAssessmentValueNTD == '1') {
      //console.log(11);
      item.riskAssessmentValueNTD_2 = 'ความเสี่ยงต่ำ (Low Risk)';
    }
    if (item.riskAssessmentValueNTD == '2') {
      //console.log(222);
      item.riskAssessmentValueNTD_2 = 'ความเสี่ยงสูง (High Risk)';
    }
    if (item.riskAssessmentValueNTD == '') {
      item.riskAssessmentValueNTD_2 = '-';
    } 




    $("#mat-tab-label-0-0").trigger("click");
    $("#mat-tab-label-1-0").trigger("click");
    $("#mat-tab-label-2-0").trigger("click");
    $("#mat-tab-label-3-0").trigger("click");
    $("#mat-tab-label-4-0").trigger("click");
    $("#mat-tab-label-5-0").trigger("click");
    $("#mat-tab-label-6-0").trigger("click");
    $("#mat-tab-label-7-0").trigger("click");
    $("#mat-tab-label-8-0").trigger("click");
    $("#mat-tab-label-9-0").trigger("click");
    //document.getElementById('mat-tab-label-0-0').click();
    this.selectedRowIndex = rowIdx;
    this.requestsItem = item as RequestsModel;
    const model: RequestsModel = Object.assign({}, this.requestsItem);
    this.requestStatus = model.requestStatus;

    //console.log('testt => ', model.requestID);

    sessionStorage.setItem('ReqResult', JSON.stringify(model));

    //console.log('Model1 => ', model.ansValueCorrMoM_HCGB);
    //console.log('Model2 => ', model.ansValueCorrMoM_INHIBIN);
    //console.log('Model3 => ', model.ansValueCorrMoM_UE3UPD);

    //var CorrMoM1: number = +model.ansValueCorrMoM_HCGB;
    //var CorrMoM2: number = +model.ansValueCorrMoM_INHIBIN;
    //var CorrMoM3: number = +model.ansValueCorrMoM_UE3UPD;


    //if (this.requestStatus != 'Approved') {
    //  if (model.ansValueCorrMoM_HCGB == '' || model.ansValueCorrMoM_INHIBIN == '' || model.ansValueCorrMoM_UE3UPD == ''
    //    /*|| model.ansValueCorrMoM_HCGB == null || model.ansValueCorrMoM_INHIBIN == null || model.ansValueCorrMoM_UE3UPD == null*/
    //  ) {

    //  } else {
    //    if (CorrMoM1 < 0.4 || CorrMoM2 < 0.4 || CorrMoM3 < 0.4) {

    //      //console.log('testt น้อยกว่า 0.4');
    //      Swal.fire({
    //        title: 'CorrMoM < 0.4 กรุณาตรวจสอบผลอีกครั้ง',
    //        icon: 'warning',
    //        showCancelButton: true,
    //        confirmButtonColor: '#3085d6',
    //        cancelButtonColor: '#d33',
    //        confirmButtonText: 'ยืนยัน',
    //        cancelButtonText: 'ยกเลิก'
    //      }).then((result) => {

    //        if (result.isConfirmed == true) {
    //          if (this.requestStatus == 'Reported') {
    //            this.onApproveClick();
    //          }
    //          if (this.requestStatus == 'Pending') {
    //            this.onReportClick();
    //          }

    //        } else { }


    //      });
    //    }
    //  }
    //}



    if (this.requestStatus == '') {
      this.requestStatus = 'Pending';
    }

    if (this.requestStatus == 'Pending' || this.requestStatus == '') {
      //console.log(111, this.requestStatus);
      $("#btn1").prop("disabled", false);
      $("#btn2").prop("disabled", true);
      $("#btn3").prop("disabled", true);

    } else if (this.requestStatus == 'Reported') {
      //console.log(22, this.requestStatus);
      $("#btn1").prop("disabled", true);
      $("#btn2").prop("disabled", false);
      $("#btn3").prop("disabled", true);

    } else if (this.requestStatus == 'Approved') {
      //console.log(333, this.requestStatus);
      $("#btn1").prop("disabled", true);
      $("#btn2").prop("disabled", true);
      $("#btn3").prop("disabled", false);

    } else {
      $("#btn1").prop("disabled", false);
      $("#btn2").prop("disabled", false);
      $("#btn3").prop("disabled", false);
      //console.log(444, this.requestStatus);

    }


    this.patchRequestsFormValues(model);
    //console.log(model,'model');
    this.requestsForm.patchValue({
      requestDate: model.requestDate ? new Date(model.requestDate) : null,
      receiveDate: model.receiveDate ? new Date(model.receiveDate) : null,
      shiptoDate: model.shiptoDate ? new Date(model.shiptoDate) : null,
      birthday: model.birthday ? new Date(model.birthday) : null,
      startDate: model.startDate ? new Date(model.startDate) : null,
      endDate: model.endDate ? new Date(model.endDate) : null,
      dueDate: model.dueDate ? new Date(model.dueDate) : null,
      ultrasoundDate: model.ultrasoundDate ? new Date(model.ultrasoundDate) : null,
      lMPDate: model.lMPDate ? new Date(model.lMPDate) : null,
      bloodPressureDate: model.bloodPressureDate ? new Date(model.bloodPressureDate) : null,
      sampleDate: model.sampleDate ? new Date(model.sampleDate) : null,
      salumIntersectionDate: model.salumIntersectionDate ? new Date(model.salumIntersectionDate) : null,
      savetoNHSODate: model.savetoNHSODate ? new Date(model.savetoNHSODate) : null,
      analystDate: model.analystDate ? new Date(model.analystDate) : null,
      //labAppvDate: model.labAppvDate ? new Date(model.labAppvDate) : null,
      //doctorAppvDate: model.doctorAppvDate ? new Date(model.doctorAppvDate) : null,

      amnioticDate: model.amnioticDate ? new Date(model.amnioticDate) : null,
    });

    this.age = this.utilService.calculateAge(new Date(this.requestsForm.get('birthday').value));

    this.doLoadPatientMore();
    this.doLoadResults();

    this.cdRef.detectChanges();
    //document.getElementById('mat-tab-label-0-0').click();
  }

  setSelectedRow(row) {
    this.selectedRow = row;
  }

  isBigEnough(element, index, array) {
    return (element >= 10);
  }

  selectedTabChange = (event) => {
    //console.log(event.index, 'doLoadResults');
    if (event.index == 1) {
      this.doLoadPatientMore();
    }
    this.doLoadResults();
  }

  public doFilter = (value: string) => {
    //console.log('test');
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onStatusCheckedChange(ev, text) {
    //console.log('evv => ',ev);
    //console.log('text => ', text);
    //console.log('text => ', this.isReceived);
    //console.log('text => ', this.isReported);
    //console.log('text => ', this.isApproved);



    if (ev.checked) {
      this.statusOptionSelected.push(text);
    } else {
      this.statusOptionSelected.splice(this.statusOptionSelected.indexOf(text), 1);
    }

    const filtered = this.requestAlls.filter(item => this.statusOptionSelected.includes(item.requestStatus));
    this.requestLists = filtered;
    this.dataSource.data = filtered as RequestsModel[];
  }

  onReportClick = async () => {

    const datetimetest = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

    if (this.selectedRowIndex < 0) {
      return this.notiService.showError('กรุณาเลือกรายการคนไข้');
    }
    this.saveType = 'Reported';

    var CorrMoM1: number = +this.requestsForm.value.ansValueCorrMoM_HCGB;
    var CorrMoM2: number = +this.requestsForm.value.ansValueCorrMoM_INHIBIN;
    var CorrMoM3: number = +this.requestsForm.value.ansValueCorrMoM_UE3UPD;

   
    //console.log('this => ', this.appSettings.confirmPasswordOnApprove);
    this.requestsForm.get('reportByID').setValue(this.username);
    //this.requestsForm.get('labAppvDate').setValue(datetimetest);
    this.requestsForm.patchValue({
      requestStatus: this.saveType,
      //labAppvDate: new Date(),
      makeStatus: 'dataTime'
    });



    if (CorrMoM1 < 0.4 || CorrMoM2 < 0.4 || CorrMoM3 < 0.4) {

      Swal.fire({
        title: 'CorrMoM < 0.4 กรุณาตรวจสอบผลอีกครั้ง',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {

        if (result.isConfirmed == true) {
          this.executeSaveData();

          $("#btn1").prop("disabled", true);
          $("#btn2").prop("disabled", false);
          $("#btn3").prop("disabled", true);
          //console.log('confirm');
        }
        else {
          //console.log('cancel');
        }

      });
    } else {
      //console.log('notnull');
      this.executeSaveData();

      $("#btn1").prop("disabled", true);
      $("#btn2").prop("disabled", false);
      $("#btn3").prop("disabled", true);
    }
   








    //Version เก่า
    //if (this.appSettings.confirmPasswordOnApprove == 'Y') {
    //  $('#ModalPasswordConfirm').modal('show');
    //} else {
    //  this.requestsForm.patchValue({
    //    requestStatus: this.saveType
    //  });

    //  if (this.appSettings.requireApproveRemark == 'Y') {
    //    await this.openModalComment(this.saveType)
    //      .then((res) => {
    //        this.requestsForm.patchValue({
    //          requestStatus: this.saveType
    //        });

    //        this.requestsForm.get('requestStatus').patchValue(this.saveType);
    //        this.executeSaveData();
    //      });
    //  } else {
    //    this.executeSaveData();
    //  }
    //}
  }

  onApproveClick = async () => {
    if (this.selectedRowIndex < 0) {
      return this.notiService.showError('กรุณาเลือกรายการคนไข้');
    }


    var CorrMoM1: number = +this.requestsForm.value.ansValueCorrMoM_HCGB;
    var CorrMoM2: number = +this.requestsForm.value.ansValueCorrMoM_INHIBIN;
    var CorrMoM3: number = +this.requestsForm.value.ansValueCorrMoM_UE3UPD;


    this.saveType = 'Approved';
    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.username = user.data.SecurityUsers.UserName;
        this.requestsForm.get('approveByID').setValue(this.username);
        //this.requestsForm.get('doctorAppvDate').setValue(Date.now());
        //console.log('thisResult => ', this.requestsForm);
      }
    });
    


    this.requestsForm.patchValue({
      requestStatus: this.saveType,
      makeStatus: 'dataTime'
    });


    if (CorrMoM1 < 0.4 || CorrMoM2 < 0.4 || CorrMoM3 < 0.4) {

      Swal.fire({
        title: 'CorrMoM < 0.4 กรุณาตรวจสอบผลอีกครั้ง',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {

        if (result.isConfirmed == true) {
          this.executeSaveData();
          //console.log('confirm');
          $("#btn1").prop("disabled", true);
          $("#btn2").prop("disabled", true);
          $("#btn3").prop("disabled", false);
        }
        else {
          //console.log('cancel');
        }

      });
    } else {
      //console.log('notnull');
      this.executeSaveData();
      $("#btn1").prop("disabled", true);
      $("#btn2").prop("disabled", true);
      $("#btn3").prop("disabled", false);
    }




    //if (this.appSettings.confirmPasswordOnApprove == 'Y') {
    //  $(this.confirmPass.nativeElement).modal('show');
    //} else {
    //  this.requestsForm.patchValue({
    //    requestStatus: this.saveType
    //  });

    //  if (this.appSettings.requireApproveRemark == 'Y') {
    //    await this.openModalComment(this.saveType)
    //      .then((res) => {
    //        this.requestsForm.patchValue({
    //          requestStatus: this.saveType
    //        });

    //        this.requestsForm.get('requestStatus').patchValue(this.saveType);
    //        this.executeSaveData();
    //      });
    //  } else {
    //    this.executeSaveData();
    //  }
    //}
  }

  onPrintClick = async () => {
    if (this.selectedRowIndex < 0) {
      return this.notiService.showError('กรุณาเลือกรายการคนไข้');
    }

    $('#printOptionRef').modal('show');

    // const siteCode = this.appConfig.SITE_CODE;
    // console.log('print siteCode => ', siteCode);

    // if (siteCode == '002') {
    //   this.goToReport('AnalysisResultsReportChiangRai');
    // } else {
    //   this.goToReport('AnalysisResultsReport');
    // }
  }

  onConfirmPrintOption = () => {
    const siteCode = this.appConfig.SITE_CODE;
    console.log('print siteCode => ', siteCode);

    if (siteCode == '002') {
      this.goToReport('AnalysisResultsReportChiangRai');
    } else if (siteCode == '003') {

      //const query = ` Update  Requests
      //              Set  RequestStatus = 'Received',
      //                   LabAppvDate = null,
      //                   ReportByID = null,
      //                   DoctorAppvDate = null,
      //                   ApproveByID = null
      //              Where RequestID = '${x.requestID}'
      //                   `;
      //const response = this.sentSampleService.query({ queryString: query });
      this.goToReport('AnalysisResultsReportSWUCurrent');

    } else if (siteCode == '004') {
      this.goToReport('AnalysisResultsReport04');
    }
    else {
      if (this.reportOption == '2') {
        this.goToReport('AnalysisResultsNIPTReport');
      } else {
        this.goToReport('AnalysisResultsReport');
      }
    }

    $(this.printOptionRef.nativeElement).modal('hide');
  }

  goToReport(reportName: string) {

    console.log('this.defaultValue.employeeID =>', this.defaultValue.employeeID);
    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.username = user.data.SecurityUsers.UserName;

        this.defaultValue.siteID = user?.data?.SecurityUsers?.SiteID;
        this.defaultValue.siteName = user?.data?.SecurityUsers?.SiteName;
        this.defaultValue.employeeID = user?.data?.SecurityUsers?.EmployeeID;
        this.defaultValue.sentToSiteID = user?.data?.SecurityUsers?.ParentSiteID;
        this.defaultValue.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;


      
        //this.requestsForm.get('reportByID').setValue(this.username);
        //this.requestsForm.get('labAppvDate').setValue(Date.now());

      }
    });
    //this.requestsForm.patchValue({
    // /* requestStatus: this.saveType*/
    //});
    //this.executeSaveData();



    const encryptedData = this.encryptUsingAES256({
      reportName: reportName,
      parameters: {
        loginName: this.defaultValue.employeeName,
        sqlWhere: `it.LabNumber='${this.requestsForm.get('labNumber').value}'`,
        reportOpt: this.reportOption,
        printOpt: this.printReportOption
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
    return;

    // const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
    //   {
    //     queryParams:
    //     exportNhsoRangeForm
    //       report: reportName,onConfirmPrintOption
    //       sqlWhere: `LabNumber='${this.requestsForm.get('labNumber').value}'`,
    //       reportOpt: this.reportOption,
    //       printOpt: this.printReportOption
    //     }
    //   });
    // const baseUrl = window.location.href.replace(this.router.url, '');
    // window.open(baseUrl + newRelativeUrl, '_blank');
  }

  onReportOptionChange = (ev: any) => {
    // console.log('report option => ', this.reportOption);
    // console.log('print option => ', this.printReportOption);
  }

  // public showConfirm(message) {
  //   this.smModal.show();
  //   return new Promise((resolve) => {
  //     document.getElementById('btnYes').onclick = () => {
  //       resolve(true);
  //       this.smModal.hide();
  //     }
  //   })
  // }

  onConfirmPassword = async () => {
    this.checkPass().subscribe((response) => {
      $(this.confirmPass.nativeElement).modal('hide');
      this.userPassword = '';

      if (this.appSettings.requireApproveRemark == 'Y') {
        this.openModalComment(this.saveType)
          .then((res) => {
            this.requestsForm.patchValue({
              requestStatus: this.saveType
            });

            this.requestsForm.get('requestStatus').patchValue(this.saveType);
            this.executeSaveData();
          });
      } else {
        this.requestsForm.get('requestStatus')?.patchValue(this.saveType);
        this.executeSaveData();
      }

    },
      (err) => {
        console.log('err >> ', err);
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'รหัสผ่านไม่ถูกต้อง',
        });
      });
  }

  checkPass(): Observable<any> {
    return this.repoService.getDataParm('api/auth/signin', { username: this.username, UserPassword: this.userPassword });
  }

  doCheckPassword = async (): Promise<any> => {
    try {
      return this.repoService.getDataParm('api/auth/signin', { username: this.username, UserPassword: this.userPassword });
    }
    catch (error) {
      console.error(error);
      return false;
    }
  }

  // public doSave = () => {
  //   this.executeSaveData();
  // }

  onPrepareSave(): boolean {
    try {
      this.requestsDTO = {
        Requests: new Array<RequestsModel>(),
        RequestsPatientMores: new Array<RequestsPatientMoreModel>()
      };


      let guId = this.requestsForm.get('requestID').value;
      if (guId) {
      } else {
        guId = Guid.create();
      }

      const receiveDate = this.requestsForm.get('receiveDate').value;
      const shiptoDate = this.requestsForm.get('shiptoDate').value;
      const birthday = this.requestsForm.get('birthday').value;
      const ultrasoundDate = this.requestsForm.get('ultrasoundDate').value;
      const lMPDate = this.requestsForm.get('lMPDate').value;
      const sampleDate = this.requestsForm.get('sampleDate').value;
      const salumIntersectionDate = this.requestsForm.get('salumIntersectionDate').value;
      const savetoNHSODate = this.requestsForm.get('savetoNHSODate').value;
      const analystDate = this.requestsForm.get('analystDate').value;
      const doctorAppvDate = this.requestsForm.get('doctorAppvDate').value;
      //const labAppvDate = this.requestsForm.get('labAppvDate').value;

      const amnioticDate = this.requestsForm.get('amnioticDate').value;

      this.requestsForm.patchValue({
        requestID: guId.toString(),
        receiveDate: this.datePipe.transform(receiveDate, 'yyyy-MM-dd', 'en-US'),
        shiptoDate: this.datePipe.transform(shiptoDate, 'yyyy-MM-dd', 'en-US'),
        birthday: this.datePipe.transform(birthday, 'yyyy-MM-dd', 'en-US'),
        ultrasoundDate: this.datePipe.transform(ultrasoundDate, 'yyyy-MM-dd', 'en-US'),
        lMPDate: this.datePipe.transform(lMPDate, 'yyyy-MM-dd', 'en-US'),
        sampleDate: this.datePipe.transform(sampleDate, 'yyyy-MM-dd', 'en-US'),
        salumIntersectionDate: this.datePipe.transform(salumIntersectionDate, 'yyyy-MM-dd', 'en-US'),
        savetoNHSODate: this.datePipe.transform(savetoNHSODate, 'yyyy-MM-dd', 'en-US'),
        analystDate: this.datePipe.transform(analystDate, 'yyyy-MM-dd', 'en-US'),
        //doctorAppvDate: doctorAppvDate ? this.datePipe.transform(doctorAppvDate, 'yyyy-MM-dd', 'en-US') : null,
        //labAppvDate: labAppvDate ? this.datePipe.transform(labAppvDate, 'yyyy-MM-dd HH:mm:ss', 'en-US') : null,

        amnioticDate: amnioticDate ? this.datePipe.transform(amnioticDate, 'yyyy-MM-dd ', 'en-US') : null,
      });

      this.requestsDTO.Requests = [Object.assign({}, this.requestsForm.value)];

      return true;
    }
    catch (err) {
      return false;
    }
  }

  private executeSaveData = async () => {
    if (!this.onPrepareSave()) {
      this.notiService.showWarning('กรุณากรอกข้อมูล');
      return;
    }

    console.log('this.requestsDTO >> ', this.requestsDTO);
    this.spinner.show();
   
    return this.requestsRepoService.saveRequests(this.requestsDTO)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        this.isUpdated = true;
        this.spinner.hide();
        this.notiService.showSuccess('Save Successfully.');
        // this.goBack();
        this.getPatientData();
        this.doSetDate();
      }, (err) => {
        this.spinner.hide();
        console.log('executeSaveData error >> ', err);
        return this.handleError(err);
      });
  }

  doAmnioticSave = async (e: any) => {
    const file: File = this.requestsForm.get('fileToUpload').value;
    // console.log('files >>>>>>>>>>>>>>>> ', file?.name);

    if (file) {
      const labNo = this.requestsForm.get('labNumber').value;
      const latestDate = this.datePipe.transform(new Date(), 'yyyyMMddTHHmmss');

      const physicalFileName = `(${labNo})_${latestDate}_${file.name}`;
      // console.log('latestDate >>> ', physicalFileName);
      this.requestsForm.patchValue({
        amnioticPhysicalFileName: physicalFileName,
      });
    }

    await this.executeSaveData();
    console.log('save success');
    const upload = await this.fileService.uploadAmnioticFile(file, this.requestsForm).toPromise();
    if (upload) {
      console.log('upload success');
      this.requestsForm.patchValue({
        amnioticPhysicalLatestFileName: this.requestsForm.get('amnioticPhysicalFileName').value,
        amnioticLatestFileName: this.requestsForm.get('amnioticAnalysisReportFile').value,
        fileToUpload: null
      });
    }

    // this.fileService.uploadAmnioticFile(file, this.requestsForm).subscribe(
    //   data => {
    //     if (data) {
    //       console.log('upload success');

    //       this.requestsForm.patchValue({
    //         aminoticPhysicalLatestFileName: this.requestsForm.get('aminoticPhysicalFileName').value,
    //         fileToUpload: null
    //       });
    //     }
    //   },
    //   error => {
    //   }
    // );

  }

  public getPatientData = () => {
    console.log('eeeee');
    const item = {
      sqlSelect: `it.*, MSSite.SiteName As SiteName, sampleType.SampleTypeName, profile.ProfileName ` +
        `, sent.SentSampleNo, sent.NumberOFSamples`,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSLabSampleType as sampleType On (sampleType.SampleTypeID = it.SampleTypeID) ` +
        `Left Outer Join MSLabProfile as profile On (profile.ProfileID = it.ProfileID) ` +
        `Left Outer Join LISSentSampleHD as sent On (sent.SentSampleID = it.SentSampleID)`,
      sqlWhere: this.defaultValue.forScienceCenter == true ? `` : `(it.SiteID = '${this.defaultValue.siteID}')`,
      sqlOrder: `LabNumber Asc`,
      pageIndex: -1
    };

    const where = this.getRangeWhereString();
    item.sqlWhere += item.sqlWhere ? ` and ${where}` : where;

    // const range = this.utilService.getDateRange(this.rangeSelectedValue);
    // if (range) {
    //   const startDate = this.datePipe.transform(range.start, 'yyyyMMdd');
    //   const endDate = this.datePipe.transform(range.end, 'yyyyMMdd');
    //   item.sqlWhere += item.sqlWhere ? ` and (it.ReceiveDate between '${startDate}' and '${endDate}')` : ` (it.ReceiveDate between '${startDate}' and '${endDate}')`;
    // }

    this.spinner.show();
    this.requestService.getByCondition(item)
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        const request = this.utilService.camelizeKeys(res.data.Requests);
        if (request.length == 0) {
          this.notiService.showError('ไม่พบข้อมูลตามเงื่อนไขที่ระบุ');
        }

        this.requestLists = request as RequestsModel[];
        this.requestAlls = request as RequestsModel[];

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = request as RequestsModel[];

        console.log('res.data.Requests => ', res.data.Requests);

        // this.dataSource.subscribe(x => {
        //   this.matDataSource.data = x;

        //   // The important part:
        //   this.changeDetectorRef.detectChanges();
        // });

        this.spinner.hide();
      },
        (err) => {
          this.spinner.hide();
          return this.handleError(err);
        });
  }

  getRangeWhereString = (): string => {
    let sqlWhere = '';
    const fromDate = this.datePipe.transform(this.rangeForm.get('fromDate').value, 'yyyyMMdd');
    const toDate = this.datePipe.transform(this.rangeForm.get('toDate').value, 'yyyyMMdd');

    if (fromDate && toDate) {
      sqlWhere = `convert(varchar(10), sent.sentSampleDate, 112) between '${fromDate}' and '${toDate}' `;
    } else if (fromDate) {
      sqlWhere = `convert(varchar(10), sent.sentSampleDate, 112) >= '${fromDate}' `;
    } else if (toDate) {
      sqlWhere = `convert(varchar(10), sent.sentSampleDate, 112) <= '${toDate}' `;
    }

    const siteId = this.rangeForm.get('siteID').value;
    if (siteId) {
      sqlWhere += sqlWhere ? ` and (it.siteID = '${siteId}')` : '';
    }

    const labNo = this.rangeForm.get('labNumber').value;
    if (labNo) {
      sqlWhere += sqlWhere ? ` and (it.labNumber = '${labNo}') ` : '';
    }

    //ถ้ามีปัญหาเอาส่วงนนี้ Comment ไว้
    //sqlWhere += sqlWhere ? ` and it.RequestStatus != 'Shipment'  and  it.RequestStatus != 'Draft'  and  it.RequestStatus != ''  ` : `ooloo`;

    if (fromDate == null && toDate == null) {
      console.log('wwww1111');
      sqlWhere += ` it.RequestStatus != 'Shipment'  and  it.RequestStatus != 'Draft'
               and  it.RequestStatus != 'Pending'   and  it.RequestStatus != 'Pending'
               and  it.RequestStatus != ''  and  it.RequestStatus != 'In-Process'   and  it.RequestStatus != 'Rejected' `;
      //sqlWhere += ` it.RequestStatus = 'Approved'  and  it.RequestStatus = 'Received'  and  it.RequestStatus = 'Reported'  `;
    } else {
      console.log('wwww2222');
      //sqlWhere += ` and it.RequestStatus != 'Shipment'  and  it.RequestStatus != 'Draft'  and  it.RequestStatus != ''  `;
      sqlWhere += `  and  it.RequestStatus != 'Shipment'  and  it.RequestStatus != 'Draft'
                     and  it.RequestStatus != 'Pending'   and  it.RequestStatus != 'Pending'
                     and  it.RequestStatus != ''  and  it.RequestStatus != 'In-Process'
                     and  it.RequestStatus != 'Rejected'  `;
      //sqlWhere += ` and it.RequestStatus != 'Shipment'  and  it.RequestStatus != 'Draft'  and  it.RequestStatus != ''  `;
    }

    if (this.defaultValue.forDepartureHospital == true && this.defaultValue.forScienceCenter == false) {
      //console.log('222');
      sqlWhere += `
            and   it.RequestStatus = 'Approved'  or it.RequestStatus = 'Rejected'

                    `;
     
    }



    return sqlWhere;
  }

  showAlert = () => {
    alert('xxx');
  }

  clearSite = () => {
    this.rangeForm.patchValue({
      siteID: '',
      siteName: ''
    });
  }

  doLoadPatientMore = () => {
    const requestId = this.requestsForm.get('requestID').value;
    const patientItem = {
      requestID: ``,
      sqlSelect: `more.PatientMoreCode, more.PatientMoreName as PatientMoreText, more.PatientMoreID as LabPatientMoreID, it.* `,
      sqlFrom: `RIGHT OUTER JOIN MSLabPatientMore as more on (it.PatientMoreID = more.PatientMoreID and (it.RequestID = '${requestId}') ) `,
      pageIndex: -1
    };

    this.requestsRepoService.getPatientMoreByCondition(patientItem)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.RequestsPatientMores);
        this.patientMoreLists = data;
        const mores = this.requestsForm.get('patientMoreForms') as FormArray;
        mores.clear();

        this.patientMoreLists.forEach(elem => {
          mores.push(this.fb.group(elem));
        });
      }, (err) => {
        this.handleError(err);
      });
  }

  doLoadResults = () => {
    const requestId = this.requestsForm.get('requestID').value;
    const item = {
      requestID: ``,
      sqlSelect: `test.TestCode, test.TestName as TestNameText, test.ListNo as ListOrder, it.* `,
      sqlFrom: `RIGHT OUTER JOIN MSLabTest as test on (it.TestID = test.TestID and (it.RequestID = '${requestId}') ) `,
      sqlOrder: 'ListOrder',
      pageIndex: -1
    };

    this.requestsRepoService.getLabResults(item)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.LabResults);
        // console.log('results data >> ', data);
        this.resultsLists = data;
        const results = this.requestsForm.get('resultsForms') as FormArray;
        results.clear();

        this.resultsLists.forEach(elem => {
          results.push(this.fb.group(elem));
        });
      }, (err) => {
        this.handleError(err);
      });
  }

  doSetDate = () => {
    const requestDate = this.requestsForm.get('requestDate').value;
    const receiveDate = this.requestsForm.get('receiveDate').value;
    const shiptoDate = this.requestsForm.get('shiptoDate').value;
    const birthday = this.requestsForm.get('birthday').value;
    const startDate = this.requestsForm.get('startDate').value;
    const endDate = this.requestsForm.get('endDate').value;
    const dueDate = this.requestsForm.get('dueDate').value;
    const ultrasoundDate = this.requestsForm.get('ultrasoundDate').value;
    const lMPDate = this.requestsForm.get('lMPDate').value;
    const bloodPressureDate = this.requestsForm.get('bloodPressureDate').value;
    const sampleDate = this.requestsForm.get('sampleDate').value;
    const salumIntersectionDate = this.requestsForm.get('salumIntersectionDate').value;
    const savetoNHSODate = this.requestsForm.get('savetoNHSODate').value;
    const analystDate = this.requestsForm.get('analystDate').value;
    //const doctorAppvDate = this.requestsForm.get('doctorAppvDate').value;
    //const labAppvDate = this.requestsForm.get('labAppvDate').value;

    const amnioticDate = this.requestsForm.get('amnioticDate').value;

    this.requestsForm.patchValue({
      requestDate: requestDate ? new Date(requestDate) : null,
      receiveDate: receiveDate ? new Date(receiveDate) : null,
      shiptoDate: shiptoDate ? new Date(shiptoDate) : null,
      birthday: birthday ? new Date(birthday) : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      ultrasoundDate: ultrasoundDate ? new Date(ultrasoundDate) : null,
      lMPDate: lMPDate ? new Date(lMPDate) : null,
      bloodPressureDate: bloodPressureDate ? new Date(bloodPressureDate) : null,
      sampleDate: sampleDate ? new Date(sampleDate) : null,
      salumIntersectionDate: salumIntersectionDate ? new Date(salumIntersectionDate) : null,
      savetoNHSODate: savetoNHSODate ? new Date(savetoNHSODate) : null,
      analystDate: analystDate ? new Date(analystDate) : null,
      //labAppvDate: labAppvDate ? new Date(labAppvDate) : null,
      //doctorAppvDate: doctorAppvDate ? new Date(doctorAppvDate) : null,

      amnioticDate: amnioticDate ? new Date(amnioticDate) : null,
    });
  }

  doUploadFile = () => {
    // this.fileService.uploadFile()
  }


  patchRequestsFormValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.requestsForm.controls[ngName]) {
          this.requestsForm.controls[ngName].patchValue(value[name]);
        }
      });
    } catch (error) {
      console.log('error >> ', error);
      this.handleError(error);
    }
  }

  public onRangeChange = () => {
    const range = this.utilService.getDateRange(this.rangeSelectedValue);
    this.rangeForm.patchValue({
      fromDate: range?.start,
      toDate: range?.end
    });
    // this.getPatientData();
  }

  onRetrieveClick = () => {
    this.getPatientData();
    sessionStorage.setItem('ReqResult', '');
  }

  openMSSitePicker() {
    const initialState = {
      list: [''],
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
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

  openModalComment = async (commentType: string) => {
    return new Promise((resolve) => {
      const initialState = {
        list: [],
        commentType,
        itemForm: this.requestsForm,
        comment: commentType == 'Approved' ? this.requestsForm.get('doctorAppvComment').value : this.requestsForm.get('labAppvComment').value
      };
      this.bsModalRef = this.modalService.show(AddNewCommentComponent, { ignoreBackdropClick: true, initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.event.subscribe((res: any) => {
        if (commentType == 'Approved') {
          this.requestsForm.get('doctorAppvComment').patchValue(res.data.comment);
          this.requestsForm.get('doctorAppvDate').patchValue(new Date());
          this.requestsForm.get('approveByID').patchValue(this.username);
        } else if (commentType == 'Reported') {
          this.requestsForm.get('labAppvComment').patchValue(res.data.comment);
          //this.requestsForm.get('labAppvDate').patchValue(new Date());
          this.requestsForm.get('reportByID').patchValue(this.username);
        }
        resolve(true);
      });
    });
  }


  doExportNshoClick = () => {
    //console.log('teetetet');


    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.forDepartureHospital = user.data?.SecurityUsers?.ForDepartureHospital;
        this.forScienceCenter = user.data?.SecurityUsers?.ForScienceCenter;
        console.log('this.forDepartureHospital => ', this.forDepartureHospital);
        console.log('this.forScienceCenter => ', this.forScienceCenter);
        if (this.forDepartureHospital == true) {
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
  onCloseModalRef = (modalId: string) => {
    $(`${modalId}`).modal('hide');
  }


  onConfirmExportNhsoRange = () => {
    $('#exportNhsoRangeRef').modal('hide');
    this.exportCsvToNHSO();
  }



  doLoadDataToNHSO = async () => {
    //let query = `Select * From uv_NhsoExport as it `;
    //let sqlWhere = '';



    // ไว้แก้ต่อไม่วันจันทร์ ก็ อังคาร
    let query = `SELECT 
					ROW_NUMBER() OVER (ORDER BY it.RequestID) ลำดับ
                   ,isnull(it.LabNumber ,'') Lab_No
				   ,isnull(MSSite.SiteName,'') หน่วยงาน
				   ,isnull(it.HN,'') HN
				   ,concat(isnull(it.title,''),'',isnull(it.FirstName,''),' ',isnull(it.LastName,'')) ชื่อ_นามสกุล
				   ,format(it.Birthday, 'dd/MM/yyyy','th')  วันเดือนปีเกิด  
				   ,DATEDIFF(yy,CONVERT(DATETIME, it.Birthday),it.SampleDate)  อายุ
				   ,isnull(it.IdentityCard,'') เลขที่บัตรประชาชน
				   ,isnull(it.Nationality,'') สัญชาติ
				   ,isnull(it.Weight,'') น้ำหนักตัว_ณ_วันที่เจาะเลือด
				   ,isnull(it.PregnantNo,'') G
				   ,('') P
				   ,format(it.ShiptoDate, 'dd/MM/yyyy','th')  วันที่ส่งตรวจ 
				   ,format(it.ShiptoDate, 'HH:mm','th') as เวลาที่ส่งตรวจ 
				   ,format(it.CreatedDate, 'dd/MM/yyyy','th')  วันที่ลงทะเบียน 
				   ,case
						when (it.GAAgeWeeks) != '' and (it.GAAgeDays) != '' 
						then CONVERT(VARCHAR(10), it.GAAgeWeeks) + 'W' + '+' + CONVERT(VARCHAR(10), it.GAAgeDays) + 'D'
						when (it.GAAgeWeeks) != '' and (it.GAAgeDays)  = '' 
						then  CONVERT(VARCHAR(10), it.GAAgeWeeks) + 'W'
						when (it.GAAgeWeeks) = '' and (it.GAAgeDays)  != ''
						then CONVERT(VARCHAR(10), it.GAAgeDays) + 'D'
						else ''
						end GA
				   ,isnull(it.SD1GestAtSampleDate,'') Corrected_GA
				   ,case
					    when (it.PaymentFlag) = 'SSOPayment' then 'สปสช'
						when (it.PaymentFlag) = 'CashPayment' then 'เงินสด'
						when (it.PaymentFlag) = 'SitePayment' then 'แจ้งหนี้หน่วยงานส่งตรวจ'
						when (it.PaymentFlag) = 'AnyJobPayment' then 'โครงการต่างๆ'
						when (it.PaymentFlag) = 'OtherPayment' then 'อื่นๆ'
						else ''
				        end สิทธ์การตรวจ
					,('') การเบิกสปสช
					,case
						when (it.RiskAssessmentValueT21) = '1' then 'Low risk'
						else 'High risk'
						end Risk_for_Trisomy_21 
					,case
						when (it.RiskAssessmentValueT18) = '1' then 'Low risk'
						else 'High risk'
						end Risk_for_Trisomy_18
					,case
						when (it.RiskAssessmentValueT13) = '1' then 'Low risk'
						else 'High risk'
						end Risk_for_Trisomy_13
					,case
						when (it.RiskAgeNTD) = '1' then 'Low risk'
						else 'High risk'
						end Risk_for_NTD

                  from Requests it
                  left outer join MSSite on MSSite.SiteID = it.SiteID `;

    let sqlWhere = '';

    let siteName = this.exportNhsoRangeForm.get('siteName').value;
    console.log('SiteName => ', siteName);
    if (siteName != ''  && siteName != null) {
      console.log('เข้าปะวะ');
      sqlWhere += (sqlWhere ? ` And ` : ` Where `) + `(MSSite.SiteName = '${siteName}') `;
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
      console.log('nhso => ', nhso);


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
  clearSite2 = () => {
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

  btnConfirmNew = () => {
    const ReqId = this.requestsForm.value.requestID;
    const Labnumber = this.requestsForm.value.labNumber;
    const AnsValuePlain_AFP = this.requestsForm.value.ansValuePlain_AFP ?? '';
    const AnsValuePlain_HCGB = this.requestsForm.value.ansValuePlain_HCGB ?? '';
    const AnsValuePlain_INHIBIN = this.requestsForm.value.ansValuePlain_INHIBIN ?? '';
    const AnsValuePlain_UE3UPD = this.requestsForm.value.ansValuePlain_UE3UPD ?? '';
    const AnsValueCorrMoM_AFP = this.requestsForm.value.ansValueCorrMoM_AFP ?? '';
    const AnsValueCorrMoM_HCGB = this.requestsForm.value.ansValueCorrMoM_HCGB ?? '';
    const AnsValueCorrMoM_INHIBIN = this.requestsForm.value.ansValueCorrMoM_INHIBIN ?? '';
    const AnsValueCorrMoM_UE3UPD = this.requestsForm.value.ansValueCorrMoM_UE3UPD ?? '';
    const RiskValueT21 = this.requestsForm.value.riskValueT21 ?? '';
    const RiskValueT18 = this.requestsForm.value.riskValueT18 ?? '';
    const RiskValueT13 = this.requestsForm.value.riskValueT13 ?? '';
    const RiskValueNTD = this.requestsForm.value.riskValueNTD ?? '';
    const RiskCutOffT21 = this.requestsForm.value.riskCutOffT21 ?? '';
    const RiskCutOffT18 = this.requestsForm.value.riskCutOffT18 ?? '';
    const RiskCutOffT13 = this.requestsForm.value.riskCutOffT13 ?? '';
    const RiskCutOffNTD = this.requestsForm.value.riskCutOffNTD ?? '';
    const RiskAssessmentValueT21 = this.requestsForm.value.riskAssessmentValueT21 ?? '';
    const RiskAssessmentValueT18 = this.requestsForm.value.riskAssessmentValueT18 ?? '';
    const RiskAssessmentValueT13 = this.requestsForm.value.riskAssessmentValueT13 ?? '';
    const RiskAssessmentValueNTD = this.requestsForm.value.riskAssessmentValueNTD ?? '';
    const AnalystDate = this.requestsForm.value.analystDate ?? '';

    console.log('ReqId => ', ReqId);
    console.log('Labnumber => ', Labnumber);
    console.log('this.username => ', this.username);
    console.log('AnsValuePlain_AFP => ', AnsValuePlain_AFP);
    console.log('AnsValuePlain_HCGB => ', AnsValuePlain_HCGB);
    console.log('AnsValuePlain_INHIBIN => ', AnsValuePlain_INHIBIN);
    console.log('AnsValuePlain_UE3UPD => ', AnsValuePlain_UE3UPD);
    console.log('AnsValueCorrMoM_AFP => ', AnsValueCorrMoM_AFP);
    console.log('AnsValueCorrMoM_HCGB => ', AnsValueCorrMoM_HCGB);
    console.log('AnsValueCorrMoM_INHIBIN => ', AnsValueCorrMoM_INHIBIN);
    console.log('AnsValueCorrMoM_UE3UPD => ', AnsValueCorrMoM_UE3UPD);
    console.log('RiskValueT21 => ', RiskValueT21);
    console.log('RiskValueT18 => ', RiskValueT18);
    console.log('RiskValueT13 => ', RiskValueT13);
    console.log('RiskValueNTD => ', RiskValueNTD);
    console.log('RiskCutOffT21 => ', RiskCutOffT21);
    console.log('RiskCutOffT18 => ', RiskCutOffT18);
    console.log('RiskCutOffT13 => ', RiskCutOffT13);
    console.log('RiskCutOffNTD => ', RiskCutOffNTD);
    console.log('RiskAssessmentValueT21 => ', RiskAssessmentValueT21);
    console.log('RiskAssessmentValueT18 => ', RiskAssessmentValueT18);
    console.log('RiskAssessmentValueT13 => ', RiskAssessmentValueT13);
    console.log('RiskAssessmentValueNTD => ', RiskAssessmentValueNTD);
    console.log('AnalystDate => ', AnalystDate);


    const Testdate = new Date(AnalystDate);

    var dateObject = new Date(Testdate);
    // Extract year, month, and day from the Date object
    var year = dateObject.getFullYear();
    var month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    var day = dateObject.getDate().toString().padStart(2, '0');

    // Create the desired timestamp string
    var timestamp = year + '-' + month + '-' + day;
    console.log('timestamp => ', timestamp);
    let i = 0;
    const query = ` Select top(1) Round
                        From Recal_History
                        Where RequestsID = '${ReqId}'
                        order by CreatDate desc
                         `;
    const response = this.sentSampleService.query({ queryString: query });
    response.then(data => {
      console.log('datatata => ', data.data.response);

      if (data.data.response.length > 0) {

        //console.log(22);
        for (let el of data.data.response) {
          const queryInsert = `Insert Into Recal_History
                        (RequestsID
                          , Labnumber
                          , User_Create
                          , CreatDate
                          , Round
                          , AnsValuePlain_AFP
                          , AnsValuePlain_HCGB
                          , AnsValuePlain_INHIBIN
                          , AnsValuePlain_UE3UPD
                          , AnsValueCorrMoM_AFP
                          , AnsValueCorrMoM_HCGB
                          , AnsValueCorrMoM_INHIBIN
                          , AnsValueCorrMoM_UE3UPD
                          , RiskValueT21
                          , RiskValueT18
                          , RiskValueT13
                          , RiskValueNTD
                          , RiskCutOffT21
                          , RiskCutOffT18
                          , RiskCutOffT13
                          , RiskCutOffNTD
                          , RiskAssessmentValueT21
                          , RiskAssessmentValueT18
                          , RiskAssessmentValueT13
                          , RiskAssessmentValueNTD
                          , AnalystDate
                        )
                        Values ('${ReqId}'
                              , '${Labnumber}'
                              , '${this.username}'
                              , GETDATE()
                              ,  ${el.round + 1}
                              , '${AnsValuePlain_AFP}'
                              , '${AnsValuePlain_HCGB}'
                              , '${AnsValuePlain_INHIBIN}'
                              , '${AnsValuePlain_UE3UPD}'
                              , '${AnsValueCorrMoM_AFP}'
                              , '${AnsValueCorrMoM_HCGB}'
                              , '${AnsValueCorrMoM_INHIBIN}'
                              , '${AnsValueCorrMoM_UE3UPD}'
                              , '${RiskValueT21}'
                              , '${RiskValueT18}'
                              , '${RiskValueT13}'
                              , '${RiskValueNTD}'
                              , '${RiskCutOffT21}'
                              , '${RiskCutOffT18}'
                              , '${RiskCutOffT13}'
                              , '${RiskCutOffNTD}'
                              , '${RiskAssessmentValueT21}'
                              , '${RiskAssessmentValueT18}'
                              , '${RiskAssessmentValueT13}'
                              , '${RiskAssessmentValueNTD}'
                              , '${timestamp}'
                                )
                           `;
          const responseInsert = this.sentSampleService.query({ queryString: queryInsert });
        }


      } else {
        console.log(111);
        const queryInsert = ` Insert Into Recal_History
                        (   RequestsID
                          , Labnumber
                          , User_Create
                          , CreatDate
                          , Round
                          , AnsValuePlain_AFP
                          , AnsValuePlain_HCGB
                          , AnsValuePlain_INHIBIN
                          , AnsValuePlain_UE3UPD
                          , AnsValueCorrMoM_AFP
                          , AnsValueCorrMoM_HCGB
                          , AnsValueCorrMoM_INHIBIN
                          , AnsValueCorrMoM_UE3UPD
                          , RiskValueT21
                          , RiskValueT18
                          , RiskValueT13
                          , RiskValueNTD
                          , RiskCutOffT21
                          , RiskCutOffT18
                          , RiskCutOffT13
                          , RiskCutOffNTD
                          , RiskAssessmentValueT21
                          , RiskAssessmentValueT18
                          , RiskAssessmentValueT13
                          , RiskAssessmentValueNTD
                          , AnalystDate
                        )
                        Values ('${ReqId}'
                              , '${Labnumber}'
                              , '${this.username}'
                              , GETDATE()
                              , 1
                              , '${AnsValuePlain_AFP}'
                              , '${AnsValuePlain_HCGB}'
                              , '${AnsValuePlain_INHIBIN}'
                              , '${AnsValuePlain_UE3UPD}'
                              , '${AnsValueCorrMoM_AFP}'
                              , '${AnsValueCorrMoM_HCGB}'
                              , '${AnsValueCorrMoM_INHIBIN}'
                              , '${AnsValueCorrMoM_UE3UPD}'
                              , '${RiskValueT21}'
                              , '${RiskValueT18}'
                              , '${RiskValueT13}'
                              , '${RiskValueNTD}'
                              , '${RiskCutOffT21}'
                              , '${RiskCutOffT18}'
                              , '${RiskCutOffT13}'
                              , '${RiskCutOffNTD}'
                              , '${RiskAssessmentValueT21}'
                              , '${RiskAssessmentValueT18}'
                              , '${RiskAssessmentValueT13}'
                              , '${RiskAssessmentValueNTD}'
                              , '${timestamp}'
                                )
                           `;
        const responseInsert = this.sentSampleService.query({ queryString: queryInsert });
      }

      const queryUpdate = ` update Requests
                      set RequestStatus = 'Received'
                         ,Requests_Recal = 'Recal'
                      where RequestID = '${ReqId}'
                         `;
      const responseUpdate = this.sentSampleService.query({ queryString: queryUpdate });

      $('#testmodal').modal('hide');
      this.getPatientData();
      this.notiService.showSuccess('บันทึกข้อมูลสำเร็จ');


    });


  }



  onRecalClick = () => {
    //$('#testmodal').modal('show');
    //console.log('ReqId => ', this.requestsForm.value.requestID);
    const ReqId = this.requestsForm.value.requestID;
    console.log('reqId => ', ReqId);
    if (ReqId != '') {
      $('#testmodal').modal('show');
    } else {
      $('#testmodal').modal('hide');
      return this.notiService.showError('กรุณาเลือกข้อมูลคนไข้');
    }

  }





  LoaddataHistoryLog = () => {
    ////console.log(11);

    const requestId = this.requestsForm.get('requestID').value;
    console.log('ttttt  => ', requestId );

    if (requestId != '') {
      //console.log(999);
      const queryData = ` Select top(3) *
                        From Recal_History
                        Where RequestsID = '${requestId}'
                        order by CreatDate desc , id asc
                         `;
      const response = this.sentSampleService.query({ queryString: queryData });
      response.then(data => {
        this.ListNewFunction = data.data.response;
        if (data.data.response.length > 0) {
          this.openLabTestPicker();
        } else {
          this.notiService.showError('ไม่พบประวัติรายการย้อนหลังคนไข้');
        }
      });

    } else {
      //console.log(888);
      this.notiService.showError('กรุณาเลือกรายการข้อมูลคนไข้');
    }



  }
  clicknewfunctionHistoryMain = () => {
    this.LoaddataHistoryLog();

  }

  openLabTestPicker() {
    //console.log('Labboprn');
    const initialState = {
      list: [],
      title: 'ประวัติผลคนไข้ย้อนหลัง',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(LabtestPickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action.subscribe(
      (value: any) => {
        if (!value || value.isCancel) {
          return;
        }
        //console.log('selected value >> ', value.selectedItem);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX;
    this.scrollLeft = this.tableScrollable.nativeElement.scrollLeft;
    this.renderer.setStyle(this.tableContainer.nativeElement, 'cursor', 'grabbing');
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.renderer.setStyle(this.tableContainer.nativeElement, 'cursor', 'grab');
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const x = event.clientX;
      const walk = (x - this.startX) * 2;
      this.tableScrollable.nativeElement.scrollLeft = this.scrollLeft - walk;
    }
  }
}


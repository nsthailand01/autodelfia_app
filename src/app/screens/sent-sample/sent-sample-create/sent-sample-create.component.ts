import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { Data, Router, ActivatedRoute } from '@angular/router';
import { ToastrNotificationService, AuthenticationService } from '@app/services';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LISSentSampleHDModel, LISSentSampleDTModel, RequestsModel, MSLabSampleTypeModel, MSSiteModel, MSLabProfileModel } from '@app/models';
import { SentSampleDTO } from '@app/models/data-transfer-object';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { SentSampleService } from '../sent-sample.service';
import { Guid } from 'guid-typescript';
import { Observable, of, Subscription } from 'rxjs';
import { UtilitiesService } from '@app/services/utilities.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { MssitePickerComponent } from '@app/pickers/mssite-picker/mssite-picker.component';
import { EmployeePickerComponent } from '@app/pickers/employee-picker/employee-picker.component';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import Swal from 'sweetalert2';
import { MslabProfilePickerComponent, SampleTypePickerComponent } from '@app/pickers';
import { RepositoryService } from '@app/shared/repository.service';
import { retry, take } from 'rxjs/operators';
import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
import { EmGAReferenceRangeModel } from '@app/models/emgareferencerange.model';
defineLocale('th', thBeLocale);

@Component({
  selector: 'app-sent-sample-create',
  templateUrl: './sent-sample-create.component.html',
  styleUrls: ['./sent-sample-create.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SentSampleCreateComponent extends BaseComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {
  public permissions: Data;
  public sentSampleForm: FormGroup;
  public requestFormsArray: FormArray;
  public requestLists: Array<RequestsModel>;
  public requestToDelete: Array<RequestsModel>;
  public sendSampleLists: Array<LISSentSampleHDModel>;
  private sentSampleDto: SentSampleDTO;
  private isUpdated: boolean = false;
  public isReceived: boolean = false;

  public sampleTypeObjCombo: Array<MSLabSampleTypeModel>;
  public selectedSampleType: any;
  public sampleTypeID: string = '';
  // private userName: string = '';
  // private siteID: string = '';
  // private siteName: string = '';
  public isDeleted = false;
  sub: Subscription;

  locale = 'th';
  // locales = listLocales();

  private defaultValue = {
    siteID: '',
    siteName: '',
    userName: '',
    employeeID: '',
    employeeName: '',
    sentToSiteID: '',
    sentToSiteName: ''
  };

  runPrefix: string = '';
  receiveNo: string = '';
  inputCompleted: boolean = false;
  forScienceCenter: boolean = false;
  gARanges: Array<EmGAReferenceRangeModel>;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: ToastrNotificationService,
    private sentSampleService: SentSampleService,
    private utilService: UtilitiesService,
    private authService: AuthenticationService,
    private localeService: BsLocaleService,
    private repoService: RepositoryService,
    private requestsRepoService: RequestsRepoService,
  ) {
    super();

    // tslint:disable-next-line: deprecation
    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.defaultValue.userName = user.data.SecurityUsers.UserName;
        this.defaultValue.siteID = user.data.SecurityUsers.SiteID;
        this.defaultValue.siteName = user.data.SecurityUsers.SiteName;
        this.defaultValue.employeeID = user.data.SecurityUsers.EmployeeID;
        this.defaultValue.employeeName = user.data.SecurityUsers.EmployeeName;
        this.defaultValue.sentToSiteID = user.data.SecurityUsers.ParentSiteID;
        this.defaultValue.sentToSiteName = user.data.SecurityUsers.ParentSiteName;
        this.runPrefix = user.data.SecurityUsers.RunPrefix;

        this.forScienceCenter = user.data?.SecurityUsers?.ForScienceCenter;
      }
    });

    console.log('this.forScienceCenter :: ', this.forScienceCenter);
    this.localeService.use(this.locale);
  }

  ngAfterContentChecked(): void {
    // this.changeDetectorRef.detectChanges();
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    const cb = this.sentSampleForm.get('isDeleted');
    const ob: Observable<boolean> = cb.valueChanges;
    ob.subscribe(v => {
      this.isDeleted = v;
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    setTimeout(() => this.toastrNotiService.clear(), 1000);
    if (!this.isUpdated && this.sentSampleForm.dirty) {
      return this.confirmDlgService.open();
    }
    return of(true);
  }

  ngOnInit(): void {
    // console.log('router >> ', this.route.snapshot.data['permissions']);
    // console.log('config router >> ', this.router.config);
    // this.permissions = this.route.snapshot.data['permissions'];

    // console.log(' data isnew ::: ', this.route.snapshot.data['isNew']);
    // tslint:disable-next-line: deprecation
    this.sub = this.route.data.subscribe(v => console.log(v));

    this.createInitialForm();
    this.doLoadData();
    this.doLoadGARange();

    this.isDeleted = this.sentSampleForm.get('isDeleted').value == 1 ? true : false;

    // const newDate = new Date(2021, 0, 21);
    // const thisYear = this.utilService.thisYear(new Date());
    // console.log('this year >> ', thisYear);
    // console.log('this month >> ', this.utilService.thisMonth(newDate));
    // console.log('this week >> ', this.utilService.thisWeek(newDate));
    // console.log('last year >> ', this.utilService.lastYear(newDate));
    // console.log('last month >> ', this.utilService.lastMonth(newDate));
    // console.log('last week >> ', this.utilService.lastWeek(newDate));
  }

  createInitialForm() {
    // const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'en-US');
    this.sentSampleForm = this.fb.group(new LISSentSampleHDModel());
    this.sentSampleForm.addControl('requestsForm', this.fb.array([new RequestsModel()]));
    this.sentSampleForm.addControl('patientMoreForms', this.fb.array([]));
    this.requestFormsArray = this.sentSampleForm.controls.requestsForm as FormArray;
    this.requestLists = new Array<RequestsModel>();
    this.requestToDelete = new Array<RequestsModel>();
    this.isReceived = false;

    if (this.sentSampleForm.get('isNew').value) {
      this.sentSampleForm.patchValue({
        userName: this.defaultValue.userName,
        siteID: this.defaultValue.siteID,
        siteName: this.defaultValue.siteName,
        employeeID: this.defaultValue.employeeID,
        employeeName: this.defaultValue.employeeName,
        sentToSiteID: this.defaultValue.sentToSiteID,
        sentToSiteName: this.defaultValue.sentToSiteName
      });
    }

    this.runPrefix = '';
    // tslint:disable-next-line: deprecation
    this.authService.currentUser.subscribe((user: any) => {
      this.runPrefix = user?.data?.SecurityUsers?.RunPrefix;
    });
    this.receiveNo = '';

    this.loadSampleType(null)
      .subscribe((res) => {
        res = this.utilService.camelizeKeys(res);
        this.sampleTypeObjCombo = res.data.mSLabSampleTypes;
        const idx = this.sampleTypeObjCombo.findIndex(x => x.isDefault === true);
        this.selectedSampleType = this.sampleTypeObjCombo[idx];
        this.sentSampleForm.get('sampleTypeID').patchValue(this.selectedSampleType.sampleTypeID);
      }, (err) => {
        console.log('err >> ', err);
        this.handleError(err);
      });


    this.doSetDefault();

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

  doLoadGARange = () => {
    const item = {
      sqlSelect: `it.*`,
      sqlFrom: ``,
      pageIndex: -1
    };

    this.requestsRepoService.getGARanges(item)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.EmGAReferenceRanges);
        this.gARanges = data;
      });
  }

  public doLoadData = async () => {
    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;

    if (objData != null) {
      console.log('testtttttttttttttt');
      const item = {
        sentSampleID: objData.sentSampleID,
        sqlSelect: `it.*, MSSite.SiteName As SiteName, emp.FirstName + ' ' + emp.LastName as EmployeeName, sent.SiteName as SentToSiteName ` +
          `, type.SampleTypeName`,
        sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
          `Left Outer Join MSSite as sent On (sent.SiteID = it.SentToSiteID) ` +
          `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) ` +
          `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID) `,
        sqlWhere: `(it.SentSampleID = '${objData?.sentSampleID}')`,
        sqlOrder: ``,
        pageIndex: -1
      };

      const promiseHd = await this.sentSampleService.getLISSentSampleHDByCondition(item).toPromise();
      let modelHd: LISSentSampleHDModel = Object.assign({}, promiseHd?.data.LISSentSampleHDs[0]);
      modelHd = this.utilService.camelizeKeys(modelHd);
      this.patchSampleFormValues(modelHd);
      this.sampleTypeID = this.sentSampleForm.get('sampleTypeID').value;
      this.isReceived = modelHd.receiveNo ? true : false;
      this.receiveNo = modelHd.receiveNo;

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
      this.isDeleted = this.sentSampleForm.get('isDeleted').value == 1 ? true : false;

      // let promiseDt = await this.sentSampleService.getLISSentSampleDTById({ SQLWhere: `it.SentSampleID = '${objData.sentSampleID}'` }).toPromise();
      // promiseDt = this.utilService.camelizeKeys(promiseDt);
      // promiseDt.data.LISSentSampleDTs?.forEach((dt: any) => {
      //   dt.spParmLastSentSampleID = dt.sentSampleID;
      // });

      let promiseRequest = await this.requestsRepoService
        .getRequestsById({
          sqlSelect: `it.*, type.SampleTypeName`,
          sqlFrom: `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID)`,
          sqlWhere: `it.SentSampleID = '${objData.sentSampleID}'`,
          sqlOrder: `it.LabNumber Asc`
        }).toPromise();
      promiseRequest = this.utilService.camelizeKeys(promiseRequest);
      this.requestLists = promiseRequest?.data.requests;

      // console.log('requests lists >> ', this.requestLists);

      const idx = this.sampleTypeObjCombo.findIndex(x => x.sampleTypeID === this.sampleTypeID);
      this.selectedSampleType = this.sampleTypeObjCombo[idx];
    }

    this.doCheckRequired();
  }

  doCheckRequired = () => {
    const idxIncomplete: Array<number> = new Array<number>();
    this.requestLists.forEach((item, index) => {

      // ข้อมูลหญิงตั้งครรภ์
      let completed = ((item.title) ? true : false) && ((item.firstName) ? true : false)
        && ((item.lastName) ? true : false) && ((item.race) ? true : false) && ((item.identityCard) ? true : false)
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
      }

      if (completed) {
        item.inputCompleted = true;
      } else {
        idxIncomplete.push(index);
        item.inputCompleted = false;
      }
    });

    if (idxIncomplete.length > 0) {
      this.inputCompleted = false;
    } else {
      this.inputCompleted = true;
    }

    this.changeDetectorRef.detectChanges();
  }

  loadSampleType(item: any): Observable<any> {
    return this.repoService.getData('api/mslabsampletype/getall').pipe(retry(1));
  }

  getRunPrefix(): Observable<any> {
    const siteId = this.sentSampleForm.get('siteID').value;
    const item = {
      sqlWhere: `it.SiteID = '${siteId}'`
    };
    return this.repoService.getDataParm('api/MSSite/getByCondition', item).pipe(retry(1));
  }

  public onNewClick = () => {
    if (!this.isUpdated && this.sentSampleForm.dirty) {
      // tslint:disable-next-line: deprecation
      this.confirmDlgService.open().subscribe(res => {
        if (res) {
          this.onCreateNew();
        }
      });
    } else {
      this.onCreateNew();
    }
  }

  onCreateNew() {
    sessionStorage.removeItem('LISSentSampleHDDataStorage');
    setTimeout(() => this.toastrNotiService.clear(), 1000);
    this.createInitialForm();
  }

  public goBack = () => {
    sessionStorage.removeItem('LISSentSampleHDDataStorage');
    setTimeout(() => this.toastrNotiService.clear(), 2000);

    if (window.history.length > 1) {
      this.router.navigate(['/sent-sample/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.sentSampleForm.get('documentStatus').patchValue('Draft');
    this.executeSaveData();
  }

  public doSentSample = () => {
    this.sentSampleForm.get('documentStatus').patchValue('In-Process');
    this.executeSaveData();
  }

  public doDelete = () => {
    this.notiService.showError('Delete...');
  }

  checkGA = async (): Promise<boolean> => {

    const toastrConfig = {
      positionClass: 'toast-top-center',
      disableTimeOut: true,
      preventDuplicates: true,
      closeButton: true,
      timeOut: 0
    };

    for (const req of this.requestLists) {
      if (req.ultrasoundFlag != 'BPD') {
        continue;
      }

      const one_day = 1000 * 60 * 60 * 24;
      const ultrasoundDate = req.ultrasoundDate;
      const sampleDate = req.sampleDate;

      const diff = sampleDate?.valueOf() - ultrasoundDate?.valueOf();
      const diffDays = Math.ceil(diff / one_day);

      const bpd_mm = req.ultrasound_BPD;
      const ga = this.gARanges.find(item => (bpd_mm >= item.start_mm) && (bpd_mm <= item.end_mm));
      const totalDays = ga?.totalDays;

      const gaDays = diffDays + totalDays;
      if (!(gaDays >= 98 && gaDays <= 146)) {
        // setTimeout(() =>
        //   this.toastGaRef =
        //   this.toastrNotiService.error('อายุครรภ์ไม่สัมพันธ์ กับ BPD จะมีผลต่อการตรวจวิเคราะห์ กรุณาตรวจสอบให้ถูกต้อง', '',
        //     toastrConfig)
        // );
      } else {
        // this.toastrNotiService.clear(this.toastGaRef?.toastId);
      }

    }

    return true;
  }

  doPrepareSave = async (): Promise<boolean> => {
    try {
      this.sentSampleDto = {
        LISSentSampleHDs: [new LISSentSampleHDModel()],
        LISSentSampleDTs: [new LISSentSampleDTModel()],
        Requests: new Array<RequestsModel>(),
        RequestsPatientMores: new Array<RequestsPatientMoreModel>()
      };

      let guId = Guid.create();
      if (this.sentSampleForm.get('isNew').value) {
        //
      } else {
        guId = this.sentSampleForm.get('sentSampleID').value;
      }

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

      this.requestLists.forEach((req) => {
        req.ultrasound_BPD = req.ultrasound_BPD ? req.ultrasound_BPD : null;
        req.ultrasound_CRL = req.ultrasound_CRL ? req.ultrasound_CRL : null;
        req.numberofOther = req.numberofOther ? req.numberofOther : null;
        req.pregnantTypeOther = req.pregnantTypeOther ? req.pregnantTypeOther : null;
        req.gAAgeWeeks = req.gAAgeWeeks ? req.gAAgeWeeks : null;
        req.gAAgeDays = req.gAAgeDays ? req.gAAgeDays : null;
        req.weight = req.weight ? req.weight : null;
        req.profileID = profileId;
      });

      this.sentSampleForm.patchValue({
        sentSampleID: guId.toString(),
        sentSampleDate: this.datePipe.transform(sentSampleDate, 'yyyy-MM-dd', 'en-US'),
        isDeleted: this.isDeleted ? 1 : 0,
        inputPercentage: 0,
        numberOFSamples: this.requestLists.length
        // receiveFlag: 'NotPaid'
      });

      const mores = this.moreForms;
      this.sentSampleDto.LISSentSampleHDs = [Object.assign({}, this.sentSampleForm.value)];
      this.sentSampleDto.Requests = this.requestLists; // [Object.assign({}, this.requestsForm.value)];

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

          // patientMoreForms.controls.forEach((elm: any) => {
          //   elm.requestID = request.requestID;

          //   moresSave.push(elm);
          // });
          // moresSave.push(patientMoreForms.controls);
        }
        else {
        }
      });

      // console.log('moresSave >> ', ...moresSave);
      this.sentSampleDto.RequestsPatientMores = (moresSave); // new Array<RequestsPatientMoreModel>();
      return true;
    }
    catch (err) {
      console.error('error ', err);
      this.handleError(err);
      return false;
    }
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

  private executeSaveData = async () => {
    const prepare = await this.doPrepareSave();
    if (!prepare) {
      return;
    }

    // if (!this.doPrepareSave()) {
    //   return;
    // }

    return this.sentSampleService.save(this.sentSampleDto)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        this.isUpdated = true;
        this.spinner.hide();
        this.toastrNotiService.clear();
        this.notiService.showSuccess('Save Successfully.');
        this.goBack();
      }, (err) => {
        this.spinner.hide();
        console.log('executeSaveData error >> ', err);
        return this.handleError(err);
      });
  }

  selectedTabChange(tabChangeEvent: MatTabChangeEvent) {
    console.log(tabChangeEvent);
    const selectedTab = tabChangeEvent.tab;
    console.log(selectedTab);
  }

  get moreForms(): FormArray {
    return this.sentSampleForm.get('patientMoreForms') as FormArray;
  }

  updateItemChanged(event: any) {
    console.log('emit data >> ', event);
    this.sentSampleForm.get('numberOFSamples').patchValue(event.length);
    // this.requestLists = event;

    this.doCheckRequired();
  }

  dateInputChange = (ev) => {
    // console.log('date change : ', ev);
  }

  onNumberOfSampleChanged(event: any) {
    // console.log('sample change >> ', event.target.value);
    this.applySampleRequest(event.target.value);
    this.doCheckRequired();
  }

  applySampleRequest(data: any) {
    if (!this.requestLists) {
    }
    const numberOfSamples = data - (this.requestLists.length);
    // if (numberOfSamples < 0) {
    //   const lists = this.requestLists.filter(e => e.objectState === 1);
    //   for (let i = 0; i < Math.abs(numberOfSamples); i ++) {
    //     this.requestLists.splice(lists[i], 1);
    //   }
    // }

    for (let i = 0; i < numberOfSamples; i++) {
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
    }

    return;

    data = data.trimEnd();
    console.log('event >> ', data);

    if (!data) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Barcode ไม่สามารถเป็นค่าว่าง',
      });
    }

    const inlists = this.requestLists.find((x) => x.firstName == data);
    if (inlists) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Barcode เป็นค่าซ้ำ',
      });
      return;
    }

    const item = new RequestsModel();
    item.firstName = data;
    // item.receiveDate = this.batchHdForm.get('batchDate').value;
    this.requestLists.push(item);
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

          sentToSiteID: value.selectedItem['ParentSiteID'],
          sentToSiteName: value.selectedItem['ParentSiteName'],
        });
        this.defaultValue.siteID = value.selectedItem['SiteID'];
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

  onSampleTypeChange(event) {
    this.sentSampleForm.patchValue({
      sampleTypeID: this.selectedSampleType.sampleTypeID,
      sampleTypeName: this.selectedSampleType.sampleTypeName,
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
        // console.log('selected value >> ', value.selectedItem['SampleTypeName']);
        this.sentSampleForm.patchValue({
          sampleTypeID: value.selectedItem['SampleTypeID'],
          // sampleTypeCode: value.selectedItem['SampleTypeCode'],
          sampleTypeName: value.selectedItem['SampleTypeName'],
        });
      },
      (err: any) => {
        console.log(err);
        this.handleError(err);
      }
    );
  }

  getMSLabProfile(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabprofile/getByCondition', item).pipe(retry(1));
  }

  getMSLabSampleType(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
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

  onProfileBlur = (ev: any) => {
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
          // console.log('profiles >> ', profiles);
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

}

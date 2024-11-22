import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Data, Router, ActivatedRoute } from '@angular/router';
import { ToastrNotificationService, AuthenticationService } from '@app/services';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { LISSentSampleHDModel, LISSentSampleDTModel, RequestsModel, MSSiteModel, MSLabSampleTypeModel } from '@app/models';
import { RequestsDTO, SentSampleDTO } from '@app/models/data-transfer-object';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { Guid } from 'guid-typescript';
import { DatePipe, Location } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { UtilitiesService } from '@app/services/utilities.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { MssitePickerComponent } from '@app/pickers/mssite-picker/mssite-picker.component';
import { EmployeePickerComponent } from '@app/pickers/employee-picker/employee-picker.component';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import Swal from 'sweetalert2';
import { element } from 'protractor';
import { MslabProfilePickerComponent, SampleTypePickerComponent, SentSamplehdPickerComponent } from '@app/pickers';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
import { retry } from 'rxjs/operators';
import { RepositoryService } from '@app/shared/repository.service';
import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
defineLocale('th', thBeLocale);
@Component({
  selector: 'app-receive-sample-create',
  templateUrl: './receive-sample-create.component.html',
  styleUrls: ['./receive-sample-create.component.scss']
})

export class ReceiveSampleCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
  inputValue: string = 'Received';

  CheckNewStatus: string;

  public permissions: Data;
  public sentSampleForm: FormGroup;
  public requestForms: FormArray;
  public requestLists: Array<RequestsModel>;
  public requestToDelete: Array<RequestsModel>;
  public sendSampleLists: Array<LISSentSampleHDModel>;
  private sentSampleDto: SentSampleDTO;
  private requestsDTO: RequestsDTO;
  private isUpdated: boolean = false;
  private userName: string = '';
  public isDeleted: boolean = false;
  public isNew: boolean = true;
  sub: Subscription;
  public barCode: string;
  referenceName: string = 'receive';

  locale = 'th';
  // locales = listLocales();
  inputCompleted: boolean = false;
  CheckInsert: string;
  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private notiService: ToastrNotificationService,
    private sentSampleService: SentSampleService,
    private requestsRepoServie: RequestsRepoService,
    private utilService: UtilitiesService,
    private authService: AuthenticationService,
    private localeService: BsLocaleService,
    private repoService: RepositoryService,
    private requestsRepoService: RequestsRepoService,
  ) {
    super();

    this.authService.currentUser.subscribe((user: any) => {
      this.userName = user.data.SecurityUsers.UserName;
    });

    this.localeService.use(this.locale);
  }

  printPage() {
    window.print();
  }

  ngAfterViewInit(): void {
    const cb = this.sentSampleForm.get('isDeleted');
    const ob: Observable<boolean> = cb.valueChanges;
    ob.subscribe(v => {
      this.isDeleted = v;
    });

    if (this.sentSampleForm.get('isNew').value) {
      this.sentSampleForm.patchValue({
        userName: this.userName,
      });
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdated && this.sentSampleForm.dirty) {
      return this.confirmDlgService.open();
    }
    return of(true);
  }

  ngOnInit(): void {
    // console.log('router >> ', this.route.snapshot.data['permissions']);
    // console.log('config router >> ', this.router.config);
    // this.permissions = this.route.snapshot.data['permissions'];

    //testtttttttttttttttttt
    //this.sentSampleForm.get('documentStatus')?.patchValue('Received');





    this.sub = this.route.data.subscribe(v => console.log(v));

    this.createInitialForm();
    this.doLoadData();
   

    this.isDeleted = this.sentSampleForm.get('isDeleted').value == 1 ? true : false;

    //this.sentSampleForm.get('requestStatus').setValue('Received');

  }

  createInitialForm() {
    // const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'en-US');
    this.sentSampleForm = this.fb.group(new LISSentSampleHDModel());
    this.sentSampleForm.addControl('requestsForm', this.fb.array([]));
    this.requestForms = this.sentSampleForm.controls.requestsForm as FormArray;
    this.requestLists = new Array<RequestsModel>();
    this.requestToDelete = new Array<RequestsModel>();

    this.sentSampleForm.patchValue({
      receiveFlag: 'NotInvoice'
    });

    this.isNew = true;
  }

  public doLoadData = async () => {
    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;

    if (objData != null) {
      //console.log('testtttttttttttttt');
      const item = {
        sentSampleID: objData.sentSampleID,
        sqlSelect: `it.*, MSSite.SiteName As SiteName, emp.FirstName + ' ' + emp.LastName as EmployeeName, sent.SiteName as SentToSiteName ` +
          `, type.SampleTypeName, profile.ProfileName `,
        sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
          `Left Outer Join MSSite as sent On (sent.SiteID = it.SentToSiteID) ` +
          `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) ` +
          `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID) ` +
          `Left Outer Join MSLabProfile as profile On (profile.ProfileID = it.ProfileID) `,
        sqlWhere: `(it.SentSampleID = '${objData?.sentSampleID}')`,
        pageIndex: -1
      };

      this.sentSampleService.getLISSentSampleHDByCondition(item)
        .subscribe((res) => {
          const model: LISSentSampleHDModel = Object.assign({}, res.data.LISSentSampleHDs[0]);
          this.patchSampleFormValues(model);

          const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
          const dueDate = this.sentSampleForm.get('dueDate').value;
          const receiveDate = this.sentSampleForm.get('receiveDate').value;
          const receiveFlag = this.sentSampleForm.get('receiveFlag').value;

          // console.log('xxx => ', receiveDate);

          this.sentSampleForm.patchValue({
            spParmLastSentSampleID: this.sentSampleForm.get('sentSampleID').value,
            sentSampleDate: new Date(sentSampleDate), // this.datePipe.transform(batchDate, 'yyyy-MM-dd', 'en-US'),
            dueDate: new Date(dueDate),
            receiveDate: receiveDate ? new Date(receiveDate) : new Date(),    // กรณียังไม่ได้รับ จะเป็นค่า null ให้เซ็ตเป็นวันที่ปัจจุบัน
            receiveFlag: receiveFlag == null ? 'NotInvoice' : receiveFlag,
            // userName: this.userName, // ยึดตามฐานข้อมูล
            isNew: false
          });

          this.isDeleted = this.sentSampleForm.get('isDeleted').value == 1 ? true : false;
          this.isNew = false;

        }, (err) => {
          return this.handleError(err);
        });

      this.sentSampleService.getLISSentSampleDTById({ SQLWhere: `it.SentSampleID = '${objData.sentSampleID}'` })
        .subscribe((res) => {
          res = this.utilService.camelizeKeys(res);
          res.data.LISSentSampleDTs?.forEach((dt: any) => {
            dt.spParmLastSentSampleID = dt.sentSampleID;
          });
        }, (err) => {
          return this.handleError(err);
        });

      this.requestsRepoServie
        .getRequestsById({
          sqlSelect: `it.*, type.SampleTypeName`,
          sqlFrom: `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID)`,
          sqlWhere: `it.SentSampleID = '${objData.sentSampleID}'`,
          sqlOrder: `it.ExternalNo, it.LabNumber`
        })
        .subscribe(
          (res) => {
            // const model: Array<RequestsModel> = Object.assign({}, res.data.Requests);
            res = this.utilService.camelizeKeys(res);
            // res.data.requests.forEach((req) => {
            //   req.spParmLastRequestID = req.requestID;
            // });



            this.requestLists = res.data.requests;

            // this.requestLists.forEach(element => {
            //   element.spParmLastRequestID = element.requestID;
            // });
          },
          (err) => {
            this.handleError(err);
          }
        );
    }

    this.doCheckRequired();
  }

  public onNewClick = () => {
    if (!this.isUpdated && this.sentSampleForm.dirty) {
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
    this.createInitialForm();
  }

  public goBack = () => {
    sessionStorage.removeItem('LISSentSampleHDDataStorage');

    if (window.history.length > 1) {
      this.location.back();
      // this.router.navigate(['/receive-sample/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSentSample = () => {
    this.notiService.showSuccess('Sent Sample');
  }

  public doSave = () => {
    //this.executeSaveData2();
    /*   this.sentSampleForm.get('modelCheckInsert')?.patchValue('Modere3');*/


  
    this.sentSampleForm.get('newStatus')?.patchValue('Received');
    this.requestForms.get('newStatus')?.patchValue('Received');

 
    this.executeSaveData();
    
  }


  dosaveStatsu = () => {
    //UpdateStatus
    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;
    this.requestsRepoServie
      .getRequestsById({
        sqlSelect: `it.*, type.SampleTypeName`,
        sqlFrom: `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID)`,
        sqlWhere: `it.SentSampleID = '${objData.sentSampleID}'`,
        sqlOrder: `it.ExternalNo, it.LabNumber`
      })
      .subscribe(
        (res) => {
          res = this.utilService.camelizeKeys(res);
          this.requestLists = res.data.requests;
          //console.log('this.requestLists => ', this.requestLists);

          for (let el of this.requestLists) {
            //console.log('el reqesut=> ', el.requestID);
            const query = `
                           update  Requests
                           set RequestStatus = 'Received'
                           where RequestID =  '${el.requestID}'
                         `;
            const response = this.sentSampleService.query({ queryString: query });
          }
        },
        (err) => {
          this.handleError(err);
        }
      );


  }

  public doDelete = () => {
    this.notiService.showError('Delete...');
  }

  onPrepareSave(): boolean {
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
      const receiveDate = this.sentSampleForm.get('receiveDate').value;

      if (this.utilService.checkDateIsGreaterThanToday(new Date(receiveDate))) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '"วันที่รับตัวอย่าง" ต้องไม่มากกว่าวันที่ปัจจุบัน',
        });
        return false;
      }

      this.sentSampleForm.patchValue({
        sentSampleID: guId.toString(),
        sentSampleDate: this.datePipe.transform(sentSampleDate, 'yyyy-MM-dd', 'en-US'),
        receiveDate: this.datePipe.transform(new Date(receiveDate), 'yyyy-MM-dd', 'en-US'),
        isDeleted: this.isDeleted ? 1 : 0,
      });

      this.sentSampleDto.LISSentSampleHDs = [Object.assign({}, this.sentSampleForm.value)];
      this.sentSampleDto.Requests = this.requestLists; // [Object.assign({}, this.requestsForm.value)];

      this.sentSampleDto.LISSentSampleDTs.forEach((dt) => {
        dt.sentSampleID = guId.toString();
        if (!this.sentSampleForm.get('isNew').value) {
          dt.spParmLastSentSampleID = dt.sentSampleID;
        }
      });

      this.sentSampleDto.Requests.forEach((request) => {
        request.shiptoNo = this.sentSampleForm.get('sentSampleNo').value; // เลขที่ใบนำส่ง
        request.shiptoDate = this.sentSampleForm.get('sentSampleDate').value;
        request.receiveNo = this.sentSampleForm.get('receiveNo').value; // เลขที่ทะเบียนรับ
        request.receiveDate = this.sentSampleForm.get('receiveDate').value;
        request.sampleTypeID = this.sentSampleForm.get('sampleTypeID').value;
        request.profileID = this.sentSampleForm.get('profileID').value;
        request.dueDate = this.sentSampleForm.get('dueDate').value;
        request.sentSampleID = guId.toString();
      });

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
      console.log('error >> ', error);
      this.handleError(error);
    }
  }

  private executeSaveData = () => {
    if (!this.onPrepareSave()) {
      return;
    }


    //const item = new RequestsModel();
    //item.modelCheckInsert = "Modere3";
    //this.sentSampleDto.Requests.push(item);
    //console.log('this.sentSampleDto', this.sentSampleDto);

    /////Testtttttttttttttttt
    //this.sentSampleDto.get('requestStatus')?.patchValue('Received');

    return this.sentSampleService.save(this.sentSampleDto)
      .subscribe((res) => {
        this.isUpdated = true;
        this.spinner.hide();
        this.notiService.showSuccess('Save Successfully.');

        this.dosaveStatsu();


        this.goBack();
      }, (err) => {
        this.spinner.hide();
        console.log('executeSaveData error >> ', err);
        return this.handleError(err);
      });




    if (this.sentSampleForm.get('isNew').value == true) {
      this.sentSampleService.createLISSentSampleHD(this.sentSampleDto)
        .subscribe((res) => {
          this.isUpdated = true;
          this.spinner.hide();
          this.notiService.showSuccess('Create Successfully.');
          this.goBack();
        }, (err) => {
          this.spinner.hide();
          console.log('executeSaveData error >> ', err);
          return this.handleError(err);
        });
    } else {
      this.sentSampleService.updateLISSentSampleHD(this.sentSampleDto)
        .subscribe((res) => {
          this.isUpdated = true;
          this.spinner.hide();
          this.notiService.showSuccess('Update Successfully.');
          this.goBack();
        }, (err) => {
          this.spinner.hide();
          console.log('executeUpdateData error >> ', err);
          return this.handleError(err);
        });
    }
  }

  doGetRunning = () => {
    this.getRunPrefix().subscribe(site => {
      let run: MSSiteModel;
      if (site.data.MSSites.length == 0) {
        run = new MSSiteModel();
      } else {
        run = site.data.MSSites[0] as MSSiteModel;
      }

      run = this.utilService.camelizeKeys(run);
      const runPrefix = run.runReceivePrefix;
      // console.log('runPrefix >> ', runPrefix);

      this.repoService.getData(`api/general/getLastRunning?tableName=LISSentSampleHD&columnName=ReceiveNo&runPrefix=${runPrefix}`).pipe(retry(1))
        .subscribe((runno: any) => {
          console.log('run no >> ', runno.data.RunningNo);
          if (runno.data?.RunningNo) {
            this.sentSampleForm.patchValue({
              receiveNo: runno.data?.RunningNo
            });
          }
        });
    });
  }

  getRunPrefix(): Observable<any> {
    const siteId = this.sentSampleForm.get('siteID').value;
    const item = {
      sqlWhere: `it.SiteID = '${siteId}'`
    };
    return this.repoService.getDataParm('api/MSSite/getByCondition', item).pipe(retry(1));
  }

  selectedTabChange(tabChangeEvent: MatTabChangeEvent) {
    console.log(tabChangeEvent);
    const selectedTab = tabChangeEvent.tab;
    console.log(selectedTab);
  }

  updateItemChanged(event: any) {
    // console.log('emit data >> ', event);
    // this.requestLists = event;
  }

  onNumberOfSampleChanged(event: any) {
    // console.log('sample change >> ', event.target.value);
    this.applySampleRequest(event.target.value);
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
      model.objectState = 1;
      this.requestLists.push(model);
      // console.log('new request >> ', model);
    }

    // console.log('all requests >> ', this.requestLists);

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

  radioChange(event: any) {
    this.sentSampleForm.patchValue({
      receiveFlag: event.value,
    });
  }

  applyBarcode(data: any) {
    data = data.trimEnd();

    if (!data) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Barcode ไม่สามารถเป็นค่าว่าง',
        // footer: '<a href>Why do I have this issue?</a>'
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
    item.receiveDate = this.sentSampleForm.get('batchDate').value;
    this.requestLists.push(item);
  }

  openMSSitePicker() {
    const initialState = {
      list: [
        this.sentSampleForm.get('sentSampleID').value
      ],
      whereClause: `SiteFlag != 'P'`,
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
        });
      },
        (err: any) => {
          console.log(err);
        });

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

    console.log('input complete require :: ', this.inputCompleted);
  }

  openSiteParentPicker() {
    const initialState = {
      list: [
        this.sentSampleForm.get('sentSampleID').value
      ],
      whereClause: `SiteFlag = 'P'`,
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
          employeeName: value.selectedItem['FirstName'] + ' ' + value.selectedItem['LastName'],
        });
      },
        (err: any) => {
          console.log(err);
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
        if (!value || value.isCancel) { return; }
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

  openSentSamplePicker() {
    const initialState = {
      list: [this.sentSampleForm.get('sentSampleID').value],
      title: 'นำส่งถึง',
      class: 'my-class',
    };

    this.bsModalRef = this.bsModalService.show(SentSamplehdPickerComponent, {
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
          sentSampleID: value.selectedItem['SentSampleID'],
          sentSampleNo: value.selectedItem['SentSampleNo'],
        });

        const model: LISSentSampleHDModel = {} as LISSentSampleHDModel;
        model.sentSampleID = this.sentSampleForm.get('sentSampleID').value;
        sessionStorage.setItem('LISSentSampleHDDataStorage', JSON.stringify(model));
        this.doLoadData();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  openLabProfilePicker() {
    const initialState = {
      // list: [this.sentSampleForm.get('profileID').value],
      title: 'ประเภทการทดสอบ',
      class: 'my-class',
    };

    this.bsModalRef = this.bsModalService.show(MslabProfilePickerComponent, {
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
        // console.log('selected value >> ', value.selectedItem['ProfileName']);
        this.sentSampleForm.patchValue({
          profileID: value.selectedItem['ProfileID'],
          profileName: value.selectedItem['ProfileName'],
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
      }
    );
  }

  getMSLabSampleType(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
  }

  onPrintBarcodeClick = async () => {
    // if (this.selectedRowIndex < 0) {
    //   return this.notiService.showError('กรุณาเลือกรายการคนไข้');
    // }

    // const config = this._configSvc.getConfig();
    // console.log('config: ', config);
    // const siteCode = config.SITE_CODE;

    this.goToReport('LabNoBarcodeReport');
  }

  goToReport(reportName: string) {
    const encryptedData = this.encryptUsingAES256({
      reportName: reportName,
      parameters: {
        reportName: reportName,
        sqlWhere: `it.sentsampleid='${this.sentSampleForm.get('sentSampleID').value}'`,
      }
    });

    const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
      {
        queryParams:
        {
          data: encryptedData,
        }
      });



    // const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
    //   {
    //     queryParams:
    //     {
    //       report: reportName,
    //       sqlWhere: `it.sentsampleid='${this.sentSampleForm.get('sentSampleID').value}'`
    //     }
    //   });

    const baseUrl = window.location.href.replace(this.router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }
  //private executeSaveData2 = async () => {
 
  //  //this.spinner.show();
  //  //this.sentSampleForm.get('modelCheckInsert')?.patchValue('Modereq3');
  
  //  return this.requestsRepoService.saveRequests(this.requestsDTO)
  //    // tslint:disable-next-line: deprecation
  //    .subscribe((res) => {
  //      //this.isUpdated = true;
  //      //this.spinner.hide();
  //      // setTimeout(() => this.toastrNotiService.clear(), 10000);
  //      //this.notiService.showSuccess('Save Successfully.');
  //      //this.goBack();
  //    }, (err) => {
  //      this.spinner.hide();
  //      console.log('executeSaveData error >> ', err);
  //      return this.handleError(err);
  //    });
  //}

}

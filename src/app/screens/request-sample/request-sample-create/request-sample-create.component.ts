import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrNotificationService, UtilitiesService } from '@app/services';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MSLabProfileModel, MSLabSampleTypeModel, MSLISPatientModel, MSLISPatientMoreModel, MSSiteModel, RequestsModel } from '@app/models';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PatientDTO, RequestsDTO } from '@app/models/data-transfer-object';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { SampleTypePickerComponent } from '@app/pickers/sample-type-picker/sample-type-picker.component';

import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { MslabProfilePickerComponent, SentSamplehdPickerComponent } from '@app/pickers';
import { Guid } from 'guid-typescript';
import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddnewRaceComponent } from '../addnew-race/addnew-race.component';
import { RaceModel } from '@app/models/race.model';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { MssitePickerComponent } from '@app/pickers/mssite-picker/mssite-picker.component';
import Swal from 'sweetalert2';
import { EmGAReferenceRangeModel } from '@app/models/emgareferencerange.model';
import { RepositoryService } from '@app/shared/repository.service';
import { retry } from 'rxjs/operators';
defineLocale('th', thBeLocale);

@Component({
  selector: 'app-request-sample-create',
  templateUrl: './request-sample-create.component.html',
  styleUrls: ['./request-sample-create.component.scss']
})

export class RequestSampleCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
  public patientForm: FormGroup; // ข้อมูลคนไข้
  public requestsForm: FormGroup;
  public patientMoreForm: FormGroup;
  public patientMoreLists: Array<RequestsPatientMoreModel>;
  private patientDTO: PatientDTO;
  private requestsDTO: RequestsDTO;

  public numberOfBabiesDisable = true;

  bsConfig: Partial<BsDatepickerConfig>;
  myDateValue: Date;
  private isUpdated: boolean = false;
  public age: number;
  public races: Array<RaceModel>;
  public gARanges: Array<EmGAReferenceRangeModel>;
  toastGaRef: any;

  fromOrigin: string = '';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: ToastrNotificationService,
    private requestsRepoService: RequestsRepoService,
    private localeService: BsLocaleService,
    private modalService: BsModalService,
    private utilService: UtilitiesService,
    private repoService: RepositoryService
  ) {
    super();

    this.fromOrigin = this.route.snapshot.paramMap.get('fromOrigin');
    console.log('fromOrigin => ', this.fromOrigin);

    this.localeService.use('th');
  }

  ngAfterViewInit(): void {
    this.onPregnancyRadioChange(this.requestsForm.controls['pregnantFlag'].value);
    this.onPregnantTypeRadioChange(this.requestsForm.controls['pregnantType'].value);
  }

  ngOnInit(): void {

    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.fromOrigin = params.get('fromOrigin');
        console.log('xxx fromOrigin => ', this.fromOrigin);
      });

    this.route.queryParamMap
      .subscribe((params: ParamMap) => {
        const parm = params.get('id');
        console.log('query param => ', parm);
      });


    this.myDateValue = new Date();
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY'
    });

    this.createInitialForm();
    this.doLoadData();

    // tslint:disable-next-line: deprecation
    this.patientForm.valueChanges.subscribe(val => {
      // console.log(val);
    });

    this.doLoadGARange();
  }

  doLoadRaces = () => {
    this.requestsRepoService.getRaceByCondition({})
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.Races);
        this.races = data;
      }, (err) => {
        this.handleError(err);
      });
  }

  onAddNewRace = () => {
    const initialState = {
      list: [
        { tag: 'Count', value: this.races.length }
      ],
      title: `เพิ่มข้อมูลเชื้อชาติ`
    };
    this.bsModalRef = this.modalService.show(AddnewRaceComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res) => {
      // console.log('races emit : ', res);
      const data = this.utilService.camelizeKeys(res.data.Races);
      // const race = new RaceModel();
      const race = Object.assign({}, data[0]) as RaceModel;
      // race.raceName = res.data.raceName;
      this.races.push(race);
      this.requestsForm.get('race').patchValue(race.raceCode);
      this.requestsForm.get('raceLifeCycleCode').patchValue(race.raceLifeCycleCode);
    });
  }

  onEditRace = () => {
    const raceCode = this.requestsForm.get('race').value;
    const race = this.races.find(item => item.raceCode == raceCode);

    const initialState = {
      list: [
        { tag: 'Count', value: this.races.length }
      ],
      title: `แก้ไขข้อมูลเชื้อชาติ`,
      race
    };
    this.bsModalRef = this.modalService.show(AddnewRaceComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: any) => {
      // console.log('races emit : ', res);
      const data = this.utilService.camelizeKeys(res.data.Races);
      const ra = Object.assign({}, data[0]) as RaceModel;
      // this.races.push(race);
      this.requestsForm.get('race').patchValue(ra.raceCode);
      this.requestsForm.get('raceLifeCycleCode').patchValue(ra.raceLifeCycleCode);
    });
  }

  onRemoveRace = () => {
    const raceCode = this.requestsForm.get('race').value;
    const race = this.races.find(item => item.raceCode == raceCode);

    // console.log('find race : ', race);
    if (!race) {
      return Swal.fire({ title: ``, text: `กรุณาเลือกเชื้อชาติ`, icon: 'warning' });
      // return this.notiService.showWarning('กรุณาเลือกข้อมูล');
    }

    const raceItems = [Object.assign({}, race)];
    Swal.fire({
      title: 'Are you sure?',
      text: `คุณต้องการลบเชื้อชาติ "${race.raceName}" ใช่หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.repoService.delete('api/race/delete', raceItems)
          // tslint:disable-next-line: deprecation
          .subscribe(res => {
            Swal.fire(
              'Deleted!',
              'ลบข้อมูลเชื้อชาติสำเร็จ',
              'success'
            ).then(() => {
              this.doLoadRaces();
            });
          });
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    setTimeout(() => this.toastrNotiService.clear(), 1000);
    if (!this.isUpdated && this.requestsForm.dirty) {
      return this.confirmDlgService.open();
    }
    return of(true);
  }

  public onNewClick = () => {
    if (!this.isUpdated && this.requestsForm.dirty) {
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
    sessionStorage.removeItem('RequestsSampleDataStorage');
    this.toastrNotiService.clear();
    this.createInitialForm();
  }

  get moreForms(): FormArray {
    return this.requestsForm.get('patientMoreForms') as FormArray;
  }

  patientMoreF(): FormArray {
    return this.requestsForm.get('patientMoreForms') as FormArray;
  }

  getMSLabProfile(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabprofile/getByCondition', item).pipe(retry(1));
  }

  getMSLabSampleType(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
  }

  getMSSite(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mssite/getByCondition', item).pipe(retry(1));
  }

  doSetDefault = async () => {
    let profile = {
      sqlSelect: ``,
      sqlWhere: `it.IsDefault = 1`
    };

    const labProfile = await this.getMSLabProfile(profile).toPromise();
    const profiles = this.utilService.camelizeKeys(labProfile?.data?.MSLabProfiles);
    if (profiles.length > 0) {
      this.requestsForm.get('profileID')?.patchValue(profiles[0].profileID);
      this.requestsForm.get('profileName')?.patchValue(profiles[0].profileName);
    }

    // this.getMSLabProfile(profile)
    //   .subscribe((response) => {
    //     response = this.utilService.camelizeKeys(response);
    //     const profiles: MSLabProfileModel[] = response.data.mSLabProfiles;
    //     if (profiles.length > 0) {
    //       this.requestsForm.get('profileID')?.patchValue(profiles[0].profileID);
    //       this.requestsForm.get('profileName')?.patchValue(profiles[0].profileName);
    //     }
    //   }, (err) => {
    //     console.log('set default error >> ', err);
    //   });

    profile = {
      sqlSelect: ``,
      sqlWhere: `it.ProfileID = '${this.requestsForm.get('profileID').value}' And it.IsDefault = 1 `
    };

    this.getMSLabSampleType(profile)
      .subscribe((response) => {
        response = this.utilService.camelizeKeys(response);
        const sampleTypes: MSLabSampleTypeModel[] = response.data.mSLabSampleTypes;
        if (sampleTypes.length > 0) {
          this.requestsForm.get('sampleTypeID')?.patchValue(sampleTypes[0].sampleTypeID);
          this.requestsForm.get('sampleTypeName')?.patchValue(sampleTypes[0].sampleTypeName);
        }
      }, (err) => {
        console.log('set default error >> ', err);
      });

  }

  createInitialForm() {
    const objModel: MSLISPatientModel = {} as MSLISPatientModel;

    this.patientForm = this.fb.group(new MSLISPatientModel());
    this.patientForm.addControl('requestsForm', this.fb.array([]));
    this.patientMoreForm = this.fb.group(new RequestsPatientMoreModel());

    this.requestsForm = this.fb.group(new RequestsModel());
    const isAvailable = this.requestsForm.contains('patientMoreForms');
    if (isAvailable) {
      this.requestsForm.removeControl('patientMoreForms');
    }

    this.requestsForm.addControl('patientMoreForms', this.fb.array([]));
    this.requestsForm.addControl('resultsForms', this.fb.array([]));
    this.requestsForm.patchValue({
      pregnantFlag: '1'
    });

    // this.patienLists = new Array<MSLISPatientModel>();
    this.patientMoreLists = new Array<RequestsPatientMoreModel>();

    this.patientDTO = {
      MSLISPatients: [new MSLISPatientModel()],
      PatientMores: []
    };

    this.requestsDTO = {
      Requests: new Array<RequestsModel>(),
      RequestsPatientMores: new Array<RequestsPatientMoreModel>()
    };
    // this.addItem();
    this.races = new Array<RaceModel>();
    this.isUpdated = true;
    this.doLoadPatientMore();
    this.doSetDefault();
  }

  doLoadPatientMore = () => {
    const requestId = this.requestsForm.get('requestID').value;
    // console.log('requestId >> ', requestId);
    const patientItem = {
      requestID: ``,
      sqlSelect: `more.PatientMoreCode, more.PatientMoreName as PatientMoreText, more.PatientMoreID as LabPatientMoreID, it.* `,
      sqlFrom: `RIGHT OUTER JOIN MSLabPatientMore as more on (it.PatientMoreID = more.PatientMoreID and (it.RequestID = '${requestId}') ) `,
      pageIndex: -1
    };

    this.requestsRepoService.getPatientMoreByCondition(patientItem)
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

        this.calculateGA();
      });
  }

  addDdItem() {
    const v = document.getElementById('newItem');
    // console.log('ddd >> ', v);
  }

  public doLoadData = async () => {
    this.requestsRepoService.getRaceByCondition({})
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.Races);
        this.races = data;
      }, (err) => {
        this.handleError(err);
      });


    const storageData = sessionStorage.getItem('RequestsSampleDataStorage');
    const objData = JSON.parse(storageData) as RequestsModel;

    if (objData == null) {
      return;
    }

    const item = {
      requestID: objData.requestID,
      sqlSelect: `it.*, MSSite.SiteName As SiteName, sampleType.SampleTypeName, profile.ProfileName` +
        `, sent.SentSampleNo, sent.NumberOFSamples`,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSLabSampleType as sampleType On (sampleType.SampleTypeID = it.SampleTypeID) ` +
        `Left Outer Join MSLabProfile as profile On (profile.ProfileID = it.ProfileID) ` +
        `Left Outer Join LISSentSampleHD as sent On (sent.SentSampleID = it.SentSampleID) `,
      sqlWhere: `(it.RequestID = '${objData?.requestID}')`,
      pageIndex: -1
    };

    this.requestsRepoService.getRequestByCondition(item)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        const model: RequestsModel = Object.assign({}, res.data.Requests[0]);
        this.patchRequestsValues(model);

        const birthday = this.requestsForm.get('birthday').value;
        const receiveDate = this.requestsForm.get('receiveDate').value;
        const shiptoDate = this.requestsForm.get('shiptoDate').value;
        const ultrasoundDate = this.requestsForm.get('ultrasoundDate').value;
        const lMPDate = this.requestsForm.get('lMPDate').value;
        const sampleDate = this.requestsForm.get('sampleDate').value;
        const salumIntersectionDate = this.requestsForm.get('salumIntersectionDate').value;
        const savetoNHSODate = this.requestsForm.get('savetoNHSODate').value;
        const analystDate = this.requestsForm.get('analystDate').value;
        const bloodPressureDate = this.requestsForm.get('bloodPressureDate').value;
        const dueDate = this.requestsForm.get('dueDate').value;
        const endDate = this.requestsForm.get('endDate').value;

        const ovumCollectDate = this.requestsForm.get('ovumCollectDate').value;
        const embryoTransferDate = this.requestsForm.get('embryoTransferDate').value;
        const donorBirthdate = this.requestsForm.get('donorBirthdate').value;

        let pregnantFlag = this.requestsForm.get('pregnantFlag').value;
        if (!pregnantFlag) { pregnantFlag = '1'; }
        this.requestsForm.patchValue({
          spParmLastRequestID: this.requestsForm.get('requestID').value,

          birthday: birthday ? new Date(birthday) : null,
          receiveDate: receiveDate ? new Date(receiveDate) : null,
          shiptoDate: shiptoDate ? new Date(shiptoDate) : null,
          ultrasoundDate: ultrasoundDate ? new Date(ultrasoundDate) : null,
          lMPDate: lMPDate ? new Date(lMPDate) : null,
          sampleDate: sampleDate ? new Date(sampleDate) : null,
          salumIntersectionDate: salumIntersectionDate ? new Date(salumIntersectionDate) : null,
          savetoNHSODate: savetoNHSODate ? new Date(savetoNHSODate) : null,
          analystDate: analystDate ? new Date(analystDate) : null,
          bloodPressureDate: bloodPressureDate ? new Date(bloodPressureDate) : null,
          dueDate: dueDate ? new Date(dueDate) : null,
          endDate: endDate ? new Date(endDate) : null,

          ovumCollectDate: ovumCollectDate ? new Date(ovumCollectDate) : null,
          embryoTransferDate: embryoTransferDate ? new Date(embryoTransferDate) : null,
          donorBirthdate: donorBirthdate ? new Date(donorBirthdate) : null,

          isNew: false,
          pregnantFlag
        });

        this.age = this.calculateAge(new Date(birthday));
        this.doLoadPatientMore();

      }, (err) => {
        return this.handleError(err);
      });

    const patientItem = {
      requestID: objData.requestID,
      sqlSelect: `more.PatientMoreCode, more.PatientMoreName as PatientMoreText, more.PatientMoreID as LabPatientMoreID, it.* `,
      sqlFrom: `RIGHT OUTER JOIN MSLabPatientMore as more on (it.PatientMoreID = more.PatientMoreID and (it.RequestID = '${objData?.requestID}') ) `,
      // sqlWhere: `(it.RequestID = '${objData?.requestID}')`,
      // sqlOrder: `more.ListNo Asc`,
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

  public calculateGA = () => {
    const toastrConfig = {
      positionClass: 'toast-top-center',
      disableTimeOut: true,
      preventDuplicates: true,
      closeButton: true,
      timeOut: 0
    };

    const one_day = 1000 * 60 * 60 * 24;
    const ultrasoundDate = this.requestsForm.get('ultrasoundDate').value;
    const sampleDate = this.requestsForm.get('sampleDate').value;

    const diff = sampleDate?.valueOf() - ultrasoundDate?.valueOf();
    const diffDays = Math.ceil(diff / one_day);

    const bpd_mm = this.requestsForm.get('ultrasound_BPD').value;
    const ga = this.gARanges?.find(item => (bpd_mm >= item.start_mm) && (bpd_mm <= item.end_mm));
    const totalDays = ga?.totalDays;

    const gaDays = diffDays + totalDays;
    if (!(gaDays >= 98 && gaDays <= 146)) {
      setTimeout(() =>
        this.toastGaRef =
        this.toastrNotiService.error('อายุครรภ์ไม่สัมพันธ์ กับ BPD จะมีผลต่อการตรวจวิเคราะห์ กรุณาตรวจสอบให้ถูกต้อง', '', toastrConfig)
      );
    } else {
      this.toastrNotiService.clear(this.toastGaRef?.toastId);
    }
  }

  public calculateAge = (birthday: Date) => {
    if (birthday) {
      const timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
      // so 26 years and 140 days would be considered as 26, not 27.
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      this.age = 0;
    }
    return this.age;
  }

  onBirthDayChange(event: any) {
    this.calculateAge(event);
  }

  onRaceChange(event: any) {
    const race = this.races.find(item => item.raceCode == event.target.value);
    if (race) {
      this.requestsForm.get('raceLifeCycleCode').patchValue(race.raceLifeCycleCode);
    }

  }

  get formPatientControls() { return this.patientForm.controls; }

  public goBack = () => {
    sessionStorage.removeItem('RequestsSampleDataStorage');
    setTimeout(() => this.toastrNotiService.clear(), 2000);

    if (window.history.length > 1) {
      this.location.back();
      // this.router.navigate(['/request-sample/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  radioPaymentFlagChange = (ev: any) => {
    if (ev.value != 'CashPayment') {
      this.requestsForm.get('paymentNo').patchValue('');
    }
  }

  babiesToggle() {
    // this.numberOfBabiesDisable = this.patientForm.get('').value === 3;
  }

  onPregnancyRadioChange(event) {
    const disabled = (event == 'Other');
    // if(disabled){
    //   this.requestsForm.controls['numberofOther'].enable();
    // } else {
    //   this.requestsForm.controls['numberofOther'].disable();
    // }
  }

  onPregnantTypeRadioChange(event) {
    const disabled = (event == 'Specify');
    // if(disabled){
    //   this.requestsForm.controls['pregnantTypeOther'].enable();
    // } else {
    //   this.requestsForm.controls['pregnantTypeOther'].disable();
    // }
  }

  public doSave = () => {
    this.executeSaveData();
  }

  onPrepareSave = async (): Promise<boolean> => {
    // if (this.isUpdated && !this.requestsForm.dirty) {
    //   return false;
    // }

    try {
      const labNo = this.requestsForm.get('labNumber').value;
      const lastNo = this.requestsForm.get('spParmLastLabNumber').value;
      const isDup = await this.requestsRepoService.checkDuplicateLabNo(labNo, lastNo);
      if (isDup?.isDuplicate) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Lab Number เป็นค่่าซ้ำ',
        });
        return false;
      }


      this.patientDTO = {
        MSLISPatients: new Array<MSLISPatientModel>(),
        PatientMores: new Array<MSLISPatientMoreModel>()
      };

      this.patientDTO.MSLISPatients = [Object.assign({}, this.patientForm.value)];
      this.requestsDTO.Requests = [Object.assign({}, this.requestsForm.value)];
      this.requestsDTO.RequestsPatientMores = Object.assign([{}], this.moreForms.value);

      // console.log('more forms ....>>> ', this.requestsDTO.RequestsPatientMores);
      // console.log('request form value : ', this.requestsDTO.Requests);

      let guId = Guid.create();
      if (this.requestsForm.get('isNew').value) {
        //
      } else {
        guId = this.requestsForm.get('requestID').value;
      }

      const birthday = this.requestsForm.get('birthday').value;
      const receiveDate = this.requestsForm.get('receiveDate').value;
      const shiptoDate = this.requestsForm.get('shiptoDate').value;
      const ultrasoundDate = this.requestsForm.get('ultrasoundDate').value;
      const lMPDate = this.requestsForm.get('lMPDate').value;
      const sampleDate = this.requestsForm.get('sampleDate').value;
      const salumIntersectionDate = this.requestsForm.get('salumIntersectionDate').value;
      const savetoNHSODate = this.requestsForm.get('savetoNHSODate').value;
      const analystDate = this.requestsForm.get('analystDate').value;
      const bloodPressureDate = this.requestsForm.get('bloodPressureDate').value;
      const dueDate = this.requestsForm.get('dueDate').value;
      const endDate = this.requestsForm.get('endDate').value;

      const ovumCollectDate = this.requestsForm.get('ovumCollectDate').value;
      const embryoTransferDate = this.requestsForm.get('embryoTransferDate').value;
      const donorBirthdate = this.requestsForm.get('donorBirthdate').value;

      if (this.utilService.checkDateIsGreaterThanToday(new Date(shiptoDate))) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '"ลงวันทึ่" ต้องไม่มากกว่าวันที่ปัจจุบัน',
        });
        return false;
      }

      this.requestsForm.patchValue({
        requestID: guId.toString(),

        birthday: this.datePipe.transform(birthday, 'yyyy-MM-dd', 'en-US'),
        receiveDate: this.datePipe.transform(receiveDate, 'yyyy-MM-dd', 'en-US'),
        shiptoDate: this.datePipe.transform(shiptoDate, 'yyyy-MM-dd', 'en-US'),
        ultrasoundDate: this.datePipe.transform(ultrasoundDate, 'yyyy-MM-dd', 'en-US'),
        lMPDate: this.datePipe.transform(lMPDate, 'yyyy-MM-dd', 'en-US'),
        sampleDate: this.datePipe.transform(sampleDate, 'yyyy-MM-dd', 'en-US'),
        salumIntersectionDate: this.datePipe.transform(salumIntersectionDate, 'yyyy-MM-dd', 'en-US'),
        savetoNHSODate: this.datePipe.transform(savetoNHSODate, 'yyyy-MM-dd', 'en-US'),
        analystDate: this.datePipe.transform(analystDate, 'yyyy-MM-dd', 'en-US'),
        bloodPressureDate: this.datePipe.transform(bloodPressureDate, 'yyyy-MM-dd', 'en-US'),
        dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd', 'en-US'),
        endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd', 'en-US'),

        ovumCollectDate: this.datePipe.transform(ovumCollectDate, 'yyyy-MM-dd', 'en-US'),
        embryoTransferDate: this.datePipe.transform(embryoTransferDate, 'yyyy-MM-dd', 'en-US'),
        donorBirthdate: this.datePipe.transform(donorBirthdate, 'yyyy-MM-dd', 'en-US'),

        ultrasound_BPD: this.requestsForm.get('ultrasound_BPD').value ? this.requestsForm.get('ultrasound_BPD').value : null,
      });

      this.requestsDTO.Requests = [Object.assign({}, this.requestsForm.value)];
      this.requestsDTO.RequestsPatientMores.forEach((item, idx) => {
        item.requestID = this.requestsForm.get('requestID').value;
        item.listNo = idx;
        item.patientMoreID = item.labPatientMoreID;
        item.patientMoreName = item.patientMoreText;
      });

      return true;
    }
    catch (err) {
      this.handleError(err);
      return false;
    }
  }

  private executeSaveData = async () => {
    if (!(await this.onPrepareSave())) {
      return;
    }

    this.spinner.show();
    return this.requestsRepoService.saveRequests(this.requestsDTO)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        this.isUpdated = true;
        this.spinner.hide();
        // setTimeout(() => this.toastrNotiService.clear(), 10000);
        this.notiService.showSuccess('Save Successfully.');
        this.goBack();
      }, (err) => {
        this.spinner.hide();
        console.log('executeSaveData error >> ', err);
        return this.handleError(err);
      });
  }

  patchPatientValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    // console.log('data to patch value -->> ', value);
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.patientForm.controls[ngName]) {
          this.patientForm.controls[ngName].patchValue(value[name]);
        }
      });
      // console.log('after patch value >> ', this.patientForm.value);
    } catch (error) {
      console.log('error >> ', error);
      this.handleError(error);
    }
  }

  patchRequestsValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    // console.log('before to patch value -->> ', value);
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.requestsForm.controls[ngName]) {
          this.requestsForm.controls[ngName].patchValue(value[name]);
        }
      });
      // console.log('after patch value >> ', this.requestsForm.value);
    } catch (error) {
      console.log('error >> ', error);
      this.handleError(error);
    }
  }

  patchPatientMoreValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    // console.log('before to patch value -->> ', value);
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.patientMoreForm.controls[ngName]) {
          this.patientMoreForm.controls[ngName].patchValue(value[name]);
        }
      });
      // console.log('after patch value >> ', this.patientMoreForm.value);
    } catch (err) {
      console.log('error >> ', err);
      this.handleError(err);
    }
  }

  openSampleTypePicker() {
    let profileId = this.requestsForm.get('profileID').value;
    profileId = profileId ?? '@';
    const initialState = {
      sqlWhere: `it.ProfileID = '${profileId}'`, // profileId ? `it.ProfileID = '${profileId}'` : ``,
      list: [
        this.requestsForm.get('sentSampleID').value
      ],
      title: 'ชนิดตัวอย่าง',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(SampleTypePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.requestsForm.patchValue({
          sampleTypeID: value.selectedItem['SampleTypeID'],
          sampleTypeName: value.selectedItem['SampleTypeName']
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

  openMSSitePicker() {
    const initialState = {
      list: [],
      title: 'หน่วยงาน',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MssitePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.requestsForm.patchValue({
          siteID: value.selectedItem['SiteID'],
          siteName: value.selectedItem['SiteName']
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

  openProfilePicker() {
    const initialState = {
      list: [
        this.requestsForm.get('requestID').value
      ],
      title: 'Profile',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MslabProfilePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.requestsForm.patchValue({
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
              this.requestsForm.get('sampleTypeID')?.patchValue(sampleTypes[0].sampleTypeID);
              this.requestsForm.get('sampleTypeName')?.patchValue(sampleTypes[0].sampleTypeName);
            } else {
              this.requestsForm.patchValue({
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
      return this.requestsForm.patchValue({
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
            this.requestsForm.patchValue({
              profileID: '',
              profileName: '',
              sampleTypeID: '',
              sampleTypeName: ''
            });
            return this.openProfilePicker();
          }

          const profiles: MSLabProfileModel[] = res.data.mSLabProfiles as MSLabProfileModel[];
          this.requestsForm.patchValue({
            profileID: profiles[0].profileID,
            profileName: profiles[0].profileName,
          });

          const sampleFound = profiles.find((element, index) => element.sampleTypeDefault === true);
          if (sampleFound) {
            this.requestsForm.patchValue({
              sampleTypeID: sampleFound.sampleTypeID,
              sampleTypeName: sampleFound.sampleTypeName
            });
          } else {
            this.requestsForm.patchValue({
              sampleTypeID: '',
              sampleTypeName: ''
            });
          }

        }, (error) => {
          this.requestsForm.patchValue({
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
      return this.requestsForm.patchValue({
        sampleTypeID: '',
        sampleTypeName: ''
      });
    }

    let profileId = this.requestsForm.get('profileID').value;
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
          this.requestsForm.get('sampleTypeID')?.patchValue(sampleTypes[0].sampleTypeID);
          this.requestsForm.get('sampleTypeName')?.patchValue(sampleTypes[0].sampleTypeName);
        } else {
          this.requestsForm.patchValue({
            sampleTypeID: ``,
            sampleTypeName: ``
          });

          return this.openSampleTypePicker();
        }
      }, (err) => {
        console.log('set sample-type error >> ', err);
      });
  }

  onSiteBlur = (ev: any) => {
    if (!ev.target.value) {
      return this.requestsForm.patchValue({
        siteID: '',
        siteName: ''
      });
    }

    const siteItem = {
      sqlSelect: ``,
      sqlWhere: `it.SiteCode = '${ev.target.value}' Or it.SiteName = '${ev.target.value}' `
    };

    this.getMSSite(siteItem)
      .subscribe((res) => {
        res = this.utilService.camelizeKeys(res);
        const sites: MSSiteModel[] = res.data.mSSites as MSSiteModel[];
        if (sites.length > 0) {
          this.requestsForm.get('siteID')?.patchValue(sites[0].siteID);
          this.requestsForm.get('siteName')?.patchValue(sites[0].siteName);
        } else {
          this.requestsForm.patchValue({
            siteID: ``,
            siteName: ``
          });

          return this.openMSSitePicker();
        }
      }, (error) => {
        console.log('site error => ', error);
      });
  }

  openSentSamplePicker() {
    const initialState = {
      list: [
        this.requestsForm.get('sentSampleID').value
      ],
      title: 'รหัสหน่วยงาน',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(SentSamplehdPickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.requestsForm.patchValue({
          sentSampleID: value.selectedItem['SentSampleID'],
          sentSampleNo: value.selectedItem['SentSampleNo']
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

}

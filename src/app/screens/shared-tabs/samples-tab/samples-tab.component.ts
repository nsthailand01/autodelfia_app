import { RepositoryService } from '@app/shared/repository.service';
import { Component, OnInit, Input, EventEmitter, Output, DoCheck, IterableDiffers, ViewChild, TemplateRef, ViewEncapsulation, ChangeDetectionStrategy, AfterViewChecked, ChangeDetectorRef, AfterContentChecked, AfterViewInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { LISSentSampleHDModel, MSLabProfileModel, MSLabSampleTypeModel } from '@app/models';
import { RaceModel } from '@app/models/race.model';
import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
import { RequestsModel } from '@app/models/requests.model';
import { AddnewRaceComponent } from '@app/screens/request-sample/addnew-race/addnew-race.component';
import { ModalService } from '@app/screens/request-sample/modal.service';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { UtilitiesService } from '@app/services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { EmGAReferenceRangeModel } from '@app/models/emgareferencerange.model';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MslabProfilePickerComponent, SampleTypePickerComponent } from '@app/pickers';

declare var $: any;

@Component({
  selector: 'app-samples-tab',
  templateUrl: './samples-tab.component.html',
  styleUrls: ['./samples-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamplesTabComponent extends BaseComponent
  implements OnInit, DoCheck, AfterViewChecked, AfterContentChecked, AfterViewInit {
  @Input() referenceName: string = '';
  @Input() itemsForm: FormArray;
  @Input() sentSampleForm: FormGroup;
  @Input() itemLists: Array<RequestsModel>;
  @Input() itemToDelete: Array<RequestsModel>;
  @Input() requestFomsArray: FormArray;
  @Output() itemsChangeEvent = new EventEmitter();

  @ViewChild('stepper') stepper: MatStepper;
  moreFormsAll: FormArray;
  requestsForm: FormGroup;

  @ViewChild('closebutton') closebutton;
  modalRef: BsModalRef;

  currentIndex: number = -1;
  currentRequestId: string = '';
  currentUniqueId: string = '';

  differ: any;
  public age: number;
  public races: Array<RaceModel>;
  public patientForm: FormGroup;
  public patientMoreLists: Array<RequestsPatientMoreModel>;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  pregnantNatureChecked: boolean = false;

  toastGaRef: any;
  gARanges: Array<EmGAReferenceRangeModel>;
  selectedIndex = 0;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private differs: IterableDiffers,
    private modalService: ModalService,
    private requestsRepoService: RequestsRepoService,
    private utilService: UtilitiesService,
    private repoService: RepositoryService,
    // private toastrService: ToastrService,
    // private bsModalService: BsModalService,
  ) {
    super();
    this.differ = differs.find([]).create(null);
  }

  ngAfterViewInit(): void {
    // this.changeDetectorRef.detectChanges();
  }

  ngAfterContentChecked(): void {
    // this.changeDetectorRef.detectChanges();
  }

  ngDoCheck(): void {
    const change = this.differ.diff(this.itemLists);
    if (change != null) {
      // console.log('array change >> ', change);
      // console.log('array length >> ', change.length);
      // this.sentSampleForm.patchValue({
      //   numberOFSamples: change.length
      // });
    }
  }

  ngAfterViewChecked(): void {
    // this.changeDetectorRef.detectChanges();
  }

  async openModalEdit(template: TemplateRef<any>, idx: any) {
    this.currentIndex = idx;
    const model = this.itemLists[idx];
    if (!model.requestID) {
      model.requestID = Guid.create().toString();
    }

    this.requestsForm.reset();
    this.patchRequestsFormValues(model);
    this.currentRequestId = model.requestID;

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

    this.requestsForm.patchValue({
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
    });

    await this.doLoadPatientMore();
    this.modalRef = this.bsModalService.show(template, { class: 'modal-lg modal-dialog-centered', backdrop: 'static' });

    const checked = model.pregnantTypeOther;
    this.pregnantNatureChecked = checked ? true : false;

  }

  pregnantTypeOtherChange = (ev: any) => {
    this.pregnantNatureChecked = ev.target.value ? true : false;
  }

  public checkValid = (model: RequestsModel): boolean => {
    if (!model.birthday) {
      setTimeout(() => {
        this.selectedIndex = 0;
      }, 0);
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลหญิงตั้งครรภ์',
        text: 'กรุณาระบุวันเกิด',
      });
      return false;
    }

    if (!model.riskAnalystAgeFlag) {
      setTimeout(() => {
        this.selectedIndex = 2;
      }, 0);
      Swal.fire({
        icon: 'error',
        title: 'อายุครรภ์',
        text: 'กรุณาระบุอายุครรภ์ (ULTRASOUND, GA หรือ LMP)',
      });
      return false;
    }

    if (model.riskAnalystAgeFlag == 'ULT') {
      if (!model.ultrasoundDate) {
        setTimeout(() => {
          this.selectedIndex = 2;
        }, 0);
        Swal.fire({
          icon: 'error',
          title: 'อายุครรภ์',
          text: 'วันที่ตรวจ ULTRASOUND ห้ามว่าง',
        });
        return false;
      }
      if (!model.ultrasoundFlag) {
        setTimeout(() => {
          this.selectedIndex = 2;
        }, 0);
        Swal.fire({
          icon: 'error',
          title: 'อายุครรภ์',
          text: 'กรุณาระบุ BPD หรือ CRL',
        });
        return false;
      }
      if (model.ultrasoundFlag == 'BPD') {
        if (!model.ultrasound_BPD) {
          setTimeout(() => {
            this.selectedIndex = 2;
          }, 0);
          Swal.fire({
            icon: 'error',
            title: 'อายุครรภ์',
            text: 'กรุณาระบุ BPD (mm)',
          });
          return false;
        }

      } else if (model.ultrasoundFlag == 'CRL') {
        if (!model.ultrasound_CRL) {
          setTimeout(() => {
            this.selectedIndex = 2;
          }, 0);
          Swal.fire({
            icon: 'error',
            title: 'อายุครรภ์',
            text: 'กรุณาระบุ CRL (mm)',
          });
          return false;
        }
      }

    }

    if (model.riskAnalystAgeFlag == 'GA') {
      if ((!model.gAAgeWeeks) && (!model.gAAgeDays)) {
        setTimeout(() => {
          this.selectedIndex = 2;
        }, 0);
        Swal.fire({
          icon: 'error',
          title: 'อายุครรภ์',
          text: 'กรุณาระบุ GA สัปดาห์/วัน',
        });
        return false;
      }
    }

    if (model.riskAnalystAgeFlag == 'LMP') {
      if (!model.lMPDate) {
        setTimeout(() => {
          this.selectedIndex = 2;
        }, 0);
        Swal.fire({
          icon: 'error',
          title: 'อายุครรภ์',
          text: 'กรุณาระบุ "ประจำเดือนครั้งสุดท้าย (LMP)"',
        });
        return false;
      }
    }

    return true;
  }

  saveChangeProfile() {
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

    this.requestsForm.patchValue({
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
    });

    const model = Object.assign({}, this.requestsForm.value) as RequestsModel;
    model.fullName = model.title + model.firstName + ' ' + model.lastName;
    this.itemLists[this.currentIndex] = Object.assign({}, model);

    if (!this.checkValid(model)) {
      return;
    }
    $('#ModalUpdateProfile').modal('hide');
    this.modalRef.hide();
    this.updateData();
    this.selectedIndex = 0;
  }

  onCloseProfile = () => {
    this.modalRef.hide();
    this.selectedIndex = 0;
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
      this.handleError(error);
      console.log('error >> ', error);
    }
  }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      fnameCtrl: ['', Validators.required],
      lnameCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      addressCtrl: ['', Validators.required]
    });

    if (this.itemLists === undefined) {
      this.itemLists = new Array<RequestsModel>();
    }

    this.requestsForm = this.fb.group(new RequestsModel());
    this.createInitialForm();
    this.doLoadRace();
    this.doLoadGARange();

    // tslint:disable-next-line: deprecation
    this.requestsForm.valueChanges.subscribe((data) => {
    });
  }

  createInitialForm = () => {
    const isAvailable = this.requestsForm.contains('patientMoreForms');
    if (!isAvailable) {
      this.requestsForm.addControl('patientMoreForms', this.fb.array([]));
    }

    this.moreFormsAll = this.fb.array([]);
  }

  public onStepChange = (stepper: StepperSelectionEvent) => {
    // console.log('stepper label >> ', stepper.selectedStep.label);
    // console.log('stepper index >> ', stepper.selectedIndex);
    // const stepLabel = stepper.selectedStep.label;
    // if (stepLabel == 'Step 2') {
    //   console.log('CLICKED STEP 2');
    // }

    const stepIdx = stepper.selectedIndex;
    this.selectedIndex = stepIdx;
    if (stepIdx == 1) {
      // this.moreForms.controls.forEach((item, index) => {
      //   const myForm = (this.moreForms).at(index);
      //   console.log('item >> ', item);
      //   if (item.value == null) {
      //     item.value.patchValue('N');
      //   }
      // });

      // this.moreForms.patchValue(this.moreForms.value, { onlySelf: false, emitEvent: true });
      // this.moreForms.controls.forEach((item, index) => {
      // });
      // const myForm = (this.moreForms).at(0);
      // console.log('myform >> ', myForm);
      // const currentVal = !myForm.value.toggle;
      // console.log('current value >> ', currentVal);
      // myForm.patchValue({
      //   value: 'N'
      // });
      // this.moreForms[0] = currentVal;

      // this.changeDetectorRef.detectChanges();
    }
  }

  get moreForms(): FormArray {
    const uniqueId = this.currentUniqueId;
    const mores = this.requestsForm.get('patientMoreForms') as FormArray;
    return mores;

    const controls = mores.controls.filter((item) => item.value.uniqueId == uniqueId);
    const moreFilter = this.fb.array(controls);

    moreFilter.controls.forEach((item) => {
      item.updateValueAndValidity();
      console.log('value >> ', item.value.value);
    });
    console.log('get moreForms filter array >> ', moreFilter);

    return moreFilter;
  }

  doLoadRace() {
    this.requestsRepoService.getRaceByCondition({})
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.Races);
        this.races = data;
      }, (err) => {
        this.handleError(err);
      });
  }

  doLoadPatientMore = async () => {
    return new Promise<void>((resolve) => {
      let requestId = this.currentRequestId; // this.requestsForm.get('requestID').value;
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

          let uniqueId = Guid.create().toString();
          if (requestId) {
            uniqueId = requestId;
          } else {
            requestId = uniqueId;
          }

          const moresFilter = this.moreFormsAll.controls.filter((item: any) => item.value.requestID == requestId);
          if ((this.moreFormsAll.controls.length != 0) && (moresFilter.length >= this.patientMoreLists.length)) {
            console.log('exists');
          } else {
            this.patientMoreLists.forEach((elem: any) => {
              elem.uniqueId = uniqueId;
              elem.requestID = requestId;
              this.moreFormsAll.push(this.fb.group(elem));
            });
          }

          const moreall_filter = this.moreFormsAll.controls.filter((item: any) => item.value.requestID == requestId);
          this.requestsForm.setControl('patientMoreForms', this.fb.array(moreall_filter));

          this.currentUniqueId = uniqueId; // this.requestsForm.get('uniqueId').value;
          resolve();

        }, (err) => {
          this.handleError(err);
        });
    });
  }

  radioChange = (ev: any) => {
    // console.log('event >> ', ev);
    // console.log('more forms >> ', this.moreForms.controls);
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

  radioPaymentFlagChange = (ev: any) => {
    if (ev.value != 'CashPayment') {
      this.requestsForm.get('paymentNo').patchValue('');
    }
  }

  radioAgeFlagChanged = (ev: any) => {
    // if (ev.value != 'ULT') {
    //   this.requestsForm.get('ultrasoundFlag').patchValue('');
    //   this.requestsForm.get('ultrasound_BPD').patchValue('');
    //   this.requestsForm.get('ultrasound_CRL').patchValue('');
    // }
  }

  inputBPDChanged = (ev: any) => {
    if (ev.data) {
      this.requestsForm.get('ultrasoundFlag').patchValue('BPD');
      this.requestsForm.get('riskAnalystAgeFlag').patchValue('ULT');
    }
  }

  inputCRLChanged = (ev: any) => {
    if (ev.data) {
      this.requestsForm.get('ultrasoundFlag').patchValue('CRL');
      this.requestsForm.get('riskAnalystAgeFlag').patchValue('ULT');
    }
  }

  updateData() {
    this.itemsChangeEvent.emit(this.itemLists);
  }

  onShiptoNoChange(data: any, idx: number) {
    this.itemLists[idx]['shiptoNo'] = data;
    this.updateData();
  }

  onExternalNoChange(data: any, idx: number) {
    this.itemLists[idx]['externalNo'] = data;
    this.updateData();
  }

  onLabNoChange(data: any, idx: number) {
    this.itemLists[idx]['labNumber'] = data;
    this.updateData();
  }

  openModalNewRace() {
    const initialState = {
      list: [
        { tag: 'Count', value: this.races.length }
      ]
    };
    this.bsModalRef = this.bsModalService.show(AddnewRaceComponent, { class: 'modal-dialog-centered', initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((res: any) => {
      const race = new RaceModel();
      race.raceName = res.data.raceName;
      this.races.push(race);
    });
  }

  onRaceChange(event: any) {
    // console.log('race event >> ', event);
    const race = this.races.find(item => item.raceCode == event.target.value);
    if (race) {
      this.requestsForm.get('raceLifeCycleCode').patchValue(race.raceLifeCycleCode);
    }
  }

  onBirthDayChange(event: any) {
    this.calculateAge(event);
  }

  public calculateAge = (birthday: Date) => {
    if (birthday) {
      const timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      this.age = 0;
    }
    return this.age;
  }

  public calculateGA = () => {
    if (this.requestsForm.get('ultrasoundFlag').value != 'BPD') {
      this.toastrNotiService.clear(this.toastGaRef?.toastId);
      return;
    }

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
      this.toastrNotiService.clear(this.toastGaRef?.toastId);
    }
  }

  public removeGaToast = () => {
    this.toastrNotiService.clear(this.toastGaRef?.toastId);
  }

  updateProfile(id: string, idx: number) {
    const model: RequestsModel = {} as RequestsModel;
    model.requestID = id;
    sessionStorage.setItem('RequestsSampleDataStorage', JSON.stringify(model));
    this.router.navigate(['./request-sample/edit']);
  }

  onDeleteItem(idx) {
    Swal.fire({
      title: 'คุณต้องการลบรายการใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        const deletedItem = this.itemLists[idx];
        if (deletedItem.objectState == 2) {
          deletedItem.objectState = -2;
        } else if (deletedItem.objectState == 1) {
          deletedItem.objectState = -9;
        }

        this.itemLists = this.itemLists.filter(e => (e.objectState !== -2 && e.objectState !== -9));
        this.requestsForm.get('numberOFSamples').patchValue(this.itemLists.length);

        this.updateData();
      }
    });

    // const deletedItem = this.itemLists[idx];
    // if (deletedItem.objectState == 2) {
    //   deletedItem.objectState = -2;
    // } else if (deletedItem.objectState == 1) {
    //   deletedItem.objectState = -9;
    // }

    // this.itemLists = this.itemLists.filter(e => (e.objectState !== -2 && e.objectState !== -9));
    // this.requestsForm.get('numberOFSamples').patchValue(this.itemLists.length);

    // this.updateData();
  }

  openPatientModal(id: string) {
    this.modalService.open(id);
  }

  closePatientModal(id: string) {
    this.modalService.close(id);
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
          console.log('profiles >> ', profiles);
          this.requestsForm.patchValue({
            profileID: profiles[0].profileID,
            profileName: profiles[0].profileName,
          });

          const sampleFound = profiles.find((e, index) => e.sampleTypeDefault === true);
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

  openSampleTypePicker() {
    let profileId = this.requestsForm.get('profileID').value;
    profileId = profileId ?? '@';

    const initialState = {
      list: [this.requestsForm.get('sentSampleID').value],
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
        console.log('selected value >> ', value.selectedItem['SampleTypeName']);
        this.requestsForm.patchValue({
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

  getMSLabProfile(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabprofile/getByCondition', item).pipe(retry(1));
  }

  getMSLabSampleType(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
  }

}

import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { BatchHDModel, RequestsModel } from '@app/models';
import { BatchHDDTO } from '@app/models/data-transfer-object';
import { LabtestPickerComponent } from '@app/pickers/labtest-picker/labtest-picker.component';
import { MslabProfilePickerComponent } from '@app/pickers/mslab-profile-picker/mslab-profile-picker.component';
import { SampleTypePickerComponent } from '@app/pickers/sample-type-picker/sample-type-picker.component';
import { SentSamplehdPickerComponent } from '@app/pickers/sent-samplehd-picker/sent-samplehd-picker.component';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { ToastrNotificationService } from '@app/services';
import { UtilitiesService } from '@app/services/utilities.service';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { ErrorHandlerService } from '@app/shared/error-handler.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Guid } from 'guid-typescript';
import * as moment from 'moment';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { DeliveryNoteService } from '../delivery-note.service';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
defineLocale('th', thBeLocale);

@Component({
  selector: 'app-delivery-note-create',
  templateUrl: './delivery-note-create.component.html',
  styleUrls: ['./delivery-note-create.component.scss'],
})
export class DeliveryNoteCreateComponent extends BaseComponent implements OnInit {
  public batchHdForm: FormGroup;
  public requestForms: FormArray;
  public requestLists: Array<RequestsModel>;
  private dialogConfig: any;
  private batchHdDto: BatchHDDTO;
  private isUpdated: boolean = false;

  public dialogDisplayText = '';
  public dialogTitle = '';
  public dialogType = 'info';

  public paymentMethod = '1';
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public Form: FormGroup;
  startDate: Date = new Date();
  public barCode: string;

  @ViewChild('swalDialog') private swalDialog: SwalComponent;

  constructor(
    private router: Router,
    private location: Location,
    private deliveryService: DeliveryNoteService,
    private requestsRepoServie: RequestsRepoService,
    private matDialog: MatDialog,
    private errorService: ErrorHandlerService,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private toastr: ToastrService,
    private notiService: ToastrNotificationService,
    private localeService: BsLocaleService,
    private utilService: UtilitiesService
  ) // private modalService: BsModalService
  {
    super();
    this.localeService.use('th');

    this.dateAdapter.setLocale('th-TH');
    moment.locale('th');
    this.Form = this.fb.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdated && this.batchHdForm.dirty) {
      return this.confirmDlgService.open();
    }
    return of(true);
  }

  ngOnInit() {
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {},
    };

    this.createInitialForm();
    this.doLoadData();
  }

  get formBatchControls() {
    return this.batchHdForm.controls;
  }
  get formRequestArray() {
    return this.batchHdForm.controls.requestsForm as FormArray;
  }

  createInitialForm() {
    const objBatchModel: BatchHDModel = {} as BatchHDModel;
    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'en-US');

    this.batchHdForm = this.fb.group(new BatchHDModel());
    this.batchHdForm.addControl('requestsForm', this.fb.array([]));

    // this.batchHdForm = this.fb.group({
    //   batchID: [''],
    //   spParmLastBatchID: [''],
    //   sentSampleID: [''],
    //   sentSampleName: [''],
    //   batchNo: [''],
    //   batchDate: [new Date()],
    //   siteID: [''],
    //   receiveNo: [''],
    //   receiveDate: [new Date()],
    //   currentLabNo: [''],
    //   receivebyEmpID: [''],
    //   deptID: [''],
    //   analystDays: [0],
    //   dueDate: [new Date()],
    //   profileID: [''],
    //   profileName: [''],
    //   testCode: [''],
    //   sampleTypeID: [0],
    //   sampleTypeCode: [''],
    //   sampleTypeName: [''],
    //   numberOFSamples: [0],
    //   numberOFBarcode: [0],
    //   employeeID: [''],
    //   userName: [''],
    //   receiveFlag: ['1'],
    //   documentStatus: [''],
    //   createdBy: [''],
    //   createdDate: [currentDate],
    //   modifiedBy: [''],
    //   isDeleted: [0],
    //   modifiedDate: [currentDate],
    //   remark: [''],
    //   isNew: [true],

    //   requestsForm: this.fb.array([]),
    // });

    this.requestLists = [];
    this.requestForms = this.batchHdForm.controls.requestsForm as FormArray;

    this.addItem();
    this.doLoad();
  }

  public doLoadData = async () => {
    const storageData = sessionStorage.getItem('BatchHDDataStorage');
    const objData = JSON.parse(storageData) as BatchHDModel;

    if (objData != null) {
      await this.deliveryService
        .getBatchHDById({ BatchID: objData.batchID })
        .subscribe(
          (res) => {
            const model: BatchHDModel = Object.assign({}, res.data.BatchHDs[0]);
            this.patchItemValues(model);

            const batchDate = this.batchHdForm.get('batchDate').value;
            const dueDate = this.batchHdForm.get('dueDate').value;
            this.batchHdForm.patchValue({
              spParmLastBatchID: this.batchHdForm.get('batchID').value,
              batchDate: new Date(batchDate), // this.datePipe.transform(batchDate, 'yyyy-MM-dd', 'en-US'),
              dueDate: new Date(dueDate), // this.datePipe.transform(dueDate, 'yyyy-MM-dd', 'en-US'),
              isNew: false,
            });

            console.log('load this.batchHdForm >> ', this.batchHdForm.value);
          },
          (err) => {
            console.log('err >> ', err);
          }
        );

      await this.requestsRepoServie
        .getRequestsById({ SQLWhere: `it.BatchID = '${objData.batchID}'` })
        .subscribe(
          (res) => {
            // const model: Array<RequestsModel> = Object.assign({}, res.data.Requests);
            res = this.utilService.camelizeKeys(res);
            console.log('ressssssssss > ', res);

            res.data.requests.forEach((element) => {
              element.spParmLastRequestID = element.requestID;
            });

            this.requestLists = res.data.requests;
            // this.requestLists.forEach(element => {
            //   element.spParmLastRequestID = element.requestID;
            // });
            console.log('requests lists >> ', this.requestLists);
          },
          (err) => { }
        );
    }
  }

  public doLoad = () => {
    // const docuDate = this.batchHdForm.controls['batchDate'].value;
    // const newDate = this.datePipe.transform(docuDate, 'yyyy-MM-dd', 'en-US');
    // this.batchHdForm.controls['batchDate'].patchValue(newDate);
  }

  applyBarcode(data: any) {
    data = data.trimEnd();
    console.log('event >> ', data);

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
    item.receiveDate = this.batchHdForm.get('batchDate').value;
    this.requestLists.push(item);
  }

  radioChange(event: any) {
    this.batchHdForm.patchValue({
      receiveFlag: event.value,
    });
    console.log('radio : ', event.value);
  }

  addItem(): void {
    const control = this.batchHdForm.get('requests') as FormArray;
    // control.push(this.createItemForm());

    // let controlArray = <FormArray>this.batchHdForm.get['requests'];
    //     this.list.forEach(app => {
    //                 const fb = this.buildGroup();
    //                 fb.patchValue(app);
    //                 controlArray.push(fb);
    //         });
  }

  createItemForm(): FormGroup {
    return this.fb.group({} as BatchHDModel);
  }

  addRequestsForm() {
    const creds = this.batchHdForm.controls.credentials as FormArray;
    creds.push(
      this.fb.group({
        username: '',
        password: '',
      })
    );
  }

  openSentSamplePicker() {
    const initialState = {
      list: [this.batchHdForm.get('sentSampleID').value],
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
        this.batchHdForm.patchValue({
          sentSampleID: value.selectedItem['SentSampleID'],
          sentSampleName: value.selectedItem['SentSampleName'],
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  openSampleTypePicker() {
    this.toastr.success('ชนิดตัวอย่าง');
    const initialState = {
      list: [this.batchHdForm.get('sampleTypeID').value],
      title: 'ชนิดตัวอย่าง',
      class: 'my-class',
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
        this.batchHdForm.patchValue({
          sampleTypeID: value.selectedItem['SampleTypeID'],
          sampleTypeCode: value.selectedItem['SampleTypeCode'],
          sampleTypeName: value.selectedItem['SampleTypeName'],
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  openLabProfilePicker() {
    this.toastr.success('lab tests');
    const initialState = {
      list: [this.batchHdForm.get('profileID').value],
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
        console.log('selected value >> ', value.selectedItem['ProfileName']);
        this.batchHdForm.patchValue({
          profileID: value.selectedItem['ProfileID'],
          profileName: value.selectedItem['ProfileName'],
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  openLabTestPicker() {
    this.toastr.success('lab tests');
    const initialState = {
      list: [this.batchHdForm.get('profileID').value],
      title: 'การทดสอบ',
      class: 'my-class',
    };

    this.bsModalRef = this.bsModalService.show(LabtestPickerComponent, {
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
        console.log('selected value >> ', value.selectedItem['TestID']);
        this.batchHdForm.patchValue({
          profileID: value.selectedItem['TestID'],
          testCode: value.selectedItem['TestCode'],
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.batchHdForm.controls[controlName].hasError(errorName);
  }

  // public onCancel = () => {
  //   this.location.back();
  // }

  updateItemChanged(event: any) {
    console.log('emit >> ', event);
    // this.requestLists = event;
  }

  public goBack = () => {
    sessionStorage.removeItem('BatchHDDataStorage');

    if (window.history.length > 1) {
      this.router.navigate(['/delivery-note/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.executeCreation(null);
  }

  public doDelete = () => {
    this.notiService.showError('Delete...');
  }

  public doSentSample = () => {
    this.notiService.showSuccess('Sent Sample');
  }

  // public createBatch = (batchFormValue: any) => {
  //   if (this.batchHdForm.valid) {
  //     this.executeBatchCreation(batchFormValue);
  //   }
  //   else {
  //   }
  // }

  private executeCreation = (batchFormValue: any) => {
    this.onPrepareValueChange();
    console.log('create >> ', this.batchHdDto);

    if (this.batchHdForm.get('isNew').value == true) {
      this.deliveryService.createBatchHD(this.batchHdDto).subscribe(
        (res) => {
          this.isUpdated = true;
          this.spinner.hide();
          this.notiService.showSuccess('Create Successfully.');
          this.goBack();
        },
        (err) => {
          this.spinner.hide();
          console.log('error >> ', err);
          return this.handleError(err);
        }
      );
    } else {
      this.deliveryService.updateBatchHD(this.batchHdDto).subscribe(
        (res) => {
          this.isUpdated = true;
          this.spinner.hide();
          this.notiService.showSuccess('Update Successfully.');
          this.goBack();
        },
        (err) => {
          this.spinner.hide();
          console.log('error >> ', err);
          return this.handleError(err);
        }
      );
    }

    // this.repository.create(apiUrl, this.batchHdDto)
    //   .subscribe(res => {
    //     let dialogRef = this.matDialog.open(SuccessDialogComponent, this.dialogConfig);

    //     //we are subscribing on the [mat-dialog-close] attribute as soon as we click on the dialog button
    //     dialogRef.afterClosed()
    //       .subscribe(result => {
    //         this.location.back();
    //       });
    //   },
    //     (err => {
    //       console.log('err >> ', err);
    //       this.errorService.dialogConfig = { ...this.dialogConfig };
    //       this.errorService.handleError(err);
    //     })
    //   )
  }

  onPrepareValueChange() {
    this.batchHdDto = {
      BatchHDs: [new BatchHDModel()],
      Requests: [],
    };

    let guId = Guid.create();
    const batchDate = this.batchHdForm.get('batchDate').value;
    const dueDate = this.batchHdForm.get('dueDate').value;
    if (this.batchHdForm.get('isNew').value) {
      //
    } else {
      guId = this.batchHdForm.get('batchID').value;
    }

    this.batchHdForm.patchValue({
      batchID: guId.toString(),
      batchDate: this.datePipe.transform(batchDate, 'yyyy-MM-dd', 'en-US'),
      dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd', 'en-US'),
    });

    this.batchHdDto.BatchHDs = [Object.assign({}, this.batchHdForm.value)];
    this.batchHdDto.Requests = this.requestLists;

    // this.batchHdDto.BatchHDs[0].batchID = this.guId.toString();
    // this.batchHdDto.BatchHDs[0].batchDate = this.batchHdForm.get('batchDate').value;
    // this.batchHdDto.BatchHDs[0].batchNo = this.batchHdForm.get('batchNo').value;
    // this.batchHdDto.BatchHDs[0].sentSampleID = this.batchHdForm.get('sentSampleID').value;
    // this.batchHdDto.BatchHDs[0].profileID = this.batchHdForm.get('profileID').value;
    // this.batchHdDto.BatchHDs[0].numberOFSamples = this.batchHdForm.get('numberOFSamples').value;
    // this.batchHdDto.BatchHDs[0].sampleTypeID = 0; // this.batchHdForm.get('sampleTypeID').value;
    // this.batchHdDto.BatchHDs[0].analystDays = this.batchHdForm.get('analystDays').value;
    // this.batchHdDto.BatchHDs[0].dueDate = this.batchHdForm.get('dueDate').value;
    // this.batchHdDto.BatchHDs[0].employeeID = this.batchHdForm.get('employeeID').value;

    // this.batchHdDto.Requests = this.requestLists;

    this.batchHdDto.Requests.forEach((element) => {
      element.batchID = guId.toString();
      if (!this.batchHdForm.get('isNew').value) {
        element.spParmLastRequestID = element.requestID;
      }
    });

    console.log('prepare requests >> ', this.batchHdDto.Requests);
  }

  selectedTabChange(tabChangeEvent: MatTabChangeEvent) {
    console.log(tabChangeEvent);
    const selectedTab = tabChangeEvent.tab;
    console.log(selectedTab);
  }

  patchItemValues(
    value: { [key: string]: any },
    { onlySelf, emitEvent }: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ) {
    console.log('data to patch value -->> ', value);
    try {
      Object.keys(value).forEach((name) => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.batchHdForm.controls[ngName]) {
          this.batchHdForm.controls[ngName].patchValue(value[name]);
        }
      });
      console.log('after patch value >> ', this.batchHdForm.value);
    } catch (error) {
      console.log('error >> ', error);
    }
  }

  patchRequestValues(
    value: { [key: string]: any },
    { onlySelf, emitEvent }: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ) {
    console.log('data to patch value -->> ', value);
    try {
      Object.keys(value).forEach((name) => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.batchHdForm.controls[ngName]) {
          this.batchHdForm.controls[ngName].patchValue(value[name]);
        }
      });
      console.log('after patch value >> ', this.batchHdForm.value);
    } catch (error) {
      console.log('error >> ', error);
    }
  }
}

import { Component, OnInit, ViewChildren, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { LISSentSampleHDModel, MSLabSampleTypeModel, RequestsDTO, RequestsModel, SentSampleDTO } from '@app/models';
import { MssitePickerComponent } from '@app/pickers';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { ToastrNotificationService, UtilitiesService } from '@app/services';
import { RepositoryService } from '@app/shared/repository.service';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { cloneDeep as _cloneDeep, differenceWith as _differenceWith, isEqual as _isEqual } from 'lodash';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
//import { OptionsReceiptForm } from '@app/models/newborn/option-receipt-form';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-get-sample-barcode',
  templateUrl: './get-sample-barcode.component.html',
  styleUrls: ['./get-sample-barcode.component.scss']
})

//GetSampleBarcodeComponent

export class GetSampleBarcodeComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren('searchcontrol') searchControl;

  public dataSource = new MatTableDataSource<LISSentSampleHDModel>();

  listPageSizes = [20, 50, 100, 200, 300, 500];

  sentSampleForm: FormGroup;
  optionsForm: FormGroup;
  itemSelection = new SelectionModel<any>(true, []);
  selection = new SelectionModel<RequestsModel>(true, []);
  @Input() multiSelection: boolean = true;
  @Input() public requester: string = '';

  @Output() public editShipment = new EventEmitter<any>();

  itemLists: RequestsModel[];
  requestLists: Array<RequestsModel>;
  searchText: string = '';
  isSaveable: boolean = false;

  private sentSampleDto: SentSampleDTO;
  private requestsDTO: RequestsDTO;


  public pageListConfig: any;
  originalItems: Array<RequestsModel> = [];
  //sampleTypes = [
  //  { value: 'Paper', text: 'กระดาษ' },
  //  { value: 'Serum', text: 'ซีรั่ม' },
  //];

  public sampleTypes = [];

  sampleStatus = [
    { value: 'Received', text: 'Received' },
    { value: 'Rejected', text: 'Rejected' },
  ];

  //paperResults = [
  //  { value: '1', text: 'กระดาษซับสภาพสมบูรณ์ (ปกติ)' },
  //  { value: '2', text: 'กระดาษซับเลือดที่มีหยดเลือดช้ำ (ผิดปกติ)' },
  //  { value: '3', text: 'กระดาษซับเลือดที่มีวงเลือดชนกัน (ผิดปกติ)' },
  //  { value: '4', text: 'กระดาษซับเลือดที่ถูกสัตว์/แมลงกัดแทะ (ผิดปกติ)' },
  //  { value: '5', text: 'กระดาษซับเลือดที่มีการปนเปื้อน (ผิดปกติ)' },
  //  { value: '6', text: 'กระดาษซับเลือดที่ขึ้นรา (ผิดปกติ)' },
  //  { value: '7', text: 'กระดาษซับเลือดที่เลือดไม่ซึม (ผิดปกติ)' },
  //];

  //paperResults = [
  //  { value: '1', text: 'การสั่งการทดสอบในใบส่งตรวจและระบบคอมพิวเตอร์ไม่ตรงกัน' },
  //  { value: '2', text: 'ชื่อผู้ป่วยในใบส่งตรวจและสิ่งส่งตรวจไม่ตรงกัน' },
  //  { value: '3', text: 'ไม่ระบุชื่อ-นามสกุลบนสิ่งส่งตรวจ' },
  //  { value: '4', text: 'ไม่ระบุชื่อ-นามสกุลบนใบส่งตรวจ' },
  //  { value: '5', text: 'ไม่มีสิ่งส่งตรวจ' },
  //  { value: '6', text: 'ไม่มีใบส่งตรวจ' },
  //  { value: '7', text: 'สิ่งส่งตรวจไม่เหมาะสม' },
  //  { value: '8', text: 'สิ่งส่งตรวจเก็บใส่ภาชนะไม่เหมาะสม' },
  //  { value: '9', text: 'สิ่งส่งตรวจหกเลอะเทอะ/ปิดฝาไม่สนิท/มีรอยแตกร้าว' },
  //  { value: '10', text: 'สิ่งส่งตรวจไม่เพียงพอ' },
  //  { value: '11', text: 'สิ่งส่งตรวจ Hemolysis ไม่สามารถทำการทดสอบได้' },
  //  { value: '12', text: 'สิ่งส่งตรวจมีความขุ่นมาก ไม่สามารถทำการทดสอบได้' },
  //  { value: '13', text: 'สิ่งส่งตรวจมีความหนืดมาก ไม่สามารถทำการทดสอบได้' },
  //  { value: '14', text: 'การนำส่งสิ่งส่งตรวจเกินเวลาที่กำหนด' },
  //  { value: '15', text: 'การนำส่งสิ่งส่งตรวจไม่เหมาะสม' },
  //  { value: '16', text: 'ไม่ระบุเวลาเก็บสิ่งส่งตรวจ' },
  //  { value: '17', text: 'อื่นๆ ' },

  //];

  public paperResults = [];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private notiService: ToastrNotificationService,
    private utilService: UtilitiesService,
    private requestsRepoService: RequestsRepoService,
    private repoService: RepositoryService,
    private sentSampleService: SentSampleService,
  ) {
    super();
    this.sentSampleForm = this.fb.group(new LISSentSampleHDModel());
    this.originalItems = _cloneDeep(this.itemLists);
    this.getSampleType();

    this.pageListConfig = {
      id: `itemListPage`,
      itemsPerPage: 100,
      currentPage: 1,
      totalItems: this.dataSource?.data?.length
    };
    

  }

  ngAfterViewInit(): void {
    this.searchControl.first.nativeElement.focus();

    this.optionsForm.get('sampleType').valueChanges
      .subscribe(v => {
        //console.log('vvvvv =>',v);
        if (v != 'Paper' && v != 'กระดาษ') {
          this.optionsForm.patchValue({ paperResult: null });
        }
      });

    this.optionsForm.get('sampleStatus').valueChanges
      .subscribe(v => {
        //console.log(v);
      });

    this.optionsForm.get('paperResult').valueChanges
      .subscribe(v => {
        //console.log(v);
      });
  }

  ngOnInit(): void {

    /////Function CreateOnEnterPressKey_Up
    /////Function CreateOnEnterPressKey_Up
    document.getElementById('testBtn').click();

    this.createInitialForm();


    this.getSampleType();

    this.getRefuse_verification();

    this.optionsForm.patchValue({ sampleType: 'Paper' });
    this.optionsForm.patchValue({ sampleStatus: 'Received' });
    this.optionsForm.patchValue({ paperResult: '1' });


  }

  createInitialForm() {
    this.sentSampleForm = this.fb.group(new LISSentSampleHDModel());
    this.sentSampleForm.addControl('requestsForm', this.fb.array([new RequestsModel()]));
    this.sentSampleForm.addControl('patientMoreForms', this.fb.array([]));

    this.optionsForm = this.fb.group(new OptionsReceiptForm());

    this.requestLists = new Array<RequestsModel>();
    // this.itemLists = new Array<RequestsModel>();

    this.requestsDTO = {
      Requests: new Array<RequestsModel>(),
      RequestsPatientMores: [],
      AppCode: 'Nbs'
    };
  }

  openMSSitePicker() {
    const initialState = {
      list: [
        this.sentSampleForm.get('siteCode').value
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
        // this.defaultValue.siteID = value.selectedItem['SiteID'];
        // this.runPrefix = value.selectedItem['RunPrefix'];
      },
        (err: any) => {
          console.log(err);
        });

  }

  enterSearch = (ev) => {

    this.doLoadSample();
  }

  isValidDate = (value) => {
    const dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());

    // if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    //   console.log('is date!');
    // }

    // !isNaN(Date.parse("22/05/2001"))  // true
    // !isNaN(Date.parse("blabla"))  // false
  }







  public doLoadSample = async () => {
    this.loading = true;
    this.spinner.show();

    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;

    if (objData != null) {

    }

    //const item = {
    //  // sentSampleID: objData.sentSampleID,
    //  sqlSelect: `it.*, MSSite.SiteName As SiteName, emp.FirstName + ' ' + emp.LastName as EmployeeName, sent.SiteName as SentToSiteName ` +
    //    `, type.SampleTypeName`,
    //  sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
    //    `Left Outer Join MSSite as sent On (sent.SiteID = it.SentToSiteID) ` +
    //    `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) ` +
    //    `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID) `,
    //  // sqlWhere: `(it.SentSampleID = '${objData?.sentSampleID}')`,
    //  sqlOrder: ``,
    //  pageIndex: -1
    //};

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

    //console.log('sentSampleDate => ', sentSampleDate);
    //console.log('dueDate => ', dueDate);
    //console.log('receiveDate => ', receiveDate);


    //this.sentSampleForm.patchValue({
    //  spParmLastSentSampleID: this.sentSampleForm.get('sentSampleID').value,
    //  sentSampleDate: sentSampleDate ? new Date(sentSampleDate) : null,
    //  dueDate: dueDate ? new Date(dueDate) : null,
    //  receiveDate: receiveDate ? new Date(receiveDate) : null,
    //  isNew: false
    //});





    //const requestsItem = {
    //  sqlSelect: `it.*, MSSite.SiteName As SiteName, sent.SiteName as SentToSiteName ` +
    //    `, type.SampleTypeName`,
    //  sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
    //    `Left Outer Join LISSentSampleHD On (it.SentSampleID = LISSentSampleHD.SentSampleID) ` +
    //    `Left Outer Join MSSite as sent On (sent.SiteID = LISSentSampleHD.SentToSiteID) ` +
    //    `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) `,
    //  sqlWhere: this.getRangeWhere(),
    //  sqlOrder: ``,
    //  pageIndex: -1
    //};


    //////Function After
    //const requestsItem = {
    //  sqlSelect: `  `,
    //  sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
    //    `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)` +
    //    `Left Outer Join Requests as req On (req.SentSampleID = it.SentSampleID)`,
    //  sqlWhere: this.getRangeWhere(),
    //  sqlOrder: ` it.SentSampleDate Desc `,
    //  pageIndex: -1
    //};
    console.log('wwwwww222');
    const requestsItem = {
      sqlSelect: `  `,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)` +
        `Left Outer Join Requests as req On (req.SentSampleID = it.SentSampleID)` +
        `Left Outer Join Refuse_verification as refv On (refv.Value = req.FilterPaperCompleteness)`,
      sqlWhere: `(isnull(it.DocumentStatus, '') != 'Draft')`,
      //sqlWhere: ` 1 = 1 `,
      sqlOrder: ` it.SentSampleDate Desc `,
      pageIndex: -1
    };

    //let promiseRequest = await this.requestsRepoService
    //  .getRequestsById(requestsItem).toPromise()
    //  .catch(() => this.loading = false);

    //promiseRequest = this.utilService.camelizeKeys(promiseRequest);

    //////Function After
    ////this.requestLists = promiseRequest?.data.requests;

    //console.log('promiseRequest?.data.requests =>>> ', promiseRequest?.data.requests);

    //this.itemLists = promiseRequest?.data.requests;


    ///////ResultData
    this.sentSampleService.getLISSentSampleHDByCondition2(requestsItem)
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        //this.dataSource.data = res['data'].LISSentSampleHDs as LISSentSampleHDModel[];
        const data = this.utilService.camelizeKeys(res.data);
        //////console.log('TestData => ', data.lISSentSampleHDs);
        this.itemLists = data.lISSentSampleHDs;
        //console.log('this.itemLists.length => ', this.itemLists.length);
        if (this.itemLists.length == 0) {
          this.isSaveable = false;
          this.spinner.hide();
          this.notiService.showInfo(`บาร์โค้ด: '${this.searchText}'`, 'ไม่พบข้อมูลคนไข้');
        } else {
          this.isSaveable = true;
        }
      }
        ,
        (err) => {
          return this.handleError(err);
        });

    //console.log('this.itemLists.length  => ', this.itemLists.length);
    this.spinner.hide();
  
    //if (this.itemLists.length == 0) {
    //  this.isSaveable = false;
    //  this.spinner.hide();
    //  this.notiService.showInfo(`บาร์โค้ด: '${this.searchText}'`, 'ไม่พบข้อมูลคนไข้');
    //} else {
    //  this.isSaveable = true;
    //}

    this.loading = false;
    this.spinner.hide();
    this.searchText = '';
  }

  getRangeWhere = () => {
    let sqlWhere = '';

    if (this.searchText) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(req.labNumber = '${this.searchText}') `;
    }

    return sqlWhere;
  }

  doSaveReceiptSample = async () => {
    //const prepare = await this.doPrepareSaveReceipt();
    //if (!prepare) {
    //  console.log('prepare not pass');
    //  return;
    //}
    //const isValid = await this.doValidateSaveReceipt();
    //if (!isValid) {
    //  console.log('validate not pass');
    //  return;
    //}

    //this.spinner.show();
    //return this.requestsRepoService.saveRequests(this.requestsDTO)
    //  .subscribe((res) => {
    //    this.spinner.hide();
    //    this.notiService.showSuccess('Save Successfully.');
    //    // this.doPostSaveRequests(res);
    //  }, (err) => {
    //    this.spinner.hide();
    //    console.log('executeSaveData error >> ', err);
    //    return this.handleError(err);
    //  });

    ///////NewFunctionSaveData
    const prepare = await this.doPrepareSaveReceipt();


  }

  doPrepareSaveReceipt = async (): Promise<boolean> => {





    try {
      const requests = this.itemLists.filter(r => (r.isSelected));
      const rangeOptionForm = this.optionsForm.value;
      //console.log('This Value In Value => ', rangeOptionForm);
      //console.log('This requests => ', requests);

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
      //console.log('sampleType => ', sampleType);
      //console.log('sampleStatus => ', sampleStatus);
      //console.log('paperResult => ', paperResult);
      //console.log('remark => ', remark);


      //this.spinner.show();
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

        this.spinner.hide();
        this.notiService.showSuccess('Save Successfully.');

      } else {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'กรุณาเลือกรายการ!',
          html: `กรุณาเลือกรายก่อนรับตัวอย่าง`,
          allowOutsideClick: false,
        });
      }



    } catch (err) {
      console.error('error ', err);
      this.handleError(err);
      return false;
    }







    //try {
    //  this.sentSampleDto = {
    //    LISSentSampleHDs: [new LISSentSampleHDModel()],
    //    LISSentSampleDTs: [],
    //    Requests: new Array<RequestsModel>(),
    //    RequestsPatientMores: [],
    //    AppCode: 'Nbs'
    //  };

    //  this.requestLists.forEach((req) => {
    //    req.receiveDate = new Date();
    //    req.sampleType = this.optionsForm.get('sampleType').value;
    //    req.requestStatus = this.optionsForm.get('sampleStatus').value;
    //    req.filterPaperCompleteness = this.optionsForm.get('paperResult').value;
    //    req.receiptRemark = this.optionsForm.get('remark').value;
    //    req.appCode = 'Nbs';
    //  });

    //  // this.sentSampleDto.LISSentSampleHDs = [Object.assign({}, this.sentSampleForm.value)];
    //  // this.sentSampleDto.Requests = Object.assign([], this.itemLists);

    //  this.requestsDTO.Requests = Object.assign([], this.requestLists);
    //  this.requestsDTO.AppCode = 'Nbs';

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

  onCheckedChange = (ev: any, item: any) => {
    if (item.shipmentNo) {
      ev.source.checked = false;
      item.isSelected = false;
      return Swal.fire({
        icon: 'error',
        title: 'คนไข้รายนี้ได้ทำการสร้างการนำส่งแล้ว!',
        html: `เลขที่ใบนำส่ง [${item.shipmentNo}]`,
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

    // item.isSelected = !item.isSelected;
    // this.highlightRow(item);
  }

  isAllCheckBoxChecked() {
    if (this.itemLists.length == 0) {
      return false;
    }
    return this.itemLists.every(p => p.isSelected);
  }

  checkAllCheckBox(ev) {
    this.itemLists.forEach(x => {
      if (x.shipmentNo || x.isNew || x.isEdit) {
        x.isSelected = false;
      } else {
        x.isSelected = ev.checked;
      }
    });
  }

  goBack = () => {
    this.location.back();
  }

  getSampleType = () => {



    //////FunctionAfter
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






    ///////Function Befiore
    //const sample = {
    //  sqlSelect: ``,
    //  sqlWhere: ``
    //};
    //this.getMSLabSampleType(sample)
    //  .subscribe((response) => {
    //    response = this.utilService.camelizeKeys(response);
    //    const types: MSLabSampleTypeModel[] = response.data.mSLabSampleTypes;

    //    if (types.length > 0) {

    //      this.sampleTypes = [];

    //      types.forEach((t) => {
    //        const n = { value: t.sampleTypeCode, text: t.sampleTypeName };
    //        this.sampleTypes.push(n);
    //      })

    //      let found = this.sampleTypes.find((element) => {
    //        return element.value.toLowerCase() === 'กระดาษ';
    //      });

    //      if (found) {
    //        this.optionsForm.patchValue({
    //          sampleType: `กระดาษ`
    //        });
    //      } else {
    //        found = this.sampleTypes.find((element) => {
    //          return element.value.toLowerCase() === 'paper';
    //        });
    //        if (found) {
    //          this.optionsForm.patchValue({
    //            sampleType: `Paper`
    //          });
    //        } else {
    //          this.optionsForm.patchValue({
    //            sampleType: this.sampleTypes[0].value
    //          });
    //        }
    //      }

    //    } else {
    //    }
    //  }, (err) => {
    //    console.log('load sample-type error >> ', err);
    //  });
  }

  getMSLabSampleType(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
  }















  ////// NewFunctionData
  setRowSelectedCheck($event) {
    //console.log('Event => ', $event);

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



  public redirectToDetails = (id: string) => {
    const model: LISSentSampleHDModel = {} as LISSentSampleHDModel;
    model.sentSampleID = id;
    sessionStorage.setItem('LISSentSampleHDDataStorage', JSON.stringify(model));
    this.router.navigate(['/receive-sample/edit']);
  }


  doEditShipment = (item: any) => {
    console.log('emit => ', item);
    this.editShipment.emit(item);
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
              this.doLoadSample();
            });
          });
      }
    });
  }


  pageListChanged(event: any) {
    this.pageListConfig.currentPage = event;
  }

  handlePageSizeChange(event): void {
    this.pageListConfig.currentPage = 1;
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



  public doLoadSample2 = async () => {
    //////Function After
    const requestsItem = {
      sqlSelect: `  `,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)` +
        `Left Outer Join Requests as req On (req.SentSampleID = it.SentSampleID)`+
      `Left Outer Join Refuse_verification as refv On (refv.Value = req.FilterPaperCompleteness)`,
      sqlWhere: `req.RequestStatus = '222'`,
      sqlOrder: ` it.SentSampleDate Desc `,
      pageIndex: -1
    };

    ///////ResultData
    this.sentSampleService.getLISSentSampleHDByCondition2(requestsItem)
      .subscribe(res => {
        const data = this.utilService.camelizeKeys(res.data);
        this.itemLists = data.lISSentSampleHDs;
      }
        ,
        (err) => {
          return this.handleError(err);
        });
  }



  TestFunction() {
    // Your code to handle the Enter key press here
    console.log('', this.doLoadSample2());
  }

 
  onCheckboxChange(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      $('#txtSearch1').addClass('d-none');
      $('#btnSavedata').addClass('d-none');
      $('#txtSearch2').removeClass('d-none');
    } else {
      $('#txtSearch2').addClass('d-none');
      $('#txtSearch1').removeClass('d-none');
      $('#btnSavedata').removeClass('d-none');
    }

  }


  enterSearch2 = (ev) => {

    //console.log('evvvvv => ', ev);

    if (ev != '') {
      //console.log('55555');

    this.loading = true;
    this.spinner.show();

    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;

    if (objData != null) {

    }

    const sentSampleDate = this.sentSampleForm.get('sentSampleDate').value;
    const dueDate = this.sentSampleForm.get('dueDate').value;
    const receiveDate = this.sentSampleForm.get('receiveDate').value;

    //////Function After
    const requestsItem = {
      sqlSelect: `  `,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)` +
        `Left Outer Join Requests as req On (req.SentSampleID = it.SentSampleID)`,
      sqlWhere: this.getRangeWhere2(ev),
      sqlOrder: ` it.SentSampleDate Desc `,
      pageIndex: -1
    };

    ///////ResultData
    this.sentSampleService.getLISSentSampleHDByCondition2(requestsItem)
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        const data = this.utilService.camelizeKeys(res.data);
        this.itemLists = data.lISSentSampleHDs;

        //console.log('ItemLiast =>>>> ', this.itemLists);


        const rangeOptionForm = this.optionsForm.value;
        const sampleType = rangeOptionForm.sampleType;
        const sampleStatus = rangeOptionForm.sampleStatus;
        const paperResult = rangeOptionForm.paperResult;
        let respaper = '';
        if (paperResult != null) {
          //console.log('check!=');
          respaper = rangeOptionForm.paperResult;
        } else {
          //console.log('check==');
          respaper = '';
        }
        const remark = rangeOptionForm.remark;
        //console.log('respaper => ', respaper);

        for (let el of this.itemLists) {
          //console.log('ellllll =>', el.requestID);

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



        this.spinner.hide();
        this.notiService.showSuccess('Save Successfully.');
        this.doLoadSample2();


        if (this.itemLists.length == 0) {
          this.isSaveable = false;
          this.spinner.hide();
          this.notiService.showInfo(`บาร์โค้ด: '${this.searchText}'`, 'ไม่พบข้อมูลคนไข้');
        } else {
          this.isSaveable = true;
        }
      }
        ,
        (err) => {
          return this.handleError(err);
        });

    this.spinner.hide();



    this.loading = false;
    this.spinner.hide();
    this.searchText = '';
    } else {
      //console.log('66666');
    }




  }
  



  getRangeWhere2 = (ev) => {

    //console.log('evvvvv  =>>>>> ', ev);
    let sqlWhere = '';

    if (this.searchText) {
      sqlWhere += (sqlWhere ? ` and ` : ``) + `(req.labNumber = '${ev}') `;
    }

    return sqlWhere;
  }


  ////// NewFunctionData






















}

export class OptionsReceiptForm {
  sampleType: string = '';
  sampleStatus: string = '';
  paperResult: string = '';
  remark: string = '';
}

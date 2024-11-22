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
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { RequestsModel } from '@app/models/requests.model';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { cloneDeep as _cloneDeep, differenceWith as _differenceWith, isEqual as _isEqual } from 'lodash';
import { clearLine } from 'readline';
//import { BLACK_ON_WHITE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';

declare var $: any;


@Component({
  selector: 'app-receive-sample-list',
  templateUrl: './receive-sample-list.component.html',
  styleUrls: ['./receive-sample-list.component.scss']
})
export class ReceiveSampleListComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Output() uploaded = new EventEmitter<any>();

  requestLists: Array<RequestsModel>;
  locale = 'th';
  rangeForm: FormGroup;
  public printBarcodeForm: FormGroup;
  optionsForm: FormGroup;
  itemSelection = new SelectionModel<any>(true, []);
  public sentSampleLists: LISSentSampleHDModel[] = [];
  selection = new SelectionModel<RequestsModel>(true, []);
  private requestsDTO: RequestsDTO;
  printPageConfig: any;
  shiptoNoToPrint: string = '';
    isCheckedauto: boolean = false;
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
  @Input() itemLists2: RequestsModel[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public requester: string = '';
  @Input() multiSelection: boolean = true;
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

  userID: string = '';
  listPageSizes = [20, 50, 100, 200, 300, 500];
  public pageListConfig: any;
  dataArrayTest: any[] = [];
  originalItems: Array<RequestsModel> = [];
  public DataList: Array<RequestsModel>;
  //DataList: Array<RequestsModel> = [];
  public CheckStrResult = '';

  //paperResults = [
  //  { value: '1', text: 'กระดาษซับสภาพสมบูรณ์ (ปกติ)' },
  //  { value: '2', text: 'กระดาษซับเลือดที่มีหยดเลือดช้ำ (ผิดปกติ)' },
  //  { value: '3', text: 'กระดาษซับเลือดที่มีวงเลือดชนกัน (ผิดปกติ)' },
  //  { value: '4', text: 'กระดาษซับเลือดที่ถูกสัตว์/แมลงกัดแทะ (ผิดปกติ)' },
  //  { value: '5', text: 'กระดาษซับเลือดที่มีการปนเปื้อน (ผิดปกติ)' },
  //  { value: '6', text: 'กระดาษซับเลือดที่ขึ้นรา (ผิดปกติ)' },
  //  { value: '7', text: 'กระดาษซับเลือดที่เลือดไม่ซึม (ผิดปกติ)' },
  //  { value: '0', text: 'อื่น ๆ' },
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
  //  { value: '17', text: 'อื่นๆ' },

  //]

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
        this.userID = user.data.SecurityUsers.UserID;
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

    this.Loaddata();
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
    this.rangeForm.patchValue({ documentStatus: 'Shipment' });

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

    //////FunctionBefore
    //const item = {
    //  sqlSelect: `it.*, MSSite.SiteName As SiteName, emp.FirstName + ' ' + emp.LastName as EmployeeName` +
    //    `, (select top 1 isnull(title, '') + isnull(firstname + ' ', '') + isnull(lastname, '') from requests where requests.SentSampleID = it.SentSampleID order by requests.LabNumber asc) as PatientNameLists`,
    //  sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
    //    `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)`,
    //  sqlWhere: `(isnull(it.DocumentStatus, '') != 'Draft')`,
    //  sqlOrder: ` it.SentSampleDate Desc `,
    //  pageIndex: -1
    //};

    ////const range = this.utilService.getDateRange(this.rangeSelectedValue);
    ////if (range) {
    ////  const startDate = this.datepipe.transform(range.start, 'yyyyMMdd');
    ////  const endDate = this.datepipe.transform(range.end, 'yyyyMMdd');
    ////  item.sqlWhere += item.sqlWhere ? ` and (it.sentSampleDate between '${startDate}' and '${endDate}')` : ` (it.sentSampleDate between '${startDate}' and '${endDate}')`;
    ////}


    //////Function After
    const item = {
      sqlSelect: `  `,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)` +
        `Left Outer Join Requests as req On (req.SentSampleID = it.SentSampleID)`+
        `Left Outer Join Refuse_verification as refv On (refv.Value = req.FilterPaperCompleteness)` ,
      sqlWhere: `(isnull(it.DocumentStatus, '') != 'Draft')`,
      //sqlWhere: ` 1 = 1 `,
      sqlOrder: ` it.SentSampleDate Desc `,
      pageIndex: -1
    };

    //const range = this.utilService.getDateRange(this.rangeSelectedValue);
    const range = this.rangeForm.value;
    //console.log('This range หหหหหหหหหหห=> ', range);


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


    //////เช็ค Site
    if (siteID != '') {
      //console.log('Thsi siteID => ', siteID);
      item.sqlWhere += item.sqlWhere ? ` and  req.SiteID = '${siteID}' ` : `  req.SiteID = '${siteID}'  `;
    }

    //////เช็ควันที่นำส่ง
    if (fromSentSampleDate && toSentSampleDate) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.sentSampleDate, 112) between '${fromSentSampleDate}' and '${toSentSampleDate}') `;
    } else if (fromSentSampleDate) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.sentSampleDate, 112) >= '${fromSentSampleDate}') `;
    } else if (toSentSampleDate) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), it.sentSampleDate, 112) <= '${toSentSampleDate}') `;
    }


    //////เช็ควันเกิด
    if (fromBirthday && toBirthday) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.Birthday, 112) between '${fromBirthday}' and '${toBirthday}') `;
    } else if (fromBirthday) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.Birthday, 112) >= '${fromBirthday}') `;
    } else if (toBirthday) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.Birthday, 112) <= '${toBirthday}') `;
    }

    ////เช็ควันที่รับตัวอย่าง
    if (fromReceiveSampleDate && toReceiveSampleDate) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.ReceiveDate, 112) between '${fromReceiveSampleDate}' and '${toReceiveSampleDate}') `;
    } else if (fromReceiveSampleDate) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.ReceiveDate, 112) >= '${fromReceiveSampleDate}') `;
    } else if (toReceiveSampleDate) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(convert(varchar(10), req.ReceiveDate, 112) <= '${toReceiveSampleDate}') `;
    }

    /////เช้ค HN
    if (hN) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(req.hN = '${hN}') `;
    }


    ////เช็คบัตรประชาชน
    if (identityCard) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(req.identityCard = '${identityCard}') `;
    }


    /////เช็คสถานะ
    if (documentStatus) {
      //console.log('documentStatus => ',documentStatus);
      //console.log('This rangeData.documentStatus => ', rangeData.documentStatus);
      if (documentStatus !== 'All') {
        item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(req.RequestStatus = '${documentStatus}') `;
      }
    }


    /////เช็คสัญชาติ
    if (nationality) {
      if (nationality == 'thaiOnly') {
        item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(req.Nationality = 'thai') `;
      } else if (nationality == 'foreignerOnly') {
        item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + `(req.Nationality = 'Foreigner') `;
      }
    }



    /////เช็คเลขที่ใบนำส่ง
    if (fromSentSampleNo && toSentSampleNo) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + ` (it.SentSampleNo between '${fromSentSampleNo}' and '${toSentSampleNo}') `;
    } else if (fromSentSampleNo) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + ` (it.SentSampleNo >= '${fromSentSampleNo}') `;
    } else if (toSentSampleNo) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + ` (it.SentSampleNo <= '${toSentSampleNo}') `;
    }




    /////Labnumber
    if (fromLabNumber && toLabNumber) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + ` (req.labNumber between '${fromLabNumber}' and '${toLabNumber}') `;
    } else if (fromLabNumber) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + ` (req.labNumber >= '${fromLabNumber}') `;
    } else if (toLabNumber) {
      item.sqlWhere += (item.sqlWhere ? ` and ` : ``) + ` (req.labNumber <= '${toLabNumber}') `;
    }


    ///////ResultData
    this.spinner.show();
    this.sentSampleService.getLISSentSampleHDByCondition2(item)
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        //this.dataSource.data = res['data'].LISSentSampleHDs as LISSentSampleHDModel[];
        const data = this.utilService.camelizeKeys(res.data);
        //console.log('TestData => ', data.lISSentSampleHDs);
        /*console.log('เข้าๆๆ',data);*/
        console.log('', data.lISSentSampleHDs);
        this.itemLists = data.lISSentSampleHDs;

        this.spinner.hide();
      },
        (err) => {
        this.spinner.hide();
          return this.handleError(err);
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
    this.dataSource.sort = this.sort;
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
    //console.log('tttt => ', this.rangeForm);
    this.uploaded.emit(this.rangeForm);



    //this.getData();
    console.log('', this.getData());

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




    /// ฟังก์ชั่นพิมพ์อัติโนมัติ
    const querySelect = ` Select  CheckPrintBrcode
                        From Security_Users
                        Where UserID = '${this.userID}'
                         `;
    const response = this.sentSampleService.query({ queryString: querySelect });
    response.then(data => {
      for (let el of data.data.response) {
        if (el.checkPrintBrcode == 1) {
          this.ThisPrintBarcodeMultiple();
        } else {
        }

      }
    });


  }

  isAllSelected() {
    return this.selection.selected.length > 0;
  }
  ThisPrintBarcodeMultiple = () => {
    //console.log('sssssssss');
    //console.log('this.selection.selected.length  => ', this.selection.selected.length);

    if (this.selection.selected.length > 0) {
      let where = ` 1=1 `;
      let requestIDs: string[] = [];

      for (let el of this.selection.selected) {
        requestIDs.push(`'${el.requestID}'`);
      }

      if (requestIDs.length > 0) {
        where += ` and it.RequestID in (${requestIDs.join(',')})`;
      }

      //console.log('where => ', where);

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
    this.selection.clear();
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

    this.itemLists.forEach(x => {
      if (this.requester == 'sent-sample') {
        // กรณีลงทะเบียน & สร้างใบนำส่ง
        if (x.shipmentNo || x.isNew || x.isEdit || x.requestStatus?.toLowerCase() != 'draft') {
          x.isSelected = false;
        } else {
    //console.log('evev => 1', ev);
          x.isSelected = ev.checked;
        }
      } else {
    //console.log('evev => 2', ev);
        x.isSelected = ev.checked;
      }
    });



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



  doSaveReceiptClick = (ev:any) => {

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
    if (selectedValue == 'Rejected'){
      //this.isDisabled = false;
      $('#input-paperResult').removeAttr('disabled');
      this.optionsForm.patchValue({ paperResult: '1' });
    }

  }

  setRowSelectedCheck($event) {
    //console.log('Event => ', $event);

  }

  //isAllSelected() {
  //  //console.log('This Selected');
  //  console.log('this.selection.selected => ', this.selection.selected.length);
  //  return this.selection.selected.length == 0;
  //}

  masterToggle() {

    this.isAllSelected() ?

      this.selection.clear() :
      this.itemLists.forEach((row) => {

        this.selection.select(row);
        
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


  checkboxauto = () => {
    this.isCheckedauto = !this.isCheckedauto;
    if (this.isCheckedauto) {
      //console.log('มีต้กอยู่');
      const query = ` update Security_Users
                      set CheckPrintBrcode = 1
                        Where UserID = '${this.userID}'
                         `;
      const response = this.sentSampleService.query({ queryString: query });
      this.notiService.showSuccess('บันทึกข้อมูลสำเร็จ');
    } else {
      //console.log('ติ้กออก');
      const query = ` update Security_Users
                      set CheckPrintBrcode = 0
                        Where UserID = '${this.userID}'
                         `;
      const response = this.sentSampleService.query({ queryString: query });
      this.notiService.showSuccess('บันทึกข้อมูลสำเร็จ');
    }

  }

  Loaddata = () => {
    const querySelect = ` Select  CheckPrintBrcode
                        From Security_Users
                        Where UserID = '${this.userID}'
                         `;
    const response = this.sentSampleService.query({ queryString: querySelect });
    response.then(data => {
      for (let el of data.data.response) {
        if (el.checkPrintBrcode == 1) {
          this.isCheckedauto = true;
        } else {
          this.isCheckedauto = false;
        }

      }

    });
  }



}

export interface IConfirmDeliveredBulk {
  orderno: string;
  trackingno: string;
  status: string;
  status_date;
}


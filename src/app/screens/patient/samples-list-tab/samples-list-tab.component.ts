import { RepositoryService } from '@app/shared/repository.service';
import { Component, OnInit, Input, EventEmitter, Output, DoCheck, IterableDiffers, ViewChild, TemplateRef, ViewEncapsulation, ChangeDetectionStrategy, AfterViewChecked, ChangeDetectorRef, AfterContentChecked, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { MSLabProfileModel, MSLabSampleTypeModel } from '@app/models';
import { RaceModel } from '@app/models/race.model';
import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
import { RequestsModel } from '@app/models/requests.model';
import { AddnewRaceComponent } from '@app/screens/request-sample/addnew-race/addnew-race.component';
import { ModalService } from '@app/screens/request-sample/modal.service';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { AuthenticationService, UtilitiesService } from '@app/services';
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
import { AmphurPickComponent, DistrictPickComponent, MslabProfilePickerComponent, MssitePickerComponent, ProvincePickComponent, SampleTypePickerComponent } from '@app/pickers';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { cloneDeep as _cloneDeep, differenceWith as _differenceWith, isEqual as _isEqual } from 'lodash';
import { xlsExportHyperlinks } from 'devexpress-reporting/scopes/reporting-export-metadata';

declare var $: any;
@Component({
  selector: 'app-samples-list-tab',
  templateUrl: './samples-list-tab.component.html',
  styleUrls: ['./samples-list-tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SamplesListTabComponent extends BaseComponent
  implements OnInit, DoCheck, AfterViewChecked, AfterContentChecked, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('closebutton') closebutton;
  @ViewChild('requestsPatientTemplate') popupEdit: TemplateRef<any>;

  @Input() public dataSource = new MatTableDataSource<RequestsModel>();
  @Input() public canNew: boolean = true;
  @Input() public requester: string = '';
  @Input() range: FormGroup;
  @Input() referenceName: string = '';
  @Input() itemsForm: FormArray;
  @Input() sentSampleForm: FormGroup;
  @Input() itemLists: RequestsModel[];
  @Input() itemToDelete: Array<RequestsModel>;
  @Input() requestFomsArray: FormArray;
  @Input() readOnly: boolean = false;
  @Input() multiSelection: boolean = true;

  @Output() itemListsChange: EventEmitter<RequestsModel[]> = new EventEmitter();
  @Output() itemsChangeEvent = new EventEmitter();
  @Output() public action = new EventEmitter();
  @Output() public editShipment = new EventEmitter<any>();
  listPageSizes = [20, 50, 100, 200, 300, 500];
  public pageListConfig: any;
  public displayedColumns: string[] =
    [
      'id', 'SentSampleDate',
      'NumberOfSamples', 'SiteName', 'UserName', 'EmployeeName', 'PatientName',
      'status', 'details', 'delete'
    ];

  private defaultValue = {
    siteID: '',
    siteName: '',
    userName: '',
    employeeID: '',
    employeeName: '',
    officerName: '',
    sentToSiteID: '',
    sentToSiteName: '',
    forScienceCenter: false,
    forDepartureHospital: false,
  };

  sampleTypes = [
    { value: 'Paper', text: 'กระดาษ' },
    { value: 'Serum', text: 'ซีรั่ม' },
  ];

  itemSelection = new SelectionModel<any>(true, []);
  moreFormsAll: FormArray;
  requestsForm: FormGroup;
  modalRef: BsModalRef;
  clEdit1: string = 'd-none';
  clEdit2: string = '';
  clEdit3: string = '';
  currentIndex: number = -1;
  currentRequestId: string = '';
  currentUniqueId: string = '';

  originalItems: Array<RequestsModel> = [];

  differ: any;
  public age: number;
  public ageInHours: number;
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
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    // private bsModalService: BsModalService,
  ) {
    super();
    this.differ = differs.find([]).create(null);

    this.originalItems = _cloneDeep(this.itemLists);

    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.defaultValue.siteID = user?.data?.SecurityUsers?.SiteID;
        this.defaultValue.siteName = user?.data?.SecurityUsers?.SiteName;
        this.defaultValue.employeeID = user?.data?.SecurityUsers?.EmployeeID;
        this.defaultValue.sentToSiteID = user?.data?.SecurityUsers?.ParentSiteID;
        this.defaultValue.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;
        this.defaultValue.officerName = user?.data?.SecurityUsers?.OfficerName;
      }
    });

    this.pageListConfig = {
      id: `itemListPage`,
      itemsPerPage: 20,
      currentPage: 1,
      totalItems: this.dataSource?.data?.length
    };


  }

  ngAfterViewInit(): void {
    // this.changeDetectorRef.detectChanges();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterContentChecked(): void {
    // this.changeDetectorRef.detectChanges();
  }

  getChanges() {
    let changedItems = [];
    changedItems = _differenceWith(this.itemLists, this.originalItems, _isEqual);

    // console.log('changedItems => ', changedItems);
    // console.log('originalItems => ', this.originalItems);
    // console.log('itemLists => ', this.itemLists);
  }

  public customSort = (event) => {
    console.log(event);
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

  public highlightRow(item: any) {
    // this.selectedItem = item;
    this.itemSelection.toggle(item);
    //console.log('item => ', this.itemSelection.toggle(item));
  }

  editRequests = (id: string) => {
    const model: RequestsModel = {} as RequestsModel;
    model.requestID = id;
    sessionStorage.setItem('RequestsSampleDataStorage', JSON.stringify(model));
    // this.router.navigate(['/request-sample/edit']);
    this.router.navigate(['register-sample', 'create', 'register'],
      { queryParams: { id: 'edit' } });
  }

  addNewRow(index: number) {
    this.router.navigate(['register-sample', 'create', 'register'],
      { queryParams: { id: 'new' } });

    return;

    const requests = new RequestsModel();
    requests.siteID = this.range?.value?.siteID;
    requests.requestStatus = 'Draft';
    requests.objectState = 1;
    requests.siteID = this.defaultValue.siteID;
    requests.siteName = this.defaultValue.siteName;
    // requests.bloodWorker = this.defaultValue.officerName;

    this.itemLists.push(requests);
    const p = Number(this.itemLists.length / this.pageConfig.itemsPerPage);   // จำนวนเพจทั้งหมด
    const decimals = p - Math.floor(p); // ทศนิยมของเพจทั้งหมดที่คำนวณได้

    if (Number(decimals.toFixed(2)) > 0) {
      this.pageConfig.currentPage = Math.floor(p) + 1;  // ถ้ามีเศษทศนิยม ให้ไปที่ page+1 (lastPage)
    } else {
      this.pageConfig.currentPage = Math.floor(p);  // หารลงตัว ไปที่ lastPage
    }

    this.itemListsChange.emit(this.itemLists);
    // this.openModalEdit(this.popupEdit, this.itemLists.length - 1);
    this.openModalEdit(this.popupEdit, this.itemLists[this.itemLists.length - 1]);
    return true;
  }

  onCheckedChange = (ev: any, item: any) => {
    //console.log('requester => ', this.requester);

    //this.requestsForm.get('hdrequestID').setValue(item.requestID);



    //console.log('Item => ', item);
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

  doEditShipment = (item: any) => {
    console.log('emit => ', item);
    this.editShipment.emit(item);
  }

  async openModalEdit(template: TemplateRef<any>, item: any) {
    this.selectedIndex = 0;
    // this.currentIndex = idx;
    this.currentIndex = this.itemLists.indexOf(item);

    const model = item as RequestsModel; // this.itemLists[idx];
    this.itemSelection.toggle(model);

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

    const babeDateOfBirth = this.requestsForm.get('babeDateOfBirth')?.value;
    const babeBloodDrawDate = this.requestsForm.get('babeBloodDrawDate')?.value;

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

      babeDateOfBirth: babeDateOfBirth ? new Date(babeDateOfBirth) : null,
      babeBloodDrawDate: babeDateOfBirth ? new Date(babeBloodDrawDate) : null,
      sendTestTimes: this.requestsForm.get('sendTestTimes')?.value ?? 1
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

  doCheckValidData = async (model: RequestsModel): Promise<boolean> => {
    // model.babeTwinNo = +model.babeTwinNo;
    model.appCode = 'down';

    let errors = '';
    if (!model.firstName || !model.lastName) {
      errors = `<li>"ชื่อ-นามสกุล [มารดา]"</li>`;
    }
    // if ((!model.identityCard) && (model.momNationality == 'Thai')) {
    //   errors += `<li>"บัตรประชาชน [มารดา]"</li>`;
    // }
    // if (!model.momMobileNo) {
    //   errors += `<li>"โทรศัพท์มือถือ [มารดา]"</li>`;
    // }

    if (errors) {
      Swal.fire({
        icon: 'error',
        title: `กรุณาตรวจสอบค่าว่าง`,
        html: `<ul style="list-style-type:circle; text-align: left;">${errors}</ul>`
      }).then(() => {
        this.selectedIndex = 0;
      });

      return false;
    }

    // if (!model.babeHn) {
    //   errors += `<li>"HN [ทารก]"</li>`;
    // }
    // if (!model.babeWeight) {
    //   errors += `<li>"น้ำหนัก (g) [ทารก]"</li>`;
    // }
    // if (!model.momGaAgeWeeks) {
    //   errors += `<li>"อายุครรภ์เมื่อคลอด (week) [ทารก]"</li>`;
    // }
    // if (!model.babeDateOfBirth) {
    //   errors += `<li>"วันเดือนปีเกิด [ทารก]"</li>`;
    // }
    // if (!model.babeBloodDrawDate) {
    //   errors += `<li>"วันเจาะเลือด [ทารก]"</li>`;
    // }

    if (errors) {
      Swal.fire({
        icon: 'error',
        title: `กรุณาตรวจสอบค่าว่าง`,
        html: `<ul style="list-style-type:circle; text-align: left;">${errors}</ul>`
      }).then(() => {
        this.selectedIndex = 1;
      });

      return false;
    }


    return true;
  }

  async saveChangeSample(onCloseClick = false) {
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
    // model.isEdit = true;
    this.itemLists[this.currentIndex] = Object.assign({}, model);

    if (!onCloseClick) {
      // ถ้ากดปุ่มปิด ไม่ต้องเช็ค valid
      const valid = await this.doCheckValidData(model);
      if (!valid) {
        return;
      }
    }

    const model1 = this.itemLists[this.currentIndex];
    this.itemSelection.toggle(model1);

    $('#requestsPatientTemplate').modal('hide');
    this.modalRef.hide();
    if (!onCloseClick) {
      this.updateData();    // saveChange to database
    }
    this.selectedIndex = 0;

    this.getChanges();
  }

  onCloseProfile = () => {
    // this.modalRef.hide();
    this.saveChangeSample(true);
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

    //console.log('this.itemLists = :> ', this.itemLists);


    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.defaultValue.siteID = user?.data?.SecurityUsers?.SiteID;
        this.defaultValue.siteName = user?.data?.SecurityUsers?.SiteName;
        this.defaultValue.employeeID = user?.data?.SecurityUsers?.EmployeeID;
        this.defaultValue.sentToSiteID = user?.data?.SecurityUsers?.ParentSiteID;
        this.defaultValue.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;
        this.defaultValue.forDepartureHospital = user?.data?.SecurityUsers?.ForDepartureHospital;
        this.defaultValue.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;




        if (this.defaultValue.forDepartureHospital == true && this.defaultValue.forScienceCenter == true
          || this.defaultValue.forDepartureHospital == false && this.defaultValue.forScienceCenter == true) {
          //console.log('wwwww111');
          this.clEdit1 = '';
          this.clEdit2 = 'd-none';
          this.clEdit3 = 'd-none';
        }
        if (this.defaultValue.forDepartureHospital == true && this.defaultValue.forScienceCenter == false) {
          //console.log('wwww222');
          this.clEdit1 = 'd-none';
          this.clEdit2 = '';
        }


      }
    });

    this.firstFormGroup = this.fb.group({
      fnameCtrl: ['', Validators.required],
      lnameCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      addressCtrl: ['', Validators.required]
    });

    if (this.itemLists === undefined) {
      // console.log('sss')
      this.itemLists = new Array<RequestsModel>();
    }

    this.requestsForm = this.fb.group(new RequestsModel());
    this.createInitialForm();
    this.doLoadRace();
    this.doLoadGARange();

    // tslint:disable-next-line: deprecation
    this.requestsForm.valueChanges.subscribe((data) => {
    });



    //this.pageListConfig.currentPage = 1;
   /* document.getElementById('itemListPage').click();*/
    //this.pageListChanged(1);
    //console.log('this.itemLists => ');

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
    console.log('itemlist => ', this.itemLists);
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
    // this.calculateAge(event);
    this.calculateAgeInHours()
  }

  onDateAndTimeChange() {
    this.calculateAgeInHours()
  }

  // คำนวณอายุ
  public calculateAge = (birthday: Date) => {
    if (birthday) {
      const timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      this.age = 0;
    }
    return this.age;
  }

  public calculateAgeInHours = () => {
    const babeDateOfBirth = this.requestsForm.get('babeDateOfBirth').value;
    const babeTimeOfBirth = this.requestsForm.get('babeTimeOfBirth').value;

    let [dobHours, dobMinutes] = (babeTimeOfBirth ?? '00:00').split(':');
    dobHours = +dobHours;
    dobMinutes = +dobMinutes || 0;
    const birthDate = !babeDateOfBirth ? null : new Date(babeDateOfBirth.getFullYear(), babeDateOfBirth.getMonth(), babeDateOfBirth.getDate(), dobHours, dobMinutes);
    birthDate?.setTime(birthDate.getTime() + 7 * 60 * 60 * 1000);

    const babeBloodDrawDate = this.requestsForm.get('babeBloodDrawDate').value;
    const babeBloodDrawTime = this.requestsForm.get('babeBloodDrawTime').value;

    let [bloodHours, bloodMinutes] = (babeBloodDrawTime ?? '00:00').split(':');
    bloodHours = +bloodHours;
    bloodMinutes = +bloodMinutes || 0;
    const bloodDate = !babeBloodDrawDate ? null : new Date(babeBloodDrawDate.getFullYear(), babeBloodDrawDate.getMonth(), babeBloodDrawDate.getDate(), bloodHours, bloodMinutes);
    bloodDate?.setTime(bloodDate.getTime() + 7 * 60 * 60 * 1000);

    // console.log('dob => ', birthDate, ' :: bloodDate => ', bloodDate);
    if (!birthDate || !bloodDate) {
      this.ageInHours = 0;
    } else {
      const milliseconds = bloodDate.valueOf() - birthDate.valueOf();
      const hours = milliseconds / 1000 / 60 / 60; // Convert milliseconds to hours

      // let seconds = Math.floor(milliseconds / 1000);
      // let minutes = Math.floor(seconds / 60);
      // const hours = Math.floor(minutes / 60);

      this.ageInHours = hours;
    }

    this.ageInHours = parseFloat(this.ageInHours.toFixed(2));
    this.requestsForm.patchValue({ ageInHours: this.ageInHours });
    return this.ageInHours;
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
    } else {
      this.toastrNotiService.clear(this.toastGaRef?.toastId);
    }
  }

  public removeGaToast = () => {
    this.toastrNotiService.clear(this.toastGaRef?.toastId);
  }

  updateProfile(id: string) {
    const model: RequestsModel = {} as RequestsModel;
    model.requestID = id;
    sessionStorage.setItem('RequestsSampleDataStorage', JSON.stringify(model));
    this.router.navigate(['./request-sample/edit']);
  }

  onDeleteItem(item: any) {
    Swal.fire({
      title: 'คุณต้องการลบรายการใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        const deletedItem = item as RequestsModel; // this.itemLists[idx];
        if (deletedItem.objectState == 2) {
          deletedItem.objectState = -2;
        } else if (deletedItem.objectState == 1) {
          deletedItem.objectState = -9;
        }

        const dataDelete = {
          Requests: new Array<RequestsModel>(),
        }
        dataDelete.Requests = [Object.assign({}, deletedItem)];

        // delete
        this.spinner.show();
        this.requestsRepoService.saveRequests(dataDelete)
          .subscribe((res) => {
            this.spinner.hide();
            this.toastrService.success('ลบข้อมูลสำเร็จ');
            // this.notiService.showSuccess('Save Successfully.');
            // this.doPostSaveRequests(res);

            this.itemLists = this.itemLists.filter(e => (e.objectState !== -2 && e.objectState !== -9));
            this.requestsForm.get('numberOFSamples').patchValue(this.itemLists.length);
            // this.updateData();

          }, (err) => {
            this.spinner.hide();
            console.log('Save error >> ', err);
            // return this.handleError(err);
          });
      }
    });
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

  public onSelected(): void {
    if (!this.itemSelection) {
      Swal.fire({
        icon: 'error',
        text: 'กรุณาเลือกสินค้าอย่างน้อย 1 รายการ',
        allowOutsideClick: false,
      }).then(() => {
        // document.getElementById('customerCode')?.focus();
      });

      return;
    }

    this.action.emit({ selectedItems: this.itemSelection, isCancel: false });

    // if (this.isMultiSelect) {
    //   this.action.emit({ selectedItems: this.itemSelection, isCancel: false });
    // } else {
    //   this.action.emit({ selectedItem: this.selectedItem, isCancel: false });
    // }

    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }

  isAllCheckBoxChecked() {
    if (this.itemLists.length == 0) {
      return false;
    }
    return this.itemLists.every(p => p.isSelected);
  }

  checkAllCheckBox(ev: any) {

    for (let el of this.itemLists) {
      console.log('ell => ', el.inputCompleted);
    }

    this.itemLists.forEach(x => {
      if (x.requestStatus == 'Pending') {
        x.isSelected = ev.checked;
      }

       if (this.requester == 'sent-sample') {
         ///// กรณีลงทะเบียน & สร้างใบนำส่ง
          if (x.shipmentNo || x.isNew || x.isEdit || x.requestStatus?.toLowerCase() != 'draft') {
            x.isSelected = false;
          } else {
            x.isSelected = ev.checked;
          }
       } else {
         x.isSelected = ev.checked;
       }
    });
  }

  openMSSitePicker() {
    const initialState = {
      list: [
        // this.requestsForm.get('siteCode').value
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
        this.requestsForm.patchValue({
          siteID: value.selectedItem['SiteID'],
          siteName: value.selectedItem['SiteName'],

          sentToSiteID: value.selectedItem['ParentSiteID'],
          sentToSiteName: value.selectedItem['ParentSiteName'],
        });
      },
        (err: any) => {
          console.log(err);
        });

  }

  onPrintBarcodeClick = async (item: any) => {
    this.goToReport('LabNoBarcodeReport', item);
  }

  //goToReport(reportName: string, item: any) {
  //  const encryptedData = this.encryptUsingAES256({
  //    reportName,
  //    parameters: {
  //      sqlWhere: `it.sampleno='${item.labNumber}'`,
  //    }
  //  });

  //  const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
  //    {
  //      queryParams:
  //      {
  //        data: encryptedData,
  //      }
  //    });


  //  const baseUrl = window.location.href.replace(this.router.url, '');
  //  window.open(baseUrl + newRelativeUrl, '_blank');
  //}

  onCMClick = (item: RequestsModel) => {
    console.log('xx', item);

    // Swal.fire({
    //   title: item.receiptRemark
    // })
  }

  onOpenProvincePick = () => {
    const initialState = {
      list: [
        // this.requestsForm.get('siteCode').value
      ],
      whereClause: `it.SiteFlag != 'P'`,
      title: 'จังหวัด',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(ProvincePickComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        console.log('value => ', value);
        if (!value || value.isCancel) { return; }
        this.requestsForm.patchValue({
          province: value.selectedItem['provinceName'],
          amphur: ``,
          district: ``
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

  onOpenAmphurPick = () => {
    const province = this.requestsForm.get('province').value;
    let sqlWhere = ``;

    if (province) {
      sqlWhere += `ProvinceName = '${province}' `;
    }

    const initialState = {
      list: [
        // this.requestsForm.get('siteCode').value
      ],
      whereClause: sqlWhere,
      title: 'จังหวัด',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(AmphurPickComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        console.log('value => ', value);
        if (!value || value.isCancel) { return; }
        this.requestsForm.patchValue({
          amphur: value.selectedItem['amphurName'],
          province: value.selectedItem['provinceName'],
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

  onOpenDistrictPick = () => {
    const province = this.requestsForm.get('province').value;
    const amphur = this.requestsForm.get('amphur').value;
    let sqlWhere = ``;

    if (province && amphur) {
      sqlWhere += `ProvinceName = '${province}' AND AmphurName = '${amphur}' `;
    } else if (province) {
      sqlWhere += `ProvinceName = '${province}' `;
    } else if (amphur) {
      sqlWhere += `AmphurName = '${amphur}' `;
    }

    const initialState = {
      list: [
        // this.requestsForm.get('siteCode').value
      ],
      whereClause: sqlWhere,
      title: 'จังหวัด',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(DistrictPickComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        console.log('value => ', value);
        if (!value || value.isCancel) { return; }
        this.requestsForm.patchValue({
          district: value.selectedItem['districtName'],
          amphur: value.selectedItem['amphurName'],
          province: value.selectedItem['provinceName'],
        });
      },
        (err: any) => {
          console.log(err);
        });
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
  handlePageSizeChange(event): void {
    console.log('event => ', event);
    this.pageListConfig.currentPage = 1;
  }
  pageListChanged(event: any) {
    console.log('event page => ',typeof event);
    this.pageListConfig.currentPage = event;
  }


}
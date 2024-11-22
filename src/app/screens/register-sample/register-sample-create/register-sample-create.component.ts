import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthenticationService, ToastrNotificationService, UtilitiesService } from '@app/services';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
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
import { RaceModel } from '@app/models/race.model';
import { PrefixModel } from '@app/models/prefix.model';
//import { DoctorModel } from '@app/models/prefix.model';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { MssitePickerComponent } from '@app/pickers/mssite-picker/mssite-picker.component';
import Swal from 'sweetalert2';
import { EmGAReferenceRangeModel } from '@app/models/emgareferencerange.model';
import { RepositoryService } from '@app/shared/repository.service';
import { retry } from 'rxjs/operators';
import { AddnewRaceComponent } from '@app/screens/request-sample/addnew-race/addnew-race.component';
 import { AddnewDoctorComponent } from '@app/screens/request-sample/addnew-doctor/addnew-doctor.component';
import { MpAppSettingsService } from '@app/screens/app-settings/mp-app-settings.service';
//import CardReaderLibrary from 'card-reader-library';
import { HttpClient } from '@angular/common/http';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
//import { BLACK_ON_WHITE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';

defineLocale('th', thBeLocale);

@Component({
  selector: 'app-register-sample-create',
  templateUrl: './register-sample-create.component.html',
  styleUrls: ['./register-sample-create.component.scss']
})
export class RegisterSampleCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() forScienceCenter: boolean = true;
  localIPAddress: string = '';
  clsnone: string = '';
  cardData: any;
  selectedOption: string;
  testFunction: string;
  inputValueWeek: any;

  StringFullName: string = '';
  inputValueDay: any;
  docclass1: string = '';
  docclass2: string = 'd-none';

  public patientForm: FormGroup; // ข้อมูลคนไข้
  public requestsForm: FormGroup;
  public patientMoreForm: FormGroup;
  optionsForm: FormGroup;
  testtttttttt: FormGroup;
  public patientMoreLists: Array<RequestsPatientMoreModel>;
  private patientDTO: PatientDTO;
  private requestsDTO: RequestsDTO;

  public numberOfBabiesDisable = true;

  public DoctorNamelists = [];
  public DoctorNamelists2 = [];


  bsConfig: Partial<BsDatepickerConfig>;
  myDateValue: Date;
  private isUpdated: boolean = false;
  public age: number;
  public races: Array<RaceModel>;
  public prefixs: Array<PrefixModel>;
  //public doctors: Array<PrefixModel>;
  public doctors: Array<PrefixModel> = [];  // Initialize the array
  public gARanges: Array<EmGAReferenceRangeModel>;
  toastGaRef: any;
  isReadOnly: boolean;
  CheckMode: string;
  CheckInsert: string;

  fromOrigin: string = '';

  defaultValue = {
    siteID: '',
    siteName: '',
    deliveryByThaiPost: 'N',
    userName: '',
    officerName: '',
    userTel: '',
    employeeID: '',
    employeeName: '',
    sentToSiteID: '',
    sentToSiteName: '',
    forDepartureHospital: false,
    forScienceCenter: false,
    deliveryAppointLocation: ''
  };

  private siteInfo = {
    siteName: '',
    siteAddress: '',

    shipperAddress: '',
    shipperDistrict: '',
    // siteAmphur: '',
    shipperProvince: '',
    shipperZipcode: '',
    shipperMobile: '',

    siteFloorNo: '',
    siteBuilding: '',
    siteRunPrefix: '',

    cusName: '',
    cusAddress: '',
    cusDistrict: '',
    cusProvince: '',
    cusZipCode: '',
    cusTel: '',
    custRemark: '',
  }

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private notiService: ToastrNotificationService,
    private requestsRepoService: RequestsRepoService,
    private localeService: BsLocaleService,
    private modalService: BsModalService,
    private utilService: UtilitiesService,
    private repoService: RepositoryService,
    private appSettingsService: MpAppSettingsService,
    private readonly cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private sentSampleService: SentSampleService,
  ) {
    super();

    

    this.fromOrigin = this.route.snapshot.paramMap.get('fromOrigin');
    console.log('fromOrigin => ', this.fromOrigin);

    this.localeService.use('th');

    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.defaultValue.userName = user.data.SecurityUsers.UserName;
        this.defaultValue.officerName = user.data.SecurityUsers.OfficerName;
        this.defaultValue.userTel = user.data.SecurityUsers.Tel;
        this.defaultValue.siteID = user.data.SecurityUsers.SiteID;
        this.defaultValue.siteName = user.data.SecurityUsers.SiteName;
        this.defaultValue.deliveryByThaiPost = user.data.SecurityUsers.DeliveryByThaiPost;
        this.defaultValue.employeeID = user.data.SecurityUsers.EmployeeID;
        this.defaultValue.employeeName = user.data.SecurityUsers.EmployeeName;
        this.defaultValue.sentToSiteID = user.data.SecurityUsers.ParentSiteID;
        this.defaultValue.sentToSiteName = user.data.SecurityUsers.ParentSiteName;
        this.defaultValue.forDepartureHospital = user.data?.SecurityUsers?.ForDepartureHospital;
        this.defaultValue.forScienceCenter = user.data?.SecurityUsers?.ForScienceCenter;
        this.defaultValue.deliveryAppointLocation = user.data?.SecurityUsers?.DeliveryAppointLocation;

        // this.runPrefix = user.data.SecurityUsers.RunPrefix ?? '';

        this.siteInfo.siteName = user.data.SecurityUsers.SiteName ?? '';
        this.siteInfo.siteAddress = user.data.SecurityUsers.SiteAddress ?? '';
        // this.siteInfo.siteDistrict = user.data.SecurityUsers.SiteDistrict ?? '';
        this.siteInfo.shipperDistrict = user.data.SecurityUsers.SiteAmphur ?? ''; 
        this.siteInfo.shipperProvince = user.data.SecurityUsers.SiteProvince ?? '';
        this.siteInfo.shipperZipcode = user.data.SecurityUsers.SitePostCode ?? '';
        this.siteInfo.shipperMobile = user.data.SecurityUsers.SiteTel ?? '';
        this.siteInfo.siteFloorNo = user.data.SecurityUsers.SiteFloorNo ?? '';
        this.siteInfo.siteBuilding = user.data.SecurityUsers.SiteBuilding ?? '';
        this.siteInfo.siteRunPrefix = user.data.SecurityUsers.RunPrefix ?? '';

        this.siteInfo.shipperAddress = user.data.SecurityUsers.ShipperAddress ?? '';
        this.siteInfo.cusName = user.data.SecurityUsers.CusName ?? '';
        this.siteInfo.cusAddress = user.data.SecurityUsers.CusAddress ?? '';
        this.siteInfo.cusDistrict = user.data.SecurityUsers.CusDistrict ?? '';
        this.siteInfo.cusProvince = user.data.SecurityUsers.CusProvince ?? '';
        this.siteInfo.cusZipCode = user.data.SecurityUsers.CusZipCode ?? '';
        this.siteInfo.cusTel = user.data.SecurityUsers.CusTel ?? '';
        this.siteInfo.custRemark = user.data.SecurityUsers.CustRemark ?? '';
      }
     
      

      //console.log('user => ', user?.data?.SecurityUsers);
      //console.log('site-info => ', this.siteInfo);
    });

  }

  ngAfterViewInit(): void {
    this.onPregnancyRadioChange(this.requestsForm.controls['pregnantFlag'].value);
    this.onPregnantTypeRadioChange(this.requestsForm.controls['pregnantType'].value);
    const range = this.utilService.getDateRange('Today');
  
  }
  ngOnInit(): void {

    //this.requestsForm.get('hdtestfunction').setValue('registersample');
    //let hdnat = (document.getElementById("hdnat") as HTMLInputElement).value;
    //console.log('hdnateeeee =>', hdnat);
    this.getRefuse_verification();

  
 


    $("#btndatepicker1").prop("disabled", true);
    $("#btndatepicker2").prop("disabled", true);
    $("#btndatepicker3").prop("disabled", true);
    this.authService.currentUser.subscribe((user: any) => {
      if (user?.data?.SecurityUsers.ForDepartureHospital == true && user?.data?.SecurityUsers.ForScienceCenter == false) {
        (document.getElementById("input-labnumber") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-2") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-sampleDate") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-shiptoNo") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-externalNo") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-saveDate") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-profile") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-sampletype") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-samplestyle") as HTMLInputElement).readOnly = true;
        (document.getElementById("input-sentsampleid") as HTMLInputElement).readOnly = true;
        //(document.getElementById("btnsampledate") as HTMLInputElement).readOnly = true;
        //$("#input-sampleDate").prop("disabled", true);
        $("#btnsampledate").prop("disabled", true);
        $("#btnSavedate").prop("disabled", true);
    
        $("#btnsearchMSSite").prop("disabled", true);
        $("#btnsearchMSSite").prop("disabled", true);
        $("#btnsearch1").prop("disabled", true);
        $("#btnsearch2").prop("disabled", true);

        this.clsnone = "d-none";
        //$("#btnclear").addClass('d-none');
        
    
        //console.log('if1');
      } else {
        //console.log('testconsole.log', 'test555');
        //console.log('if2');
        
      }

    });
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.fromOrigin = params.get('fromOrigin');
        //console.log('xxx fromOrigin => ', this.fromOrigin);
      });

    this.route.queryParamMap
      .subscribe((params: ParamMap) => {
        const parm = params.get('id');
        console.log('query param => ', parm);




        if (parm == 'edit') {
          console.log('this.requestsForm => ', this.requestsForm);

          this.CheckInsert = 'ModeEdit';
          /*console.log('Mode Edit');*/
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
            .subscribe((res) => {
              const model: RequestsModel = Object.assign({}, res.data.Requests[0]);
              this.patchRequestsValues(model);
              const nationality = this.requestsForm.get('nationality').value;
              if (nationality == 'Foreigner') {
                $('#idcardred').addClass('d-none');
              } else {
                $('#idcardred').removeClass('d-none');
              }

              const ultrasound_BPD = this.requestsForm.get('ultrasound_BPD').value;
              const ultrasound_CRL = this.requestsForm.get('ultrasound_CRL').value;


              this.CheckDataBPD_CRL(ultrasound_BPD, ultrasound_CRL);

            });


         


        }
        else {
          console.log('Check New');
          this.CheckInsert = 'ModeNew';
          //this.initForm();
          //this.TestFunction();


          //this.requestsForm.get('sampleDate').setValue(range.start);
          //console.log('range', range.start);

           //const range = this.utilService.getDateRange('Today');
          //this.requestsForm = this.fb.group({
          //  sampleDate: new FormControl(range.start), // Set the initial value here
          //  salumIntersectionDate: new FormControl(range.start) // Set the initial value here
          //});


          //this.requestsForm.patchValue({
          //  sampleDate: range.start,
          //  salumIntersectionDate: range.start
          //})



          //$('#input-drawblooddate').val(range.start);
          //console.log('requestsForm after initialization', this.requestsForm.get('sampleDate').value);
          //console.log('1111111111 => ', this.requestsForm.controls['sampleDate'].setValue(range.start));
          //console.log('2222 => ', this.requestsForm.patchValue({ sampleDate: range.start }));
          //const inputDate = new Date(range.start);
          //const day = inputDate.getDate().toString().padStart(2, '0');
          //const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
          //const year = (inputDate.getFullYear() + 543).toString(); // Adding 543 to convert to Buddhist calendar
          //const formattedDate = `${day}/${month}/${year}`;
          //console.log('formattedDate = > ', formattedDate);
          //$('#input-drawblooddate').val(formattedDate);
         
        }
      });


    this.myDateValue = new Date();
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY'
    });

    this.createInitialForm();
    this.doLoadData();
    // tslint:disable-next-line: deprecation
    this.patientForm.valueChanges.subscribe(val => {
      //console.log('valllllllllll',val);
    });

    this.doLoadGARange();



    if (this.CheckInsert == 'ModeNew') {
      const range = this.utilService.getDateRange('Today');
      this.requestsForm.controls['sampleDate'].setValue(range.start);
      this.requestsForm.controls['salumIntersectionDate'].setValue(range.start);
    }
  }

  initForm() {
    // Initialize the form with the current date
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);
    console.log('formattedDate =>> ',formattedDate);
    this.requestsForm = this.fb.group({
      sampleDate: [formattedDate]
    });
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  TestFunction() {
    this.requestsForm.get('sampleDate').setValue(new Date());

  }

  doReadIdCard = (res: string) => {
    this.selectedOption = res;

    try {
      this.loading = true;
      this.spinner.show();


      //////TestFunction
      //this.appSettingsService.getLocalAddress()
      //  .subscribe(res => {

         
      //    ///////เดี๋ยวทำต่อ
      //    //const response = this.utilService.camelizeKeys(res.data);
      //    //console.log('resssss => ', response.localAdressClick);
      //    //this.testFunction = response.res;

      //  })




      this.appSettingsService.getIdCardInfo()
        .subscribe(res => {
          const response = this.utilService.camelizeKeys(res.data);
          console.log('identity card info => ', response);
          if (response.personalInfo == null) {
            Swal.fire({
              title: `ไม่สามารถอ่านบัตรประชาชนได้`,
              text: `กรุณาตรวจสอบอุปกรณ์เชื่อมต่อ`,
              icon: `error`,
            });
          } else {
            this.requestsForm.patchValue({
              firstName: response.personalInfo.thaiPersonalInfo.firstName,
              lastName: response.personalInfo.thaiPersonalInfo.lastName,
              title: response.personalInfo.thaiPersonalInfo.prefix,
              identityCard: response.personalInfo.citizenID,
              birthday: new Date(response.personalInfo.dateOfBirth),

              roomNo: response.personalInfo.addressInfo.houseNo,
              village: response.personalInfo.addressInfo.villageNo,
              district: response.personalInfo.addressInfo.subDistrict,
              amphur: response.personalInfo.addressInfo.district,
              province: response.personalInfo.addressInfo.province,
              address: `${response.personalInfo.addressInfo.houseNo} ${response.personalInfo.addressInfo.villageNo} ${response.personalInfo.addressInfo.subDistrict} ${response.personalInfo.addressInfo.district} ${response.personalInfo.addressInfo.province}`
            });

            this.doCheckRequired();
          }

          this.loading = false;
          this.spinner.hide();
        });
    } catch {
      this.loading = false;
      this.spinner.hide();
    }

  }


  //Alert เตือนสัปดาห์
  //testbuttonfunction() {
  //  console.log('testFuncion');
  //}

  clearSite() {
    let inputElement = (document.getElementById("input-sentsampleid") as HTMLInputElement).value = '';
  }
  Alertfunction(event) {
    let inputElement = (document.getElementById("input-gAAgeWeeks") as HTMLInputElement).value;
    let convertotofloat = parseFloat(inputElement);
    if (inputElement == "") {
    }
    if (inputElement != "") {
      if (convertotofloat! > 20 || convertotofloat == 0) {
        return Swal.fire({ title: ``, text: `อายุครรภ์อยู่นอกเหนือจากช่วงที่สามารถตรวจได้ กรุณาตรวจสอบอายุครรภ์อีกครั้ง`, icon: 'warning' });
      }
    }
  }

  //keyipnumber
  Numbers(e) {
    var keynum;
    var keychar;
    var numcheck;
    if (window.event) {// IE
      keynum = e.keyCode;
    }
    else if (e.which) {// Netscape/Firefox/Opera
      keynum = e.which;
    }

    if (keynum == 13 || keynum == 8 || typeof (keynum) == "undefined") {
      return true;
    }
    keychar = String.fromCharCode(keynum);
    numcheck = /^\d*(\.\d+)?$/;
    return numcheck.test(keychar);
  }





 //แก้ไข

  natthai() {
    $('#hdnat').val(1);
    $('#idcardred').removeClass('d-none');
  }

  natforegner() {
    $('#hdnat').val(2);
    $('#idcardred').addClass('d-none');
  }

  radionum1() {
    //(document.getElementById("input-numberofOther") as HTMLInputElement).readOnly = true;
  }

  radionum2() {
    //(document.getElementById("input-numberofOther") as HTMLInputElement).readOnly = true;
    return Swal.fire({ title: ``, text: `ครรภ์แฝด (ไม่สามารถส่งตรวจได้)`, icon: 'warning' });
  }

  radionum3() {
    //(document.getElementById("input-numberofOther") as HTMLInputElement).readOnly = false;
  }
  radiodonthave() {
    //console.log('esttt dont have');
    (document.getElementById("input-artificialInseminationValue") as HTMLInputElement).disabled = true;
    (document.getElementById("input-ovumCollectDate") as HTMLInputElement).readOnly = true;
    (document.getElementById("input-embryoTransferDate") as HTMLInputElement).readOnly = true;
    (document.getElementById("input-donorBirthdate") as HTMLInputElement).readOnly = true;

    $("#btndatepicker1").prop("disabled", true);
    $("#btndatepicker2").prop("disabled", true);
    $("#btndatepicker3").prop("disabled", true);
    //$('#btndatepicker1').porp();
    //eleman.disabled = false;
  }
  radiohave() {
    //console.log('testtt have');
    (document.getElementById("input-artificialInseminationValue") as HTMLInputElement).disabled = false;
    (document.getElementById("input-ovumCollectDate") as HTMLInputElement).readOnly = false;
    (document.getElementById("input-embryoTransferDate") as HTMLInputElement).readOnly = false;
    (document.getElementById("input-donorBirthdate") as HTMLInputElement).readOnly = false;

    $("#btndatepicker1").prop("disabled", false);
    $("#btndatepicker2").prop("disabled", false);
    $("#btndatepicker3").prop("disabled", false);
  }
  //Alert วัน
  Alertfunctionday(event) {
    let inputElement = (document.getElementById("input-gAAgeDays") as HTMLInputElement).value;
    let convertotofloat = parseFloat(inputElement);
    if (inputElement == "") {
    }
    if (inputElement != "") {
      if (convertotofloat! > 6) {
        return Swal.fire({ title: ``, text: `อายุครรภ์ไม่ถูกต้อง กรุณาตรวจสอบอายุครรภ์อีกครั้ง`, icon: 'warning' });
      }
    }
  }
  

   //ddlPrefix
  


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
    console.log('raceCode => ',raceCode);
    console.log('race => ',race);
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

    //////เช็คให้เลือกครรภ์เเดี่ยว
    //this.requestsForm.patchValue({
    //  pregnantFlag: '1'
    //});

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

    this.requestsForm.patchValue({
      siteID: this.defaultValue.siteID,
      siteName: this.defaultValue.siteName
    });

    this.requestsForm.valueChanges.subscribe(v => {
      this.doCheckRequired();
    });
  }

  doLoadPatientMore = () => {
    const requestId = this.requestsForm.get('requestID').value;
    //console.log('requestId >> ', requestId);
    const patientItem = {
      requestID: ``,
      sqlSelect: `more.PatientMoreCode, more.PatientMoreName as PatientMoreText, more.PatientMoreID as LabPatientMoreID, it.* `,
      sqlFrom: `RIGHT OUTER JOIN MSLabPatientMore as more on (it.PatientMoreID = more.PatientMoreID and (it.RequestID = '${requestId}') )  `,
      pageIndex: -1
    };


    //console.log('This patientItem  => ', patientItem);

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
    //console.log('loaddata');



    //this.requestsRepoService.getPrefixByCondition({})
    //console.log('restest');

      //.subscribe((res) => {
      //  const data = this.utilService.camelizeKeys(res.data.Races);
      //  this.races = data;
      //}, (err) => {
      //  this.handleError(err);
      //});

    this.requestsRepoService.getRaceByCondition2({})
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.Prefix);
        //console.log('dataPrefix =>',data);
        this.prefixs = data;
      }, (err) => {
        this.handleError(err);
      });



    this.requestsRepoService.getRaceByCondition({})
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.Races);
        //console.log('dataRaces =>', data);
        this.races = data;
      }, (err) => {
        this.handleError(err);
      });





      /////แพทย์ผู้ส่งตรจ
    if (this.defaultValue.siteID != null) {

    } else {
      this.requestsRepoService.getRaceByConditiondoctor({})
        .subscribe((res) => {
          const data = this.utilService.camelizeKeys(res.data.Doctors);
          //console.log('doctors =>', data);
          this.doctors = data;
        }, (err) => {
          this.handleError(err);
        })
    }
   




    const storageData = sessionStorage.getItem('RequestsSampleDataStorage');
    const objData = JSON.parse(storageData) as RequestsModel;
    console.log('objectData => ', objData);

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
        //console.log(item, 'itemtest');
        const model: RequestsModel = Object.assign({}, res.data.Requests[0]);

        //console.log('ThisModel => ',model);

        this.patchRequestsValues(model);

        const birthday = this.requestsForm.get('birthday').value;
        const receiveDate = this.requestsForm.get('receiveDate').value;
      
        const createdDate = this.requestsForm.get('createdDate').value;
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
        if (!pregnantFlag) {
          /*pregnantFlag = '1';*/
        }
        this.requestsForm.patchValue({
          spParmLastRequestID: this.requestsForm.get('requestID').value,
          //palm
          //nationality: this.requestsForm.get('Nationality').value,
          //Passport: this.requestsForm.get('Passport').value,
           //palm


          birthday: birthday ? new Date(birthday) : null,
          receiveDate: receiveDate ? new Date(receiveDate) : null,
          shiptoDate: shiptoDate ? new Date(shiptoDate) : null,
          createdDate: createdDate ? new Date(createdDate) : null,
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

        //this.age = this.calculateAge(new Date(birthday));
        this.age = this.onBlodDayChange();
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

  // เช็คอายุ ver เก่า
  public calculateAge = (birthday: Date) => {
    if (birthday) {
      const timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
      // so 26 years and 140 days would be considered as 26, not 27.
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      this.age = 0;
    }
    return this.age;

    //return this.age;
  }

  onBirthDayChange(event: any) {
    this.calculateAge(event);
  }


  onBlodDayChange() {
    const birthday = this.requestsForm.get('birthday').value;
    const sampleDate = this.requestsForm.get('sampleDate').value;
    //console.log('event birthday => ',birthday);
    //console.log('event sampleDate => ', sampleDate);

    if (birthday == null || sampleDate == null || birthday == '' || sampleDate == '') {
      this.age = 0;
    } else {
      const timeDiff = Math.abs(new Date(sampleDate).getTime() - new Date(birthday).getTime());
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }
    return this.age;

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
    //console.log('wwww => ', $('#input-drawblooddate').val());


    let hdnat = (document.getElementById("hdnat") as HTMLInputElement).value;
    console.log('hdnat =>', hdnat);
    let conhdnat = Number(hdnat);
    if (conhdnat == 1) {
      let identityCard = (document.getElementById("input-identityCard") as HTMLInputElement).value;
      const cleanedIdNumber = identityCard.replace(/\D/g, '');

      if (identityCard == '') {
        return Swal.fire({ title: ``, text: `กรุณากรอก เลขบัตรประชาชนให้ครบถ้วน`, icon: 'warning' });
      } else {


        if (cleanedIdNumber.length !== 13) {
          return Swal.fire({ title: ``, text: `กรุณากรอก เลขบัตรประชาชนให้ครบ 13 หลัก`, icon: 'warning' });
        }
      }
      //console.log('identityCard =>', identityCard);
    }
    else if (conhdnat == 2) {
    } else if (hdnat == 'thai') {
      let identityCard = (document.getElementById("input-identityCard") as HTMLInputElement).value;
      const cleanedIdNumber = identityCard.replace(/\D/g, '');
      if (identityCard == '') {
        return Swal.fire({ title: ``, text: `กรุณากรอก เลขบัตรประชาชนให้ครบถ้วน`, icon: 'warning' });
      } else {

        if (cleanedIdNumber.length != 13) {
          return Swal.fire({ title: ``, text: `กรุณากรอก เลขบัตรประชาชนให้ครบ 13 หลัก`, icon: 'warning' });
        }
      }
    } else if (hdnat == 'Foreigner') {
    } else {
      return Swal.fire({ title: ``, text: `กรุณากรอก เลือกสัญชาติ`, icon: 'warning' });
    }









    
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

      if (!this.requestsForm.get('siteID').value) {
        Swal.fire({
          icon: 'error',
          title: 'ข้อมูลหน่วยงานที่ส่งตรวจ',
          text: '"หน่วยงาน" ไม่สามารถเป็นค่าว่าง',
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
          title: 'ลงทะเบียนตัวอย่าง',
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
    //testttttttttttttttttttt
    //let hdtest = (document.getElementById("input-hdtestfunction") as HTMLInputElement).value = 'testfunctionInsert';
    //this.requestsForm.get('hdtestfunction').setValue('testfunctionInsert');
    //console.log('This hdtest => ', hdtest);
    //this.requestsForm.get("hdtestfunction").setValue("tttttttttttttttt");

    //this.testtttttttt.patchValue({
    //  hdtestfunction: "sfddshfdshfsdhkj",

    //});


    /////น่าจะอันนี้แหละมั้ง
    //let hdtestfunction = this.requestsForm.get('hdtestfunction').value('yuyyyyyyyyyy');
    //console.log('this hdtestfunction => ', hdtestfunction);
    //console.log('this.requestsDTO => ', this.requestsDTO);


    //console.log('this.requestsDTO => ', this.requestsDTO);

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

  pregnantInputCompleted = false;
  sampleRegisterInputCompleted = false;
  pregnancyHistoryInputCompleted = false;
  gestationalAgeInputCompleted = false;
  nHSOInputCompleted = false;
  paymentInputCompleted = false;
  bloodDrawInputCompleted = false;


  //เช็คดาวแดง
  doCheckRequired = () => {
    const idxIncomplete: Array<number> = new Array<number>();
    let item: RequestsModel = new RequestsModel();

    item = Object.assign(this.requestsForm.getRawValue());
    // console.log('form item => ', item);

    // ข้อมูลหญิงตั้งครรภ์
    let completed = ((item.title) ? true : false) && ((item.firstName) ? true : false)
      //&& ((item.lastName) ? true : false) && ((item.race) ? true : false) && ((item.identityCard) ? true : false)
      && ((item.lastName) ? true : false) && ((item.race) ? true : false)
      && ((item.birthday) ? true : false) && ((item.weight) ? true : false);

    this.pregnantInputCompleted = ((item.title) ? true : false) && ((item.firstName) ? true : false)
      //&& ((item.lastName) ? true : false) && ((item.race) ? true : false) && ((item.identityCard) ? true : false)
      && ((item.lastName) ? true : false) && ((item.race) ? true : false)
      && ((item.birthday) ? true : false) && ((item.weight) ? true : false);

    // ประวัติการตั้งครรภ์
    completed = (completed) && ((item.pregnantNo) ? true : false);
    completed = (completed) && ((item.pregnantFlag) ? true : false);
    if (item.pregnantFlag == '0') {
      completed = (completed) && ((item.numberofOther) ? true : false);
    }

    this.pregnancyHistoryInputCompleted = ((item.pregnantNo) ? true : false) && ((item.pregnantFlag) ? true : false);
    if (item.pregnantFlag == '0') {
      this.pregnancyHistoryInputCompleted = (this.pregnancyHistoryInputCompleted) && ((item.numberofOther) ? true : false);
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

    this.gestationalAgeInputCompleted = false;
    if (item.riskAnalystAgeFlag == 'ULT') {
      this.gestationalAgeInputCompleted = ((item.ultrasoundDate) ? true : false);
      if (item.ultrasoundFlag == 'BPD') {
        this.gestationalAgeInputCompleted = (this.gestationalAgeInputCompleted) && ((item.ultrasound_BPD) ? true : false);
      } else if (item.ultrasoundFlag == 'CRL') {
        this.gestationalAgeInputCompleted = (this.gestationalAgeInputCompleted) && ((item.ultrasound_CRL) ? true : false);
      }
    } else if (item.riskAnalystAgeFlag == 'GA') {
      this.gestationalAgeInputCompleted = ((item.gAAgeWeeks) ? true : false) || ((item.gAAgeDays) ? true : false);
    } else if (item.riskAnalystAgeFlag == 'LMP') {
      this.gestationalAgeInputCompleted = ((item.lMPDate) ? true : false);
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

    this.nHSOInputCompleted = false;
    if (item.savetoNHSOStatus == 'Yes') {
      this.nHSOInputCompleted = ((item.savetoNHSODate) ? true : false) && ((item.savetoNHSOByID) ? true : false);
    } else if (item.savetoNHSOStatus == 'No') {
      this.nHSOInputCompleted = ((item.nonSaveToNHSOFlag) ? true : false);
      if (item.nonSaveToNHSOFlag == 'Other') {
        this.nHSOInputCompleted = ((item.nonSaveToNHSORemark) ? true : false);
      }
    }
    // การชำระเงิน สปสช.
    this.nHSOInputCompleted = (this.nHSOInputCompleted) && ((item.paymentFlag) ? true : false);
    if (item.paymentFlag == 'CashPayment') {
      this.nHSOInputCompleted = (this.nHSOInputCompleted) && ((item.paymentNo) ? true : false);
    } else if (item.paymentFlag == 'OtherPayment') {
      this.nHSOInputCompleted = (this.nHSOInputCompleted) && ((item.paymentOther) ? true : false);
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

    this.bloodDrawInputCompleted = ((item.sampleDate) ? true : false);
    this.bloodDrawInputCompleted = (this.bloodDrawInputCompleted) && ((item.salumIntersectionDate) ? true : false);

    if (item.inputCompleted == null) {
      item.inputCompleted = true;
    }

    // if (completed) {
    //   item.inputCompleted = true;
    // } else {
    //   idxIncomplete.push(index);
    //   item.inputCompleted = false;
    // }


    // if (idxIncomplete.length > 0) {
    //   this.inputCompleted = false;
    // } else {
    //   this.inputCompleted = true;
    // }

    this.cdRef.detectChanges();
  }


  doReadIdCard2  = () => {
    console.log('tttttttt');





    //// Initialize the card reader here
    //const cardReader = new CardReaderLibrary();

    //// Set up event listeners or callbacks
    //cardReader.on('card-inserted', (card) => {
    //  // Card inserted, handle the card data
    //  this.handleCardData(card);
    //});


  
  }



    ////// ฟังก์ชั่นคำนวณสูตรโหมด New
  onKeydownEventBPD = (ev: any) => {

    //console.log('ev => ',ev);
    let dataObject: any;

    if (typeof ev === 'object') {
      dataObject = ev;
    } else {
      dataObject = { value: ev };
    }
    const ConStr2: number = +dataObject.value;
    if (!isNaN(ConStr2)) {
      const formattedValue: string = ConStr2.toFixed(2);
      dataObject.result = formattedValue;
      //console.log('ev2220 => ', dataObject.result);
      this.requestsForm.get('ultrasound_BPD').setValue(dataObject.result);
    } else {
      console.error('Invalid numeric value');
    }


 

    //// Check if the conversion was successful
    //if (numberValue != 0) {
    //  // Round the number to two decimal places and convert it back to a string
    //  const formattedValue = numberValue.toFixed(2);

    //  // Update the result
    //  ev.result = formattedValue;

    //  // Now ev.result will contain the formatted value with two decimal places
    //  console.log('ev2220 => ',ev.result);
    //}





    if (ev == '') {
      $('#txtWeekBPD').val('');
      $('#txtDayBPD').val('');
    } else if (ev == 0) {
      $('#txtWeekBPD').val('');
      $('#txtDayBPD').val('');
    }
    else {
      var ConStr: any = +ev;
      if (ConStr != 0) {





        ///// สูตรคำนวณ BPD
        var questionEvent: any = +ev;
        var answerEvent = 54.636 + 1.4939 * questionEvent + 0.0075208 * Math.pow(questionEvent, 2) + 0.0000021424 * Math.pow(questionEvent, 3);

        var parameterWeek = 0;
        var parameterSumtotal: any;
        var parameterDay = 0;

        ////// เช็คและแบ่งประเภท Week and Day
        if (answerEvent != 0) {
          //console.log(555);


        




          ////สัปดาห์
          parameterWeek = +answerEvent;


          parameterWeek = parameterWeek / 7;

          var numStr = parameterWeek.toString();
          var parts = numStr.split('.');
          var v = "." + parts[1];
          /////สัปดาห์ Math ตัดทศ.นิยมและหลังทศนิยมออก
          $('#txtWeekBPD').val(Math.trunc(parameterWeek));


          ////วันที่
          if (Math.trunc(parameterWeek) != 0) {
            parameterDay = +parameterWeek;

            var num2 = +v;
            var numStr2 = num2.toString();
            var v2 = parseInt(numStr2.substring(0, 2));

            var sumresult = +numStr2 * 7;
            //var summarayDay = +sum1and2 * 7;
            var summarayDay = sumresult;

            /////วัน Math ปัดทศนิยมขึ้น
            $('#txtDayBPD').val(Math.round(summarayDay));

          } else {
            //console.log(666);
            //parameterDay;
            $('#txtWeekBPD').val('');
            $('#txtDayBPD').val('');
          }

        }
      }
    }

   
  }



  onKeydownEventCRL = (ev: any) => {
    let dataObject: any;

    if (typeof ev === 'object') {
      dataObject = ev;
    } else {
      dataObject = { value: ev };
    }
    const ConStr2: number = +dataObject.value;
    if (!isNaN(ConStr2)) {
      const formattedValue: string = ConStr2.toFixed(2);
      dataObject.result = formattedValue;
      //console.log('ev2220 => ', dataObject.result);
      this.requestsForm.get('ultrasound_CRL').setValue(dataObject.result);
    } else {
      console.error('Invalid numeric value');
    }




    if (ev == '') {
      $('#txtWeekCRL').val('');
      $('#txtDayCRL').val('');
    } else if (ev == 0) {
      $('#txtWeekCRL').val('');
      $('#txtDayCRL').val('');
    } else {
      var ConStr: any = +ev;

      if (ConStr != 0) {


        ///// สูตรคำนวณ CRL
        var questionEvent: any = +ev;
        var answerEvent = (23.73 + (Math.sqrt(1.037 * questionEvent) * 8.052));


        var parameterWeek = 0;
        var parameterDay = 0;
        var parameterSumtotal: any;

        ////// เช็คและแบ่งประเภท Week and Day
        if (answerEvent != 0) {
          //console.log(555);
          ////สัปดาห์
          parameterWeek = +answerEvent;


          parameterWeek = parameterWeek / 7;

          var numStr = parameterWeek.toString();
          var parts = numStr.split('.');
          var v = "." + parts[1];
          /////สัปดาห์ Math ตัดทศ.นิยมและหลังทศนิยมออก
          $('#txtWeekCRL').val(Math.trunc(parameterWeek));


          ////วันที่
          if (Math.trunc(parameterWeek) != 0) {
            parameterDay = +parameterWeek;

            var num2 = +v;
            var numStr2 = num2.toString();
            var v2 = parseInt(numStr2.substring(0, 2));

            var sumresult = +numStr2 * 7;
            //var summarayDay = +sum1and2 * 7;
            var summarayDay = sumresult;

            /////วัน Math ปัดทศนิยมขึ้น
            $('#txtDayCRL').val(Math.round(summarayDay));

          } else {
            //console.log(666);
            //parameterDay;
            $('#txtWeekCRL').val('');
            $('#txtDayCRL').val('');
          }

        }

      }

    }

  }






  ////// ฟังก์ชั่นคำนวณสูตรหลังจากกดในโหมดEdit
  CheckDataBPD_CRL = (parametrBPD: any, parameterCRL: any) => {
  
    var ConStrBPD: any;
    var ConStrCRL: any;
    
    //////BPD
    if (parametrBPD != null) {

      if (+parametrBPD != 0) {
        ///// สูตรคำนวณ BPD
        var questionEvent: any = +parametrBPD;
        var answerEvent = 54.636 + 1.4939 * questionEvent + 0.0075208 * Math.pow(questionEvent, 2) + 0.0000021424 * Math.pow(questionEvent, 3);


        ConStrBPD = +answerEvent;
        var parameterWeek = 0;
        var parameterDay = 0;
        var parameterSumtotal: any;

        if (ConStrBPD != 0) {

          parameterWeek = +ConStrBPD;
          parameterWeek = ConStrBPD / 7;
          var numStr = parameterWeek.toString();
          var parts = numStr.split('.');
          //var v = parseInt(parts[1]);
          var v = "." + parts[1];
          /////สัปดาห์ Math ตัดทศ.นิยมและหลังทศนิยมออก
          $('#txtWeekBPD').val(Math.trunc(parameterWeek));




          ////วันที่
          if (Math.trunc(parameterWeek) != 0) {
            parameterDay = +parameterWeek;
            var num2 = v;
            var numStr2 = num2.toString();
            var v2 = parseInt(numStr2.substring(0, 2));
            var sumresult = +numStr2 * 7;
            var summarayDay = sumresult;
            /////วัน Math ปัดทศนิยมขึ้น
            $('#txtDayBPD').val(Math.round(summarayDay));

          } else {
            parameterDay;
          }



        }
      }

    }



    /////CRL
    if (parameterCRL != null) {
      ConStrCRL = +parameterCRL;

      if (ConStrCRL != 0) {

        ///// สูตรคำนวณ CRL
        var questionEvent: any = +parameterCRL;
        var answerEvent = (23.73 + (Math.sqrt(1.037 * questionEvent) * 8.052));


        var parameterWeek = 0;
        var parameterDay = 0;
        var parameterSumtotal: any;

        var parameterWeek = 0;
        var parameterDay = 0;
        var parameterSumtotal: any;

        ////// เช็คและแบ่งประเภท Week and Day
        if (answerEvent != 0) {
          //console.log(555);
          ////สัปดาห์
          parameterWeek = +answerEvent;


          parameterWeek = parameterWeek / 7;

          var numStr = parameterWeek.toString();
          var parts = numStr.split('.');
          var v = "." + parts[1];
          /////สัปดาห์ Math ตัดทศ.นิยมและหลังทศนิยมออก
          $('#txtWeekCRL').val(Math.trunc(parameterWeek));


          ////วันที่
          if (Math.trunc(parameterWeek) != 0) {
            parameterDay = +parameterWeek;

            var numTEST = +v;
            var numStr2 = numTEST.toString();
            var v2 = parseInt(numStr2.substring(0, 2));

            var sumresult = +numStr2 * 7;
            //var summarayDay = +sum1and2 * 7;
            var summarayDay = sumresult;

            /////วัน Math ปัดทศนิยมขึ้น
            $('#txtDayCRL').val(Math.round(summarayDay));

          } else {
            //console.log(666);
            //parameterDay;
            $('#txtWeekCRL').val('');
            $('#txtDayCRL').val('');
          }

        }
      }

    }





  }



  //onBlurweight = (ev) => {
  // /* console.log('ev => ',ev.length);*/
  //  //if (ev.length > 3) {
  //  //  //$('#input-weight').val('');
  //  //  Swal.fire({
  //  //    title: `ตรวจสอบความถูกต้อง`,
  //  //    text: `กรุณาตรวจสอบน้ำหนัก`,
  //  //    icon: `error`,
  //  //  });
  //  //}
  //  const stringValue = ev.toString(); // Convert to string
  //  const decimalIndex = stringValue.indexOf('.');

  //  const inputValue = parseFloat(ev);

  //  if (!isNaN(inputValue)) {
  //    const formattedValue = inputValue % 1 === 0 ? inputValue : inputValue.toFixed(1);
  //    console.log('inputValue => ', inputValue);
  //    $('#input-weight').val(formattedValue);
  //  }

  //  if (decimalIndex !== -1) {
  //    const countBeforeDecimal = stringValue.substring(0, decimalIndex).length;

  //    if (countBeforeDecimal > 2) { // Change 2 to the desired number of digits before the decimal point
  //      //console.log('wwww');
  //      Swal.fire({
  //        title: 'ตรวจสอบความถูกต้อง',
  //        text: 'กรุณาตรวจสอบน้ำหนัก',
  //        icon: 'error',
  //      });
  //    }
  //  }
  //}


  onBlurweight = (ev) => {
    const stringValue = ev.toString(); // Convert to string
    const decimalIndex = stringValue.indexOf('.');

    const inputValue = parseFloat(ev);

    if (!isNaN(inputValue)) {
      // Round to one decimal place
      const formattedValue = inputValue.toFixed(1);
      console.log('inputValue => ', inputValue);
      this.requestsForm.get('weight').setValue(formattedValue);
      $('#input-weight').val(formattedValue);
    }

    if (decimalIndex !== -1) {
      const countBeforeDecimal = stringValue.substring(0, decimalIndex).length;

      if (countBeforeDecimal > 2) { // Change 2 to the desired number of digits before the decimal point
        Swal.fire({
          title: 'ตรวจสอบความถูกต้อง',
          text: 'กรุณาตรวจสอบน้ำหนัก',
          icon: 'error',
        });
      }
    }
  }



  onBlurpregnantNo = (ev) => {
    if (ev.length > 2) {
      //$('#input-24').val('');
      Swal.fire({
        title: `ตรวจสอบความถูกต้อง`,
        text: `กรุณาตรวจสอบจำนวนตั้งครรภ์ที่`,
        icon: `error`,
      });
    }
  }



  CheckIdentityCard = (ev) => {
    var ConStr: any = +ev;
    const cleanedIdNumber = ev.replace(/\D/g, '');
    var teetttt: any = +cleanedIdNumber;
    //console.log('cleanedIdNumber => ', cleanedIdNumber);


    if (cleanedIdNumber.length !== 13) {
      Swal.fire({
        icon: 'error',
        title: 'บัตรประชาชน',
        text: 'กรุณาระบุเลขบัตรประชาชนให้ครบ 13 หลัก',
      });
    } else {
      this.checkID(cleanedIdNumber)
    }
  }




  // เช็คบัตรประชาชนมารดา

  checkID = async (id: any) => {

    if (id.length != 13) return false;
    for (var i = 0, sum = 0; i < 12; i++)

      sum += parseFloat(id.charAt(i)) * (13 - i);
    if ((11 - sum % 11) % 10 != parseFloat(id.charAt(12))) {
      //console.log('999999');
      Swal.fire({
        icon: 'error',
        title: 'บัตรประชาชน',
        text: 'กรุณาระบุเลขบัตรประชาชนให้ตรงตามความเป็นจริง',
      });
      return false;

    }
    return true;
  }






  getRefuse_verification() {
    let query = `
    SELECT FullName AS FullName2
    FROM DoctorNameList
            `;

    if (this.defaultValue.siteID != null) {
      query += `WHERE SiteId = '${this.defaultValue.siteID}'`;
    }

    query += `
    ORDER BY DoctorFirstName ASC, DoctorLastName ASC
         `;

    const response = this.sentSampleService.query({ queryString: query });

    return response.then((data) => {
      for (const el of data.data.response) {
        //console.log('ell => ', el);
        const n = { value: el.fullName2, text: el.fullName2 };
        this.DoctorNamelists.push(n);
      }
      return this.DoctorNamelists;
    });
  }

  getRefuse_verification2() {
    let query = `
    SELECT FullName AS FullName2
    FROM DoctorNameList
            `;

    if (this.defaultValue.siteID != null) {
      query += `WHERE SiteId = '${this.defaultValue.siteID}'`;
    }

    query += `
ORDER BY DoctorFirstName ASC, DoctorLastName ASC
     `;

    const response = this.sentSampleService.query({ queryString: query });

    return response.then((data) => {
      const newDoctorNamelists2 = []; // Create a new array

      for (const el of data.data.response) {
        //console.log('ell => ', el);
        const n = { value: el.fullName2, text: el.fullName2 };
        newDoctorNamelists2.push(n);
      }

      // Assign the new array to this.DoctorNamelists2
      this.DoctorNamelists = newDoctorNamelists2;

      return this.DoctorNamelists;
    });

  }



  onDoctorChange = (event: any) => {
    const selectedValue = event.target.value;
    const stringWithoutPrefix = selectedValue.substring(selectedValue.indexOf(':') + 1).trim();
    this.StringFullName = stringWithoutPrefix;
  }

  onAddNewDortor = () => {

    localStorage.setItem('NameDoctor', '');
    const initialState = {
      list: [
        { tag: 'Count', value: this.doctors.length }
      ],
      title: `เพิ่มข้อมูลแพทย์/ผู้ส่งตรวจ`
    };

    this.bsModalRef = this.modalService.show(AddnewDoctorComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe((result) => {
      this.DoctorNamelists.push(result);
      this.requestsForm.get('sentLabbyID').setValue(localStorage.getItem('NameDoctor'));
      localStorage.setItem('NameDoctor', '')
    });
  }

  onEditDoctor = () => {
    
    localStorage.setItem('NameDoctor', this.StringFullName);
      const initialState = {
      list: [
        { tag: 'Count', value: this.doctors.length }
      ],
      title: `แก้ไขข้อมูลแพทย์/ผู้ส่งตรวจ`
      };
    this.bsModalRef = this.modalService.show(AddnewDoctorComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe((result) => {
      //console.log('result =>> ', result);
      this.requestsForm.get('testAPIFullName2').setValue(result.value);
      //this.getRefuse_verification = this.getRefuse_verification2;
      localStorage.setItem('NameDoctor', '');
    });

  }


  onRemoveDoctor = () => {

    if (this.StringFullName == '') {
      return Swal.fire({ title: ``, text: `กรุณาเลือกข้อมูลที่ต้องการลบ`, icon: 'warning' });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: `คุณต้องการลบแพทย์/ผู้ส่งตรวจ "${this.StringFullName}" ใช่หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          const query = `
                        Delete from DoctorNameList
                        Where FullName =  '${this.StringFullName}'
                   `;

          this.sentSampleService.query({ queryString: query });
              Swal.fire(
                'Deleted!',
                'ลบข้อมูลแพทย์/ผู้ส่งตรวจสำเร็จ',
                'success'
              ).then(() => {
                this.getRefuse_verification2();
                localStorage.setItem('NameDoctor', '');
              });
         
        }
      });


    }
  }



  getCurrentDateTime(): Date {
    return new Date();
  }








}

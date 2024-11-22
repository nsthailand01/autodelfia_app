import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ResultsModel, RecalModal } from '../../../models/results.model';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { UtilitiesService, ToastrNotificationService } from '@app/services';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { RequestsDTO, RequestsModel } from '@app/models';
import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
import { Guid } from 'guid-typescript';
import { UploadDownloadService } from '@app/services/upload-download.service';
import { ProgressStatusEnum } from '@app/models/progress-status.model';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
import { LabtestPickerComponent } from '@app/pickers/labtest-picker/labtest-picker.component';


declare var $: any;
@Component({
  selector: 'app-test-result-tab',
  templateUrl: './test-result-tab.component.html',
  styleUrls: ['./test-result-tab.component.scss']
})
export class TestResultTabComponent extends BaseComponent implements OnInit {
  @Input() requestsForm: FormGroup;
  @Input() selectedRowIndex: number = -1;
  @Output() saveEvent = new EventEmitter<FormGroup>();

  fileToUpload: File = null;
  resultsLists: Array<ResultsModel>;
  public ListNewFunction: Array<RecalModal>;
  requestsDTO: RequestsDTO;

  dnonclassmain: string = '';
  dnonclass: string = 'd-none';
  dnonclass2: string = 'd-none';
  dnonclass3: string = 'd-none';

  fileInfoTemp = {
    fileToUpload: null,
    fileName: '',
    latestFileName: '',
    physicalFileName: '',
    latestPhysicalFileName: '',
  };

  allTechnique = [
    new DropdownListType('QF-PCR', 'QF-PCR'),
    new DropdownListType('FISH', 'FISH'),
    new DropdownListType('BOBs', 'BOBs'),
    new DropdownListType('Conventional Karyotyping', 'Conventional Karyotyping'),
    new DropdownListType('Other', 'อื่น ๆ (ระบุ)')
  ];

  abnormalLists: any = [
    new DropdownListType('46,XX', '46,XX'),
    new DropdownListType('46,XY', '46,XY'),
    // new DropdownListType('Trisomy 21 (Down Syndrome)', 'Trisomy 21 (Down Syndrome)'),
    // new DropdownListType('Trisomy 18 (Edward’s Syndrome)', 'Trisomy 18 (Edward’s Syndrome)'),
    // new DropdownListType('Trisomy 13 (Patau’s Syndrome)', 'Trisomy 13 (Patau’s Syndrome)'),
    new DropdownListType('อื่น ๆ (ระบุ)', 'อื่น ๆ (ระบุ)'),
  ];



  constructor(
    private fb: FormBuilder,
    private requestsRepoService: RequestsRepoService,
    private utilService: UtilitiesService,
    private notiService: ToastrNotificationService,
    private fileService: UploadDownloadService,
    private sentSampleService: SentSampleService
  ) {
    super();
  }

  ngOnInit(): void {
    // console.log('requestsForm >> ', this.requestsForm);
     //console.log('requestid >> ', this.requestsForm.get('requestID').value);
    this.createInitialForm();
    this.doLoadResults();

    /// ดูประวัติ History_Log
    //this.LoaddataHistoryLog();

  }

  createInitialForm = () => {
    //console.log(':::test result tab init::::');
    this.resultsLists = new Array<ResultsModel>();
  }

  get resultsForms(): FormArray {
    return this.requestsForm.get('resultsForms') as FormArray;
  }

  changeTechnique(e: any) {
    //console.log('value => ', e.target.value);
    this.techniqueValue.setValue(e.target.value, {
      onlySelf: true
    });

    // console.log('techniqueValue >> ', this.techniqueValue);
  }

  get techniqueValue() {
    return this.requestsForm.get('amnioticAnalysTechnique');
  }

  uploadFileChangex = (e) => {
    // const elem = e.target;
    // if (elem.files.length > 0) {
    //   const formData = new FormData();
    //   formData.append('file', elem.files[0], elem.files[0].name);
    //   this.fileService.uploadFile(formData)
    //     .subscribe((data) => {
    //       console.log(data); // Image name
    //     },
    //       (error) => {
    //         console.log('error: ', error);
    //       });
    // }
  }

  // getDownload(dto: DataRequestDto): Observable<Blob> {
  //   return this.http.post<Blob>(`${environment.apiUrl}api/dataextract/report`, dto,
  //     { responseType: 'blob' as 'json' });
  // }

  downloadAmnioticFile = async () => {
    const fileName = this.requestsForm.get('amnioticPhysicalFileName').value;
    if (fileName) {
      await this.fileService.downloadAmnioticFile(fileName).toPromise()
        .then((data: any) => {
          if (data) {
            const blob = new Blob([data.body]);
            saveAs(blob, this.requestsForm.get('amnioticPhysicalFileName').value);
          }
        })
        .catch((err: any) => {
          if (err.status == 404) {
            return this.notiService.showError('File not found.');
          }
          this.notiService.showError(err.statusText);
        });
    }


    return;
    this.fileService.downloadAmnioticFile(fileName)
      .subscribe((data: any) => {
        console.log('download...');
        // const url = window.URL.createObjectURL(data.body);
        // const link = document.createElement('a');
        // link.setAttribute('href', url);
        // link.setAttribute('download', this.requestsForm.get('amnioticPhysicalFileName').value);
        // link.style.display = 'none';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        // const blob = new Blob([data.body], { type: 'application/pdf' });
        // saveAs(blob, this.requestsForm.get('amnioticPhysicalFileName').value);

        // console.log('download data >>> ', data);
        // // const blob = new Blob([data.body], { type: 'application/pdf' });
        // const dataFile = window.URL.createObjectURL(blob);
        // window.open(dataFile);
        // return;
        // const link = document.createElement('a');
        // link.href = data;
        // link.download = this.requestsForm.get('amnioticPhysicalFileName').value;
        // link.click();
        // setTimeout(() => {
        //   window.URL.revokeObjectURL(dataFile);
        // }, 100);
      });
  }

  public onSelectFile(event: any) {
    // console.log('event.target.files >> ', event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
      this.requestsForm.patchValue({
        amnioticAnalysisReportFile: this.fileToUpload.name,
        fileToUpload: this.fileToUpload,
      });
    }

    // console.log('fileToUpload >>> ', this.requestsForm.get('fileToUpload').value);
  }

  public getFiles(): Observable<any[]> {
    return this.fileService.getFiles(); // this.http.get<any[]>(this.url + '/GetFileDetails');
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
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.LabResults);
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

  callParentSave(): void {
    this.saveEvent.next(this.requestsForm);
  }

  doClearAmnioticData = () => {
    this.requestsForm.patchValue({
      amnioticDate: null,
      amnioticLab: '',
      amnioticGAWeek: null,
      amnioticGADays: null,
      amnioticAnalysTechnique: '',
      amnioticOtherTechnique: '',
      amnioticChromosomeAbnormal: '',
      amnioticOtherAbnormal: '',
      amnioticMiscarriage: 'Not Specified',
      amnioticAnalysisReportFile: '',
      amnioticRecorder: '',
      amnioticPhoneNo: '',
    });
  }




  LoaddataHistoryLog = () => {
    //console.log(11);
    
    const requestId = this.requestsForm.get('requestID').value;
    //console.log('ttttt  => ', requestId );

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


  getRiskAssessmentText(value: string): string {
    if (value === '1') {
      return 'ความเสี่ยงต่ำ (Low Risk)';
    } else if (value === '2') {
      return 'ความเสี่ยงสูง (High Risk)';
    } else {
      return '-';
    }
  }



}

export class DropdownListType {
  constructor(public name: string, public text: string) {
  }
}

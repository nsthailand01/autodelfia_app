import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { UtilitiesService } from '@app/services/utilities.service';
import { ToastrNotificationService } from '@app/services';
import { UploadDownloadService } from '@app/services/upload-download.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-nipt-screening-result-tab',
  templateUrl: './nipt-screening-result-tab.component.html',
  styleUrls: ['./nipt-screening-result-tab.component.scss']
})
export class NiptScreeningResultTabComponent extends BaseComponent implements OnInit {
  @Input() requestsForm: FormGroup;
  @Output() saveEvent = new EventEmitter<FormGroup>();

  fileToUpload: File = null;

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
    private fileService: UploadDownloadService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  get techniqueValue() {
    return this.requestsForm.get('amnioticAnalysTechnique');
  }

  changeTechnique(e: any) {
    this.techniqueValue.setValue(e.target.value, {
      onlySelf: true
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

}


export class DropdownListType {
  constructor(public name: string, public text: string) {
  }
}

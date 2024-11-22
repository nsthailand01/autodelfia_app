import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UploadService } from '@app/services/upload.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [LoadingService]
})

export class UploadComponent implements OnInit {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() public onUploadFinished = new EventEmitter<any>();
  public progress: number;
  public message: string;

  @ViewChild('fileInput', { static: false })
  myFileInput: ElementRef;
  // public fileContentModel: FileContentModel;
  public form: FormGroup;
  public errors: string[] = [];
  private destroy: Subject<any> = new Subject();

  constructor(
    private uploadService: UploadService,
    private http: HttpClient
  ) { }

  public ngOnInit() {
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return new FormGroup({
      fileContact: new FormControl('', [Validators.required])
    });
  }

  public Submit(files: File[]): void {
    this.handleFileInput(files);
  }

  public handleFileInput(files: File[]): void {

    if (this.form.valid && files[0].name.split('.').pop() === 'excel') {
      const formData = new FormData();

      Array.from(files).forEach(f => formData.append('file', f));

      // this.uploadService.uploadPdfToGetBase64(formData).subscribe(
      //   (res: any) => {
      //     this.myFileInput.nativeElement.value = '';
      //   },
      //   (errorRes: HttpErrorResponse) => {
      //     alert('error occured');
      //     this.form.reset();
      //     this.myFileInput.nativeElement.value = '';
      //   }
      // );
    } else {
      alert('Invalid file selected. Only excel is allowed');
    }
  }

  public uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }
    const fileToUpload = files[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.http.post('http://localhost:52099/api/upload/upload', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else
          if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            this.onUploadFinished.emit(event.body);
          }
      });
  }

}

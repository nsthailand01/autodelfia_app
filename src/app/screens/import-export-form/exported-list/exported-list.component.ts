import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProgressStatus, ProgressStatusEnum } from '@app/models/progress-status.model';
import Swal from 'sweetalert2';
import { ImportExportService } from '../import-export.service';

@Component({
  selector: 'app-exported-list',
  templateUrl: './exported-list.component.html',
  styleUrls: ['./exported-list.component.scss']
})
export class ExportedListComponent implements OnInit {

  @Input() public templateType: string;
  @Input() public directory: string;

  public files: string[];
  public fileInDownload: string;
  public percentage: number;
  public showProgress: boolean;
  public showDownloadError: boolean;
  public showUploadError: boolean;

  constructor(
    private httpClient: HttpClient,
    private importExportService: ImportExportService
  ) { }

  ngOnInit(): void {
    this.getFiles();
  }

  getFiles = () => {
    // this.importExportService.filesList(this.templateType)
    //   .subscribe(res => {
    //     // console.log('files >> ', res);
    //     this.files = res;
    //   });

    this.importExportService.filesList2({ templateType: this.templateType, filePath: this.directory })
      .subscribe(res => {
        this.files = res;
      });
  }

  public downloadStatus(event: ProgressStatus) {
    switch (event.status) {
      case ProgressStatusEnum.START:
        this.showDownloadError = false;
        break;
      case ProgressStatusEnum.IN_PROGRESS:
        this.showProgress = true;
        this.percentage = event.percentage;
        break;
      case ProgressStatusEnum.COMPLETE:
        this.showProgress = false;
        break;
      case ProgressStatusEnum.ERROR:
        this.showProgress = false;
        this.showDownloadError = true;
        break;
    }
  }

  public uploadStatus(event: ProgressStatus) {
    switch (event.status) {
      case ProgressStatusEnum.START:
        this.showUploadError = false;
        break;
      case ProgressStatusEnum.IN_PROGRESS:
        this.showProgress = true;
        this.percentage = event.percentage;
        break;
      case ProgressStatusEnum.COMPLETE:
        this.showProgress = false;
        this.getFiles();
        break;
      case ProgressStatusEnum.ERROR:
        this.showProgress = false;
        this.showUploadError = true;
        break;
    }
  }

  public deleteFile = (file: any) => {
    Swal.fire({
      title: 'Are you sure want to delete this file?',
      icon: 'warning',
      confirmButtonText: `Delete`,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.importExportService.deleteFile2({ fileName: file, filePath: this.directory })
          .subscribe(res => {
            this.files.splice(this.files.indexOf(file), 1);
          });
        // Swal.fire('Saved!', '', 'success');
      }
    });
  }
}

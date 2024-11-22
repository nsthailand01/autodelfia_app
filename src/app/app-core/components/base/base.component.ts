import { Component, OnInit, ElementRef, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppInjectorService } from '@app/services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  public loading: boolean = false;
  // สำหรับการเข้ารหัส-ถอดรหัส
  protected secretKey: string = 'MPxDWNxAPPxABCDE';
  protected encKey = CryptoJS.enc.Utf8.parse(this.secretKey);
  protected iv = CryptoJS.enc.Utf8.parse(this.secretKey);

  @ViewChild('template') elementView: ElementRef;
  // protected appService: AppService;
  // protected pickerService: PickerService;
  protected toastrNotiService: ToastrService;
  protected spinner: NgxSpinnerService;
  public bsModalRef: BsModalRef;
  protected bsModalService: BsModalService;
  protected confirmDlgService: ConfirmDialogService;
  protected datePipe: DatePipe;
  // public translate: TranslateService;
  // protected apiService: RestApiService;
  // protected snackBarService: SnackBarService;

  public pageConfig: any;
  public items: any = [];
  public dialogText: string;
  public dialogTitle: string;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: 'my-modal'
  };

  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: Event) {
  //   this.toastrNotiService.warning('close');
  // }

  constructor(

  ) {
    try {
      const injector = AppInjectorService.getInjector();
      // this.appService = injector.get(AppService);
      // this.pickerService = injector.get(PickerService);
      this.toastrNotiService = injector.get(ToastrService);
      this.bsModalService = injector.get(BsModalService);
      this.spinner = injector.get(NgxSpinnerService);
      this.confirmDlgService = injector.get(ConfirmDialogService);
      this.datePipe = injector.get(DatePipe);
      // this.translate = injector.get(TranslateService);
      // this.apiService = injector.get(RestApiService);
      // this.snackBarService = injector.get(SnackBarService);

      this.pageConfig = {
        itemsPerPage: 15,
        currentPage: 1,
        totalItems: this.items.count
      };
    } catch (e) {
      console.log('Failed initializing dependencies', e);
    }
  }

  ngOnInit(): void {
    console.log('great base component');
  }

  pageChanged(event: any) {
    this.pageConfig.currentPage = event;
  }

  public openModalWithComponent() {
    // this.bsModalRef = this.bsModalService.show(this.elementView);
  }

  public openPick(template: TemplateRef<any>) {
    this.bsModalRef = this.bsModalService.show(template, this.config);
  }

  public closePick() { }

  public onNewClick() {
    this.toastrNotiService.info('components does not implement method!');
  }
  public onSaveNewClick() {
    this.toastrNotiService.info('components does not implement method!');
  }
  public onSaveCloseClick() {
    this.toastrNotiService.info('components does not implement method!');
  }
  public onDeleteClick() {
    this.toastrNotiService.info('components does not implement method!');
  }
  public onPrintClick() {
    this.toastrNotiService.info('components does not implement method!');
  }
  public onCloseClick() {
    this.toastrNotiService.info('components does not implement method!');
  }

  public handleError(error: any) {
    let errorMessage = '';
    if (error?.error instanceof ErrorEvent) {
      console.log('1');
      if (error.error.message) {
        errorMessage = `<b>Error:</b> ${error.error.message}`;
      } else {
        errorMessage = `<b>Error:</b> ${error.error}`;
      }
    } else {
      console.log('typeof error : ', typeof error);
      if (error?.error?.message) {
        errorMessage = `<b>Message:</b> ${error.error.message}`;
      } else if (typeof (error.error.errors) === 'object') {
        errorMessage = `<b>Message:</b> ${JSON.stringify(error.error.errors)}`;
      } else if (typeof (error.error) === 'string') {
        const array = `${error.error}`.split(/\r?\n/);
        errorMessage = `<b>Message:</b> ${array[0]}`;
      } else if (typeof (error) === 'string') {
        const array = `${error}`.split(/\r?\n/);
        errorMessage = `<b>Message:</b> ${array[0]}`;
      } else {
        errorMessage = `<b>Message:</b> ${error.message}`;
      }
    }

    let statusText = error.statusText;
    if (error.error) {
      statusText = error.error.statusText;
    }

    this.toastrNotiService.error(errorMessage, statusText);
    return false;
  }

  // เข้ารหัส
  protected encryptUsingAES256 = (objJSONStr: any): string => {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(JSON.stringify(objJSONStr)),
      this.encKey, {
      keySize: 16, // (128 / 8),
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted;
  }

  // ถอดรหัส
  protected decryptUsingAES256 = (encrypted: string): string => {
    const decrypted = CryptoJS.AES.decrypt(
      encrypted, this.encKey, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    return decrypted;
  }

}

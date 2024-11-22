import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { Observable, of } from 'rxjs';
import { ImportExportTemplateDTModel } from '../../../models/importexporttemplatedt.model';
import { RepositoryService } from '@app/shared/repository.service';
import { retry } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImportExportTemplateHDModel } from '@app/models/importexporttemplatehd.model';
import { ToastrNotificationService, UtilitiesService } from '@app/services';
import { ImportExportTemplateDTO, MSLabProfileModel, MSLabSampleTypeModel, MSSiteModel } from '@app/models';
import { Guid } from 'guid-typescript';
import { ImportExportService } from '../import-export.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RequestsModel } from '../../../models/requests.model';
import { RequestsPatientMoreModel } from '@app/models/requests-patienmore.model';
import { MslabProfilePickerComponent, MssitePickerComponent, SampleTypePickerComponent } from '@app/pickers';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import { IEColumnListInternalModel } from '@app/models/iecolumnlistinternal.model';

defineLocale('th', thBeLocale);

declare var $: any;

@Component({
  selector: 'app-import-export-create',
  templateUrl: './import-export-create.component.html',
  styleUrls: ['./import-export-create.component.scss']
})
export class ImportExportCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
  exportRangeForm: FormGroup;
  templateHdForm: FormGroup;
  templateDtAll: Array<ImportExportTemplateDTModel>;
  templateDts: Array<ImportExportTemplateDTModel>;
  columnLists: Array<any>;
  templateType: string = 'import';
  columnListsCombo: Array<IEColumnListInternalModel>;
  columnListsGroup: Array<any> = [];

  uniqueGroup: Array<any> = [];
  columnGroup = new Array<ColumnGroup>();
  private isUpdated: boolean = false;

  fileUrl: any;

  private importExportDTO: ImportExportTemplateDTO;
  @ViewChild('exportRange') exportRange: ElementRef;

  fromSentSampleDate: Date = null;
  toSentSampleDate: Date = null;
  sampleTypeID: string = '';
  profileID: string = '';
  locale = 'th';
  isExportDup = false;
  folder: string = '';
  exportResultType: string = '';

  constructor(
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private repoService: RepositoryService,
    private notiService: ToastrNotificationService,
    private importExportService: ImportExportService,
    private utilService: UtilitiesService,
    private sanitizer: DomSanitizer,
    private localeService: BsLocaleService,
  ) {
    super();
    this.localeService.use(this.locale);
  }

  ngAfterViewInit(): void {
    const isDup = this.exportRangeForm.get('isExportDup');
    const ob: Observable<boolean> = isDup.valueChanges;
    // tslint:disable-next-line: deprecation
    ob.subscribe((v: any) => {
      this.isExportDup = (v != '1' && v != null) ? false : true;
    });
  }

  ngOnInit(): void {
    this.createInitialForm();
    this.doLoadColumnLists();
    this.doLoadData();

    this.createFile();
    // this.logFileText('/assets/js/login/login-main.js');    // OK

    // document.getElementById('dirs').addEventListener('click', (event) => {
    //   window.postMessage('select-dirs', '*');
    // });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdated && this.templateHdForm.dirty) {
      return this.confirmDlgService.open();
    }
    return of(true);
  }

  browse() {

  }

  selectFolder(e: any) {
    const theFiles = e.target.files;
    const relativePath = theFiles[0].webkitRelativePath;
    const folder = relativePath.split('/');
    // console.log('folder >> ', e);
    // alert(folder[0]);
  }

  createFile() {
    // Fs.writeFile('file.txt', 'I am cool!', (err) => {
    //   if (err) {
    //     return console.error(err);
    //   }
    //   console.log('File created!');
    // });
  }

  logFileText = async (file: any) => {
    const response = await fetch(file);
    const text = await response.text();
  }

  // loadFromFileSystem() {
  //   return new Promise((resolve) => {
  //     const DIST_FOLDER = join(process.cwd(), 'dist');
  //     console.log('DIST_FOLDER >> ', DIST_FOLDER);
  //     readFile(`${DIST_FOLDER}/browser/app/config/env.json`, 'utf8', (err, data) => {
  //       if (err) {
  //         return this.handleError(err);
  //       }
  //       // this.envConfig = JSON.parse(data);
  //       resolve();
  //     });
  //   }).catch(this.handleError);
  // }

  moveUp(index: number) {
    console.log('up', this.templateDts[index]);
    if (index >= 1) {
      this.swap(this.templateDts, index, index - 1);
    }
  }

  moveDown(index: number) {
    console.log('down', this.templateDts[index]);
    if (index < this.templateDts.length - 1) {
      this.swap(this.templateDts, index, index + 1);
    }
  }

  private swap(array: any[], x: any, y: any) {
    const b = array[x];
    array[x] = array[y];
    array[y] = b;
  }

  public onNewClick = () => {
    if (!this.isUpdated && this.templateHdForm.dirty) {
      this.confirmDlgService.open().subscribe(res => {
        if (res) {
          this.onCreateNew();
        }
      });
    } else {
      this.onCreateNew();
    }
  }

  public doLoadData = async () => {
    const storageData = sessionStorage.getItem('ImportExportTemplateDataStorage');
    const objData = JSON.parse(storageData) as ImportExportTemplateHDModel;

    if (objData != null) {
      const item = {
        templateID: objData.templateID,
        sqlSelect: `it.*, profile.ProfileName, profile.ProfileCode, profile.TextCloseExportData`,
        sqlFrom: `Left Outer Join MslabProfile as profile On (profile.ProfileID = it.ProfileID)`,
        sqlWhere: `(it.TemplateID = '${objData?.templateID}')`,
        pageIndex: -1
      };

      this.importExportService.getByCondition(item)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          const model: ImportExportTemplateHDModel = Object.assign({}, res.data.ImportExportTemplateHDs[0]);
          this.patchFormValues(model);
          this.templateHdForm.get('isNew').patchValue(false);
          this.templateType = this.templateHdForm.get('templateType').value;

          this.templateHdForm.patchValue({
            isNew: false,
            objectState: 2
          });

          this.doLoadTemplateDT();

        }, (err) => {
          return this.handleError(err);
        });
    }
  }

  doLoadTemplateDT = () => {
    const item = {
      templateID: this.templateHdForm.get('templateID').value,
      sqlSelect: ``,
      sqlFrom: ``,
      sqlWhere: `(it.TemplateID = '${this.templateHdForm.get('templateID')?.value}')`,
      sqlOrder: `ListOrder Asc`,
      pageIndex: -1
    };
    this.importExportService.getTemplateDT(item)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        // const model: ImportExportTemplateDTModel = Object.assign({}, res.data.ImportExportTemplateDTs[0]);
        // this.patchFormValues(model);
        res = this.utilService.camelizeKeys(res);
        this.templateDts = res.data.importExportTemplateDTs;
        this.templateDtAll = Object.assign({}, this.templateDts);

      }, (err) => {
        return this.handleError(err);
      });
  }

  patchFormValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.templateHdForm.controls[ngName]) {
          this.templateHdForm.controls[ngName].patchValue(value[name]);
        }
      });
    } catch (error) {
      console.log('error >> ', error);
      this.handleError(error);
    }
  }

  compareById(itemA: any, itemB: any): boolean {
    // console.log('itemA >> ', itemA);
    // console.log('itemB >> ', itemB);
    if (itemA === undefined && itemB === undefined) {
      return true; // show the default option
    } else if (itemA && itemB) {
      return (itemA.sourceColumnName === itemB); // show the specific option
    }
    else {
      return false; // no match found
    }
  }

  onCreateNew() {
    sessionStorage.removeItem('ImportExportTemplateDataStorage');
    this.createInitialForm();
  }

  createInitialForm() {
    this.templateHdForm = this.fb.group(new ImportExportTemplateHDModel());
    this.templateHdForm.patchValue({
      templateType: 'import',
      columnDelimiter: 'semicolon',
      fileEncoding: 'ansi',
      isNew: true
    });
    this.templateDts = new Array<ImportExportTemplateDTModel>();

    const currentDate: Date = new Date();
    this.exportRangeForm = this.fb.group({
      templateID: '',
      fromSentSampleDate: [new Date(currentDate.setDate(currentDate.getDate() - 1))],
      toSentSampleDate: [new Date()],
      sampleTypeID: [''],
      sampleTypeName: [''],
      profileID: [''],
      profileName: [''],
      isExportDup: [false],
      fromLabNumber: [''],
      toLabNumber: [''],
      fromReceiveDate: [new Date(currentDate.setDate(currentDate.getDate() - 1))],
      toReceiveDate: [new Date()],
      fromSiteID: [null],
      fromSiteName: [''],
      resultType: [''],
    });
  }

  doLoadColumnLists() {
    this.repoService.getData('api/requests/getIEColumnLists?sql=&tableName=').pipe(retry(1))
      // tslint:disable-next-line: deprecation
      .subscribe((res: any) => {
        this.columnListsCombo = res.data.IEColumnLists;

        this.uniqueGroup = [...new Set(this.columnListsCombo.map(item => item.category ? item.category : '(None)'))]
          .sort((a, b) => b.localeCompare(a));

        const newLists = [];
        this.columnListsCombo.forEach(el => {
          this.columnListsGroup.push({
            group: el.category,
            items: el
          });
          // newLists.push({
          //   group: element.category,
          //   items: element
          // });
        });

        this.createColumnGroup();
        this.filterColumnLists();
      });
  }

  private createColumnGroup(): void {
    // Object.keys(this.uniqueGroup).forEach((key, val) => {
    //   const columnGroup = new ColumnGroup();
    //   columnGroup.label = key; // StockGroupLabel[key];
    //   columnGroup.items = new Array<IEColumnListInternalModel>();
    //   this.columnGroup.push(columnGroup);
    // });

    this.uniqueGroup = [...new Set(this.columnListsCombo.map(item => item.category ? item.category : '(None)'))]
      .sort((a, b) => a.localeCompare(b));
    this.uniqueGroup.forEach(item => {
      const columnGroup = new ColumnGroup();
      columnGroup.label = item;
      columnGroup.items = new Array<IEColumnListInternalModel>();
      this.columnGroup.push(columnGroup);
    });

  }

  private filterColumnLists(): void {
    // const positive = this.columnGroup[0].items;
    // const negative = this.columnGroup[1].items;
    // this.list.forEach(item => item.quantity > 0 ? positive.push(item) : negative.push(item));

    this.columnGroup.forEach(gr => {
      this.columnListsCombo.forEach(el => {
        if ((el.category ? el.category : '(None)') == gr.label) {
          gr.items.push(el);
        } else {
        }
      });
    });


  }

  public goBack = () => {
    sessionStorage.removeItem('ImportExportTemplateDataStorage');

    if (window.history.length > 1) {
      this.location.back();
      // this.router.navigate(['/request-sample/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onTypeChange = (type: any) => {
    this.templateType = type;
  }

  public doImportExport = () => {
    // const data = 'some text';
    // const blob = new Blob([data], { type: 'application/octet-stream' });
    // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    // console.log('fileUrl >> ', this.fileUrl);
    if (this.templateType == 'export') {
      $(this.exportRange.nativeElement).modal('show');  // >> doExportedRange()
      $(this.exportRange.nativeElement).appendTo('body');
      // $('#exportRange').draggable();
    } else {
      this.doImport();
    }
  }

  public doExportedRange = () => {
    this.exportRangeForm.patchValue({
      templateID: this.templateHdForm.get('templateID').value,
      isExportDup: this.isExportDup ? true : false,
    });

    // console.log('export form value : ', this.exportRangeForm.value);

    const requestDto = {
      Requests: new Array<RequestsModel>(),
      RequestsPatientMores: new Array<RequestsPatientMoreModel>(),
      ExportRangeParam: Object.assign({}, this.exportRangeForm.value),
      FilePath: this.templateHdForm.get('importExportPath').value,
      FileName: ''
    };

    try {
      this.spinner.show();
      this.importExportService.exportTxt(requestDto)
        .subscribe(res => {
          $(this.exportRange.nativeElement).modal('hide');
          setTimeout(() => {
            this.spinner.hide();
            if (res.success) {
              Swal.fire({
                title: 'Export Successfull', icon: 'success'
              });
            } else {
              Swal.fire({
                title: res.statusText, icon: 'warning'
              });
            }
          }, 1000);
        }, err => {
          this.spinner.hide();
          console.log('export error >> ', err);
          Swal.fire({
            title: err.error.statusText, icon: 'error'
          });
        });
    } catch (ex) {
      this.spinner.hide();
      Swal.fire(ex);
    }
  }

  public doImport = () => {
    this.exportRangeForm.patchValue({
      templateID: this.templateHdForm.get('templateID').value,
      isExportDup: this.isExportDup ? true : false,
    });

    const requestDto = {
      Requests: new Array<RequestsModel>(),
      RequestsPatientMores: new Array<RequestsPatientMoreModel>(),
      ExportRangeParam: Object.assign({}, this.exportRangeForm.value),
      FilePath: this.templateHdForm.get('importExportPath').value
    };

    try {
      this.spinner.show();
      this.importExportService.importTxt(requestDto)
        // tslint:disable-next-line: deprecation
        .subscribe(res => {
          // $(this.exportRange.nativeElement).modal('hide');
          setTimeout(() => {
            this.spinner.hide();
            if (res.success) {
              Swal.fire({
                title: 'Import Successfull', icon: 'success'
              });
            } else {
              Swal.fire({
                title: res.statusText, icon: 'warning'
              });
            }
          }, 1000);
        }, err => {
          this.spinner.hide();
          console.log('error >> ', err);
          Swal.fire({
            title: err.error.statusText, icon: 'error'
          });
        });
    } catch (ex) {
      this.spinner.hide();
      Swal.fire(ex);
    }
  }

  hideloader() {
    document.getElementById('loading').style.display = 'none';
  }

  onStatusCheckedChange(ev: any, text: string) {
    if (ev.checked) {
      // this.statusOptionSelected.push(text);
    } else {
      // this.statusOptionSelected.splice(this.statusOptionSelected.indexOf(text), 1);
    }

    // const filtered = this.requestAlls.filter(item => this.statusOptionSelected.includes(item.requestStatus));
    // this.requestLists = filtered;
    // this.dataSource.data = filtered as RequestsModel[];
  }

  public doSave = () => {
    this.executeSaveData();
  }

  onPrepareSave(): boolean {
    try {
      this.importExportDTO = {
        ImportExportTemplateHDs: new Array<ImportExportTemplateHDModel>(),
        ImportExportTemplateDTs: new Array<ImportExportTemplateDTModel>()
      };

      let guId = Guid.create();
      if (this.templateHdForm.get('isNew').value) {
        // do nothing
      } else {
        guId = this.templateHdForm.get('templateID').value;
      }
      this.templateHdForm.get('templateID').patchValue(guId.toString());
      // this.requestsDTO.Requests = [Object.assign({}, this.requestsForm.value)];
      this.templateDts.forEach((item, idx) => {
        item.templateID = this.templateHdForm.get('templateID').value;
        item.listNo = (idx + 1);
        item.listOrder = (idx + 1);
      });

      this.importExportDTO.ImportExportTemplateHDs = [Object.assign({}, this.templateHdForm.value)];
      this.importExportDTO.ImportExportTemplateDTs = this.templateDts;
      // this.requestsDTO.RequestsPatientMores.forEach((item, idx) => {
      //   item.requestID = this.requestsForm.get('requestID').value;
      //   item.listNo = idx;
      //   item.patientMoreID = item.labPatientMoreID;
      //   item.patientMoreName = item.patientMoreText;
      // });

      return true;
    }
    catch (err) {
      this.handleError(err);
      return false;
    }
  }

  private executeSaveData = () => {
    if (!this.onPrepareSave()) {
      this.notiService.showWarning('กรุณากรอกข้อมูล');
      return;
    }

    this.spinner.show();
    return this.importExportService.save(this.importExportDTO)
      .subscribe((res) => {
        this.isUpdated = true;
        this.spinner.hide();
        this.notiService.showSuccess('Save Successfully.');
        this.goBack();
      }, (err) => {
        this.spinner.hide();
        console.log('executeSaveData error >> ', err);
        return this.handleError(err);
      });
  }

  onSourceColumnChange = (ev: any) => {
    // this.templateHdForm.patchValue
  }

  addNewRow(index: number) {
    this.templateDts.push(new ImportExportTemplateDTModel());
    this.updateChange();
    return true;
  }

  deleteRow(index: number) {
    const deletedItem = this.templateDts[index];
    if (deletedItem.objectState == 2) {
      deletedItem.objectState = -2;
    } else if (deletedItem.objectState == 1) {
      deletedItem.objectState = -9;
    }

    this.templateDts = this.templateDts.filter(e => (e.objectState !== -2 && e.objectState !== -9));
    this.updateChange();
  }

  updateChange() {
    // this.itemsChangeEvent.emit(this.templateDts);
  }

  onTextChange(text: string): void {
    this.updateChange();
  }

  selectedTabChange = (event) => {
    if (event.index == 1) {
      // this.doLoadPatientMore();
    }
  }

  importData = async (filename: string, delimiter: string) => {
    // const fileContent = await this.readFileContent(file);
    // string text = System.IO.File.ReadAllText(@"C:\Users\Public\TestFolder\WriteText.txt");
    // string[] splittedText = text.Split(' ');
    fetch('something.txt')
      .then(response => response.text())
      .then(data => {
        console.log(data);
      });
  }

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = reader.result.toString();
        resolve(text);

      };

      reader.readAsText(file);
    });
  }

  openSitePicker = () => {
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
        this.exportRangeForm.patchValue({
          fromSiteID: value.selectedItem['SiteID'],
          fromSiteName: value.selectedItem['SiteName'],
        });
        // this.requestsForm.patchValue({
        //   siteID: value.selectedItem['SiteID'],
        //   siteName: value.selectedItem['SiteName']
        // });
      },
        (err: any) => {
          console.log(err);
        });
  }

  openSampleTypePicker() {
    let profileId = this.exportRangeForm.get('profileID').value;
    profileId = profileId ?? '@';

    const initialState = {
      list: [this.templateHdForm.get('templateID').value],
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
        this.exportRangeForm.patchValue({
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

  openLabProfilePicker = (flag: string = 'range') => {
    const initialState = {
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

        if (flag == 'content') {
          this.templateHdForm.patchValue({
            profileID: value.selectedItem['ProfileID'],
            profileCode: value.selectedItem['ProfileCode'],
            profileName: value.selectedItem['ProfileName'],
          });
        } else {
          this.exportRangeForm.patchValue({
            profileID: value.selectedItem['ProfileID'],
            profileName: value.selectedItem['ProfileName'],
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
                this.exportRangeForm.patchValue({
                  sampleTypeID: sampleTypes[0].sampleTypeID,
                  sampleTypeName: sampleTypes[0].sampleTypeName,
                });
              } else {
                this.exportRangeForm.patchValue({
                  sampleTypeID: ``,
                  sampleTypeName: ``
                });
              }
            }, (err) => {
              console.log('set picker error >> ', err);
            });
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  onSiteNameBlur = (ev: any) => {
    if (!ev.target.value) {
      return this.exportRangeForm.patchValue({
        fromSiteID: '',
        fromSiteName: '',
      });
    }

    const item = {
      sqlSelect: `it.*, parent.SiteName as ParentSiteName `,
      sqlFrom: `LEFT OUTER JOIN MSSite as parent On (parent.SiteID = it.ParentSiteID)`,
      sqlWhere: `it.siteName = '${ev.target.value}' `
    };

    try {
      this.getMSSite(item)
        .subscribe((res) => {
          res = this.utilService.camelizeKeys(res);
          if (res.data.mSSites.length <= 0) {
            this.exportRangeForm.patchValue({
              fromSiteID: '',
              fromSiteName: '',
            });
            return this.openSitePicker();
          }

          const sites: MSSiteModel[] = res.data.mSSites as MSSiteModel[];
          this.exportRangeForm.patchValue({
            fromSiteID: sites[0].siteID,
            fromSiteName: sites[0].siteName,
          });
        }, (error) => {
          this.exportRangeForm.patchValue({
            fromSiteID: '',
            fromSiteName: '',
          });
        });

    } catch (err) {
      this.handleError(err);
    }
  }

  onProfileBlur = (ev: any) => {
    if (!ev.target.value) {
      return this.exportRangeForm.patchValue({
        profileID: '',
        profileCode: '',
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
            this.exportRangeForm.patchValue({
              profileID: '',
              profileCode: '',
              profileName: '',
              sampleTypeID: '',
              sampleTypeName: ''
            });
            return this.openLabProfilePicker();
          }

          const profiles: MSLabProfileModel[] = res.data.mSLabProfiles as MSLabProfileModel[];
          // console.log('profiles >> ', profiles);
          this.exportRangeForm.patchValue({
            profileID: profiles[0].profileID,
            profileName: profiles[0].profileName,
          });

          const sampleFound = profiles.find((e, index) => e.sampleTypeDefault === true);
          if (sampleFound) {
            this.exportRangeForm.patchValue({
              sampleTypeID: sampleFound.sampleTypeID,
              sampleTypeName: sampleFound.sampleTypeName
            });
          } else {
            this.exportRangeForm.patchValue({
              sampleTypeID: '',
              sampleTypeName: ''
            });
          }

        }, (error) => {
          this.exportRangeForm.patchValue({
            profileID: '',
            profileCode: '',
            profileName: '',
            sampleTypeID: '',
            sampleTypeName: ''
          });
        });

    } catch (err) {
      this.handleError(err);
    }

  }

  getMSSite(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mssite/getByCondition', item).pipe(retry(1));
  }

  getMSLabProfile(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabprofile/getByCondition', item).pipe(retry(1));
  }

  getMSLabSampleType(item: any): Observable<any> {
    return this.repoService.getDataParm('api/mslabsampletype/getByCondition', item).pipe(retry(1));
  }

}

export enum ColumnGroupLabel {
  WITH = 'Com estoque',
  WITHOUT = 'Sem estoque'
}
export class ColumnGroup {
  label: string; // ColumnGroupLabel;
  items: IEColumnListInternalModel[];
}

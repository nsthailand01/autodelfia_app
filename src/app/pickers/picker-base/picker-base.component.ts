import { Component, OnInit, EventEmitter, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppInjectorService } from '@app/services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-picker-base',
  templateUrl: './picker-base.component.html',
  styleUrls: ['./picker-base.component.scss']
})
export class PickerBaseComponent implements OnInit {
  public whereClause: string;
  public pickItems: Array<any> = [];
  public selectedItem: any;
  public selectedItems: any = [];
  public queryString: any;
  public textFilter: string = '';

  public title: string;
  public isLoading = false;
  public pageConfig: any;

  protected spinner: NgxSpinnerService;

  protected bsModalService: BsModalService;
  @Output() public action = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef
  ) {
    try {
      const injector = AppInjectorService.getInjector();
      // this.appService = injector.get(AppService);
      // this.pickerService = injector.get(PickerService);
      // this.notiService = injector.get(ToastrService);
      this.bsModalService = injector.get(BsModalService);
      this.spinner = injector.get(NgxSpinnerService);

      this.pageConfig = {
        itemsPerPage: 20,
        currentPage: 1,
        totalItems: this.pickItems.length
      };
    } catch (e) {
      console.log('Failed initializing dependencies', e);
    }
  }

  ngOnInit(): void {
    this.doLoadData();
  }

  public highlightRow(item) {
    this.selectedItem = item;
  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

  public openPick(template: TemplateRef<any>) {
    this.bsModalRef = this.bsModalService.show(template);
  }

  public onSelected(): void {
    // console.log('on picker base emit >> ', this.selectedItem);
    this.action.emit({ selectedItem: this.selectedItem, isCancel: false });
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }

  public onCancel(): void {
    this.action.emit({ selectedItems: null, isCancel: true });
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }

  protected doLoadData() {

  }

}

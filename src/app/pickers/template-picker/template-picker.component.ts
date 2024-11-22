import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PickerBaseComponent } from '../picker-base/picker-base.component';

@Component({
  selector: 'app-template-picker',
  templateUrl: './template-picker.component.html',
  styleUrls: ['./template-picker.component.scss']
})
export class TemplatePickerComponent extends PickerBaseComponent implements OnInit {
  public pickItems: Array<any> = [];
  isLoading = false;
  title = '';

  constructor(
    public bsModalRef: BsModalRef
  ) {
    super(bsModalRef);
  }

  ngOnInit(): void {
  }

  doLoadData() {
    try {
      // this.isLoading = true;
      // const item = new EmItemEntity();
      // const currentOrg = this.appService.getOrgLogin();

      // item.orgCode = currentOrg?.parentCode;
      // item.branchOrgCode = currentOrg?.orgCode;
      // this.pickerService.doLoadItems(item)
      //   .subscribe((response) => {
      //     this.pickItems = response.data.emItems;
      //     this.isLoading = false;
      //   },
      //     (err) => {
      //       this.isLoading = false;
      //     });
    } catch (err) {
      // this.isLoading = false;
      // console.log('Load item-pick catch >> ', err);
    }

  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

}

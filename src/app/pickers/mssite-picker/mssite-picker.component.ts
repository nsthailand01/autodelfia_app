import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FilterPipe } from 'ngx-filter-pipe';
import { PickerBaseComponent } from '../picker-base/picker-base.component';
import { PickerService } from '../picker.service';

@Component({
  selector: 'app-mssite-picker',
  templateUrl: './mssite-picker.component.html',
  styleUrls: ['./mssite-picker.component.scss']
})
export class MssitePickerComponent extends PickerBaseComponent implements OnInit {
  public filterExp: any;

  constructor(
    public bsModalRef: BsModalRef,
    private pickerService: PickerService,
    private filterPipe: FilterPipe
  ) {
    super(bsModalRef);

    this.queryString = { SiteName: '' };
    // console.log(filterPipe.transform(this.pickItems, { SiteName: 'พะ' }));
    this.filterExp = { $or: [{ SiteName: this.textFilter }, { SiteNameEng: this.textFilter }] };
  }

  ngOnInit(): void {
    this.doLoadData();
  }

  doLoadData() {
    try {
      this.spinner.show();
      const item = {
        sqlSelect: `it.*, parent.SiteName as ParentSiteName`,
        sqlFrom: `Left Outer Join MSSite as parent On (parent.SiteID = it.ParentSiteID)`,
        sqlWhere: this.whereClause
      };

      this.pickerService.getMSSitesByCondition(item)
        // tslint:disable-next-line: deprecation
        .subscribe((response) => {
          this.pickItems = response.data.MSSites;
          // console.log('pickItems :: ', this.pickItems);
        }, (err) => {
          console.log('err >> ', err);
        });

      this.spinner.hide();

    } catch (err) {
      this.spinner.hide();
    }
  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

}

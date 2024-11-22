import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { PickerService } from '../picker.service';
import { PickerBaseComponent } from '../picker-base/picker-base.component';

@Component({
  selector: 'app-sent-samplehd-picker',
  templateUrl: './sent-samplehd-picker.component.html',
  styleUrls: ['./sent-samplehd-picker.component.scss']
})
export class SentSamplehdPickerComponent extends PickerBaseComponent implements OnInit {
  siteID: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private spiner: NgxSpinnerService,
    private pickerService: PickerService
  ) {
    super(bsModalRef);
  }

  ngOnInit(): void {
    this.doLoadData();
  }

  doLoadData() {
    try {
      this.spiner.show();

      //const item = {
      //  sqlSelect: `it.*, site.SiteName, (sentToSite.SiteName) as SentToSiteName`,
      //  sqlFrom: `Left Outer Join MSSite as site On (site.SiteID = it.SiteID)` +
      //    `Left Outer Join MSSite as sentToSite On (sentToSite.SiteID = it.SentToSiteID)`
      //};

      const item = {
        sqlSelect: `it.*`,
        sqlWhere: `isnull(SentSampleNo, '') != '' `,
        sqlOrder: `SentSampleNo desc`
      };

      item.sqlWhere += this.siteID ? ` and siteid = '${this.siteID}' ` : ''



      this.pickerService.getLISSentSampleHDByCondition(item)
        // tslint:disable-next-line: deprecation
        .subscribe((response) => {
          this.pickItems = response.data.LISSentSampleHDs;
        }, (err) => {
          console.log('err >> ', err);
        });

      this.spiner.hide();

    } catch (err) {
      this.spiner.hide();
    }
  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

}

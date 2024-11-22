import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { LISSentSampleHDModel, RequestsModel } from '@app/models';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { UtilitiesService } from '@app/services';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-print-labno-barcode',
  templateUrl: './print-labno-barcode.component.html',
  styleUrls: ['./print-labno-barcode.component.scss']
})
export class PrintLabnoBarcodeComponent extends BaseComponent implements OnInit {
  public requestLists: Array<RequestsModel>;
  today = new Date().toLocaleDateString('th-TH');
  timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  PrintSerials = [{
    SerialId: '1163-000001',
    Name: 'A'
  },
  {
    SerialId: '1163-000002',
    Name: 'B'
  },
  {
    SerialId: '1163-000003',
    Name: 'C'
  }];

  constructor(
    private router: Router,
    private location: Location,
    private utilService: UtilitiesService,
    private requestsRepoServie: RequestsRepoService,
  ) {
    super();
    this.doLoadData();
  }

  ngOnInit(): void {
  }

  public goBack = () => {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  doLoadData = () => {
    const storageData = sessionStorage.getItem('LISSentSampleHDDataStorage');
    const objData = JSON.parse(storageData) as LISSentSampleHDModel;

    if (objData != null) {
      console.log('testtttttttttttttt');
      this.requestsRepoServie
        .getRequestsById({
          sqlSelect: `it.*, type.SampleTypeName, site.SiteName, profile.ProfileName `,
          sqlFrom: `Left Outer Join MSLabSampleType as type On (type.SampleTypeID = it.SampleTypeID) ` +
            `Left Outer Join MSSite as site On (site.SiteID = it.SiteID)` +
            `Left Outer Join MSLabProfile as profile On (profile.ProfileID = it.ProfileID) `,
          sqlWhere: `it.SentSampleID = '${objData.sentSampleID}'`,
          sqlOrder: `it.LabNumber Asc`
        })
        // tslint:disable-next-line: deprecation
        .subscribe(
          (res) => {
            res = this.utilService.camelizeKeys(res);
            this.requestLists = res.data.requests;
          },
          (err) => {
            this.handleError(err);
          }
        );
    }

  }

  public calculateAge = (birthday: Date) => {
    return this.utilService.calculateAge(birthday);
  }

  // printItem(itemToPrint: PrintItem) {
  //   // this.printerService.printPrintItem(itemToPrint);
  // }

  printDiv(divId, title) {
    const mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');

    mywindow.document.write(`<html><head><title>${title}</title>`);
    mywindow.document.write('</head><body class="font-kanit">');
    mywindow.document.write(document.getElementById(divId).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;

  }

  public printTheBarcode() {
    window.print();
  }

}

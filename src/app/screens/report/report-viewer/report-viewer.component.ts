import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { DxReportViewerComponent } from 'devexpress-reporting-angular';
// import DevExpress from 'devexpress-reporting/dx-webdocumentviewer';
// import { ActionId } from 'devexpress-reporting/scopes/reporting-viewer';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { ConfigLoaderService } from '@app/services/config-loader/config-loader.service';

import { environment } from './../../../../environments/environment';
// import devConfig from './../../../../assets/configs/appsettings.dev.json';
// import prodConfig from './../../../../assets/configs/appsettings.json';
// const config = environment.production ? prodConfig : devConfig;

@Component({
  selector: 'app-report-viewer',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './report-viewer.component.html',
  // styleUrls: ['./report-viewer.component.scss'],
  styleUrls: [
    './report-viewer.component.scss',
    '../../../../../node_modules/jquery-ui/themes/base/all.css',
    '../../../../../node_modules/devextreme/dist/css/dx.common.css',
    '../../../../../node_modules/devextreme/dist/css/dx.light.css',
    '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css',
    '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css',
    '../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css'
  ]
})
export class ReportViewerComponent extends BaseComponent implements OnInit {
  @ViewChild(DxReportViewerComponent, { static: false }) viewer: DxReportViewerComponent;
  reportUrl: string = '';
  hostUrl: string = 'http://localhost:54114/';
  // invokeAction: string = '/api/reports';
  invokeAction: string = '/DXXRDV';

  reportParam: string = '';
  reportName: string = '';
  sqlWhere: string = '';
  reportOption: string = '';
  printOption: string = '';

  decryptedString: string = '';
  dataValue: any = {};

  constructor(
    @Inject(APP_BASE_HREF) baseUrl: string,
    private platformLocation: PlatformLocation,
    private route: ActivatedRoute,
    private router: Router,
    private configLoaderService: ConfigLoaderService
  ) {
    super();

    // this.hostUrl = (config as any)['API_ENDPOINTS']['API_URI'];
    this.hostUrl = this.configLoaderService?.appConfig?.API_ENDPOINTS?.API_URI;
    console.log('baseUrl >> ', baseUrl);

    const host = (this.platformLocation as any).location.pathname;
    this.hostUrl = environment.production ? host : this.hostUrl;
    console.log('hostUrl >> ', this.hostUrl);
  }

  ngOnInit(): void {
    // this.route.params.subscribe((params: Params) => this.reportParam = params['reportName']);
    // console.log('report name >> ', this.reportParam);

    // this.route
    //   .queryParams
    //   .subscribe(params => {
    //     this.reportName = params['report'] || '';
    //     this.sqlWhere = params['sqlWhere'] || '';
    //     this.reportOption = params['reportOpt'] || '';
    //     this.printOption = params['printOpt'] || '';
    //   });

    this.route
      .queryParams
      .subscribe((res) => {
        this.dataValue = res.data;
      });

    this.decryptedString = this.decryptUsingAES256(this.dataValue);
    console.log('decrypted => ', this.decryptedString);

    this.reportName = this.dataValue.reportName;

    // console.log('reportName >> ', this.reportName);
    // console.log('sqlWhere >> ', this.sqlWhere);
    this.reportUrl = this.dataValue;
    // this.reportUrl = this.reportName + `?sqlWhere=${this.sqlWhere}&reportOpt=${this.reportOption}&printOpt=${this.printOption}`;
    console.log('this.reportUrl => ', this.reportUrl);

    console.log('host url xx => ', this.hostUrl);
  }

  customizeMenuActions(event: any) {
    // event.Actions.push({
    //   text: 'Refresh',
    //   imageTemplateName: 'refresh',
    //   visible: true,
    //   disabled: false,
    //   hasSeparator: false,
    //   hotKey: { ctrlKey: true, keyCode: 'Z'.charCodeAt(0) },
    //   clickAction: () => {
    //     // s.GetCurrentTab().refresh();
    //   }
    // });


    // const search = event.args.GetById(DevExpress.Reporting.Viewer.ActionId.Search);
    // const toolbarPart = event.args.GetById(PreviewElements.Toolbar);
    // const index = event.args.Elements.indexOf(toolbarPart);
    // event.args.Elements.splice(index, 1);

    // const printAction = event.args.GetById(DevExpress.Reporting.Viewer.ActionId.Print);
    // if (printAction) {
    //   printAction.visible = false;
    // }
    // const printPageAction = event.args.GetById(DevExpress.Reporting.Viewer.ActionId.PrintPage);
    // if (printPageAction) {
    //   printPageAction.visible = false;
    // }
  }

  beforeRender(pEvent: any) {
    pEvent.args.reportPreview.zoom(1.15);
    pEvent.args.reportPreview.showMultipagePreview(true);
  }

  parametersSubmitted(event: any) {
    // event.args.Parameters.filter((p: { Key: string; }) => p.Key == 'id')[0].Value = '1';
  }

  print() {
    // this.viewer.bindingSender.Print();
  }

}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { AuthenticationService } from '@app/services';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';
import { AutoLogoutService } from '@app/services/auto-logout.service';
import { ConfigLoaderService } from '@app/services/config-loader/config-loader.service';

declare const App: any;

@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.scss']
})
export class AppmenuComponent implements OnInit, AfterViewInit {

  public apptitlelogin1 = require('package.json').titlelogin1;
  public apptitlelogin2 = require('package.json').titlelogin2;
  public hiddenAdmin1 = require('package.json').hidden_admin_1;
  public hiddenAdmin2 = require('package.json').hidden_admin_2;
  public pathImage = require('package.json').logoAdmin;
  public pathImageEdit = require('package.json').EditlogoAdmin;


  employeeName: string = '';
  checkRoleLab: string = 'd-none';
  forDepartureHospital: boolean = false;
  forScienceCenter: boolean = false;
  userType: string = 'center';
  config: any;
  appTitle: string = '';
  constructor(
    private authService: AuthenticationService,
    private snotifyService: SnotifyService,
    private router: Router,
    private autoLogoutService: AutoLogoutService,
    private cfgLoaderService: ConfigLoaderService,
    private configLoaderService: ConfigLoaderService,
  ) {
    this.config = this.cfgLoaderService.appConfig;

    this.authService.currentUser.subscribe((user: any) => {
      if (user !== null) {
        //this.employeeName = user.data?.SecurityUsers?.EmployeeName == '' ? user.data?.SecurityUsers?.UserName : user.data?.SecurityUsers?.EmployeeName;
        this.employeeName = user.data?.SecurityUsers?.OfficerName || user.data?.SecurityUsers?.EmployeeName || user.data?.SecurityUsers?.UserName;
        this.forDepartureHospital = user.data?.SecurityUsers?.ForDepartureHospital;
        this.forScienceCenter = user.data?.SecurityUsers?.ForScienceCenter;
        this.userType = this.forScienceCenter ? 'ScienceCenter' : 'Departure';
      }
    });


    const config = this.configLoaderService?.appConfig;
    this.appTitle = (config?.APP_TITLE_NAME) ?? this.appTitle;
  }

  ngOnInit(): void {
    App.initMainPage();
    this.CheckRoleType();
    // this.autoLogoutService.initialize();
  }

  CheckRoleType = () => {
    this.authService.currentUser.subscribe((user: any) => {
      if (user !== null) {
        //this.employeeName = user.data?.SecurityUsers?.EmployeeName == '' ? user.data?.SecurityUsers?.UserName : user.data?.SecurityUsers?.EmployeeName;
        if (this.forScienceCenter == true) {
          this.checkRoleLab = '';
        }
      }
    });
  }


  ngAfterViewInit() {
    // $('[data-widget="treeview"]').each(function() {
    //   AdminLte.Treeview._jQueryInterface.call($(this), 'init');
    // });
  }

  subIsActive(input) {
    const paths = Array.isArray(input) ? input : [input];
    return paths.some(path => {
      return this.router.url.indexOf(path) === 0; // current path starts with this path string
    });
  }

  subMenuIsActive(menu: string) {
    switch (menu) {
      // case 'objective':
      //   return this.subIsActive(['/objective/lists', '/objective/create', '/objective/edit']);
      case 'sent-sample':
        return this.subIsActive(['/sent-sample/lists', '/sent-sample/create', '/sent-sample/edit']);
      case 'receive-sample':
        return this.subIsActive(['/receive-sample/lists', '/receive-sample/create', '/receive-sample/edit', '/receive-sample/print-barcode']);
      case 'delivery-note':
        return this.subIsActive(['/delivery-note/lists', '/delivery-note/create', '/delivery-note/edit']);
      case 'request-sample':
        return this.subIsActive(['/request-sample/lists', '/request-sample/create', '/request-sample/edit']);
      case 'import-form':
        return this.subIsActive(['/import-form/lists', '/import-form/create', '/import-form/edit']);
      case 'export-form':
        return this.subIsActive(['/export-form/lists', '/export-form/create', '/export-form/edit']);
      case 'import-export':
        return this.subIsActive(['/import-export/lists', '/import-export/create', '/import-export/edit']);
      case 'approve-center':
        return this.subIsActive(['/approve-center/lists', '/approve-center/create', '/approve-center/edit']);
      case 'objective':
        return this.subIsActive(['/master-file/objective/lists', '/master-file/objective/create', '/master-file/objective/edit']);
      case 'sample-type':
        return this.subIsActive(['/master-file/sample-type/lists', '/master-file/sample-type/create', '/master-file/sample-type/edit']);
      case 'department':
        return this.subIsActive(['/master-file/department/lists', '/master-file/department/create', '/master-file/department/edit']);
      case 'mssite':
        return this.subIsActive(['/master-file/mssite/lists', '/master-file/mssite/create', '/master-file/mssite/edit']);
      case 'mssite-group':
        return this.subIsActive(['/master-file/mssite-group/lists', '/master-file/mssite-group/create', '/master-file/mssite-group/edit']);
      case 'position':
        return this.subIsActive(['/master-file/position/lists', '/master-file/position/create', '/master-file/position/edit']);
      case 'lab-group':
        return this.subIsActive(['/master-file/lab-group/lists', '/master-file/lab-group/create', '/master-file/lab-group/edit']);
      case 'account':
        return this.subIsActive(['/account/list', '/account/create', '/account/edit']);
      case 'employee':
        return this.subIsActive(['/master-file/employee/list', '/master-file/employee/create', '/master-file/employee/edit']);
      case 'app-settings':
        return this.subIsActive(['/app-settings', '/app-settings/create', '/app-settings/edit']);
      case 'register-patient':
        return this.subIsActive(['/register-patient', '/register-patient/create', '/register-patient/edit', '/register-sample/create/register']);
      case 'dmsinvoice':
        return this.subIsActive(['/dmsinvoice/lists']);
      case 'dmsreceive':
        return this.subIsActive(['/dmsreceive/lists']);

    }
  }

  mainMenuSubIsActive() {
    const paths = [
      '/sent-sample/lists', '/sent-sample/create', '/sent-sample/edit',
      '/receive-sample/lists', '/receive-sample/create', '/receive-sample/edit', '/receive-sample/print-barcode',
      '/delivery-note/lists', '/delivery-note/create', '/delivery-note/edit',
      '/request-sample/lists', '/request-sample/create', '/request-sample/edit',
      '/import-form/lists', '/import-form/create', '/import-form/edit',
      '/export-form/lists', '/export-form/create', '/export-form/edit',
      '/import-export/lists', '/import-export/create', '/import-export/edit',
      '/approve-center/lists', '/approve-center/create', '/approve-center/edit',
      '/patient-record',
      '/register-patient/create', '/register-sample/create/register', '/dmsinvoice/lists', '/dmsreceive/lists'
    ];
    return paths.some(path => {
      return this.router.url.indexOf(path) === 0; // current path starts with this path string
    });
  }

  settingsSubIsActive() {
    const paths = [
      '/master-file/objective/lists', '/master-file/objective/create', '/master-file/objective/edit',
      '/master-file/sample-type/lists', '/master-file/sample-type/create', '/master-file/sample-type/edit',
      '/master-file/department/lists', '/master-file/department/create', '/master-file/department/edit',
      '/master-file/mssite/lists', '/master-file/mssite/create', '/master-file/mssite/edit',
      '/master-file/mssite-group/lists', '/master-file/mssite-group/create', '/master-file/mssite-group/edit',
      '/master-file/position/lists', '/master-file/position/create', '/master-file/position/edit',
      '/master-file/lab-group/lists', '/master-file/lab-group/create', '/master-file/lab-group/edit',
      '/master-file/employee/lists', '/master-file/employee/create', '/master-file/employee/edit'
    ];
    return paths.some(path => {
      return this.router.url.indexOf(path) === 0;
    });
  }

  logout() {
    const icon = `assets/img/warning.svg`;
    this.authService.logout();
    this.router.navigate(['/login']);
    this.autoLogoutService.logout();
    this.snotifyService.success('Logged out successfull', 'Logged out', { icon });
  }

}

import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { SnotifyPosition, SnotifyService, SnotifyToastConfig } from 'ng-snotify';
import { Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { AuthenticationService } from '@app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { AutoLogoutService } from '@app/services/auto-logout.service';
import { ConfigLoaderService } from '@app/services/config-loader/config-loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
  public appVersion = require('package.json').version;
  public appBuildDate = require('package.json').buildDate;
  public apptitleName1 = require('package.json').title1;
  public apptitleName2 = require('package.json').title2;
  public pathImage = require('package.json').logoLogin;
  public pathImageEdit = require('package.json').EditlogoLogin;
  public hiddenLogin1 = require('package.json').hidden1;
  public hiddenLogin2 = require('package.json').hidden2;
   appTitle: string = '';


  public loginForm: FormGroup;
  returnUrl: string;
  valueSub: Subscription;
  isUsernameValid: boolean = false;
  isUserPasswordValid: boolean = false;
  private externalScript: any;

  constructor(
    private renderer: Renderer2,
    private snotifyService: SnotifyService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private autoLogoutService: AutoLogoutService,
    private configLoaderService: ConfigLoaderService,
  ) {
    super();
    const config = this.configLoaderService?.appConfig;
    this.appTitle = (config?.APP_TITLE_NAME) ?? this.appTitle;
  }

  get formData() { return this.loginForm.controls; }

  renderExternalScript(src: string): HTMLScriptElement {
    this.externalScript = document.createElement('script');
    // this.externalScript.type = 'text/javascript';
    this.externalScript.src = src;
    this.externalScript.id = 'login-main';
    // this.externalScript.async = true;
    // this.externalScript.defer = true;
    this.renderer.appendChild(document.body, this.externalScript);
    return this.externalScript;
  }

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]);
    }

    console.log('init ');
    const loginScript = document.getElementById('login-main');
    console.log('loginScript ', loginScript);
    if (!document.getElementById('login-main')) {
      this.renderExternalScript('assets/js/login/login-main.js').onload = () => {
        // do something with this library
        console.log('script loaded...');
      };
    }


    // this.snotifyService.success('Example body content', 'Example title', {
    //   timeout: 2000,
    //   showProgressBar: false,
    //   closeOnClick: false,
    //   pauseOnHover: true
    // });

    const latesUsername = localStorage.getItem('latestUsernameDown');

    this.loginForm = this.formBuilder.group({
      username: [latesUsername, Validators.required],
      password: ['', Validators.required]
    });

    this.valueSub = this.loginForm.valueChanges.subscribe(value => {
      // // Get label
      // const inputId = this.el.nativeElement.getAttribute('id'),
      //   label = document.querySelector(`label[for="${inputId}"]`);

      // // Toggle `active` class
      // if (label) {
      //   label.classList.toggle('active', value);
      // }
    });

    this.isUsernameValid = this.formData.username.valid;
    this.isUserPasswordValid = this.formData.password.valid;
  }

  ngOnDestroy() {
    console.log('login destroy...');
    const me = document.getElementById('login-main');
    // console.log('me >> ', me);
    this.valueSub.unsubscribe();
    me.parentNode.removeChild(me);
    // this.renderer.removeChild(document.body, me);
  }

  onTest() {
    this.snotifyService.error('Example error!', 'Here we are', {
      closeOnClick: false
    });
  }

  onSimple() {
    const icon = `../../../assets/img/warning.svg`;
    // const icon = `https://placehold.it/48x100`;
    // const icon = `https://image.flaticon.com/icons/svg/3154/3154187.svg`;
    this.snotifyService.success('this.body', 'this.title', { icon });
  }

  onSubmit() {
    this.spinner.show();

    const icon = `assets/img/warning.svg`;
    // const icon = `https://image.flaticon.com/icons/svg/3154/3154187.svg`;
    try {
      this.authService.login(this.formData.username.value, this.formData.password.value)
        .pipe(first())
        // tslint:disable-next-line: deprecation
        .subscribe(
          (data: any) => {
            this.spinner.hide();
            const res = Object.values(data);
            this.router.navigate([this.returnUrl]);
            this.snotifyService.success('Login Success', 'Logged in', { icon });
            this.autoLogoutService.initialize();
          },
          (err) => {
            this.spinner.hide();
            console.log('error >> ', err);
            return this.handleError(err);
          });
    }
    catch (error) {
      console.error(error);
      this.handleError(error);
      this.spinner.hide();
    }
  }

  setFocus(nextControl: string) {
    const element = document.getElementById(nextControl);

    if (element == null) {
      return;
    }
    else {
      element.focus();
    }
  }

}

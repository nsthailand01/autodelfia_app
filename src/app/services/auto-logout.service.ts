import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MpAppSettingsModel } from '@app/models/mpappsettings.model';
import { MpAppSettingsService } from '@app/screens/app-settings/mp-app-settings.service';
import { Subscription, timer } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { UtilitiesService } from './utilities.service';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';

let MINUTES_UNITL_AUTO_LOGOUT = 10 // in mins
const CHECK_INTERVAL = 5000 // in ms
const STORE_KEY = 'lastAction';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  public timerInterval: any;
  public val: any;
  public tick = 1000;
  public countDown: Subscription;
  public counter = (MINUTES_UNITL_AUTO_LOGOUT * 60) + 1;

  private appSettingsModel: MpAppSettingsModel = {} as MpAppSettingsModel;

  public onCountDownCounter: EventEmitter<any> = new EventEmitter();

  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }

  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }
  UserID: string = '';
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private appSettingsService: MpAppSettingsService,
    private utilService: UtilitiesService,
    private sentSampleService: SentSampleService,
  ) {
    console.log('::auto-logout-service::');
    this.initialize();

    // this.onCountDownCounter.emit(this.counter);
  }

  initialize = () => {
    this.loadSettings();

    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY, Date.now().toString());

    this.countDown = timer(0, this.tick).subscribe(() => {
      --this.counter;
      this.onCountDownCounter.emit(this.counter);
    });
  }

  loadSettings = () => {









    this.appSettingsService.getAll()
      .subscribe(res => {
        console.log('res => ', res);
        this.appSettingsModel = new MpAppSettingsModel();
        if (res.data.MpAppSettings.length > 0) {
          const response = this.utilService.camelizeKeys(res.data.MpAppSettings[0]);
          this.appSettingsModel = Object.assign({}, response);
        }

        console.log('this.appSettingsModel => ', this.appSettingsModel);





        this.authService.currentUser.subscribe((user: any) => {
          if (user != null) {
            this.UserID = user?.data?.SecurityUsers?.UserID;
          }
        });
        const query = ` SELECT  MinAmount
                    FROM Security_Users
                   Where UserID = '${this.UserID}'
                         `;
        const response = this.sentSampleService.query({ queryString: query });
        response.then(data => {
          //console.log('Response => ', data.data.response);
          for (let el of data.data.response) {

            if (el.minAmount != null) {
              MINUTES_UNITL_AUTO_LOGOUT = el.minAmount;
              this.counter = MINUTES_UNITL_AUTO_LOGOUT * 60;
            } else {
              MINUTES_UNITL_AUTO_LOGOUT = 0;
              this.counter = MINUTES_UNITL_AUTO_LOGOUT * 60;
            }
          }

        });





        //console.log('MINUTES_UNITL_AUTO_LOGOUT => ', MINUTES_UNITL_AUTO_LOGOUT);
      })
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
    window.addEventListener("storage", () => this.storageEvt());

  }

  reset() {
    //console.log('date got by using events', Date.now());
    this.setLastAction(Date.now());
    // console.log('store key', localStorage.getItem(STORE_KEY));
    this.counter = (MINUTES_UNITL_AUTO_LOGOUT * 60) + 1;
  }

  initInterval() {
    this.timerInterval = setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    //console.log('difference', diff)
    const isTimeout = !diff || (diff < 0);

    if (isTimeout) {
      localStorage.clear();
      this.logout();
    }
  }

  storageEvt() {
    // console.log("storage");
    this.val = localStorage.getItem(STORE_KEY);
  }

  logout() {
    clearInterval(this.timerInterval);
    this.countDown?.unsubscribe();
    this.countDown = null;

    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

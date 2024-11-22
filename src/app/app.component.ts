import { AuthenticationService } from '@app/services';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { AutoLogoutService } from './services/auto-logout.service';

export let browserRefresh = false;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // counter = 300;

  title = 'AutoDelfia';
  subscription: Subscription;

  // constructor(@Inject(APP_BASE_HREF) baseUrl: string) {
  //  console.log('APP_BASE_HREF > ', baseUrl);
  // }

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private autoLogoutService: AutoLogoutService,
  ) {

    // this.autoLogoutService.onCountDownCounter.subscribe((v) => {
    //   this.counter = v;
    // });

    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    });
  }

  ngOnDestroy(): void {
    // this.authenticationService.logoutOnClose().subscribe(res => {
    //   localStorage.removeItem('currentUser');
    // };

    this.authService.logout();
    // this.router.navigate(['/login']);
  }

  ngOnInit() {
    console.log('app component init');
    // $('[data-widget="treeview"]').Treeview('init');
  }
}

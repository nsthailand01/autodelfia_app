import { Component, Input, OnInit } from '@angular/core';
import { AutoLogoutService } from '@app/services/auto-logout.service';
declare var require: any;

@Component({
  selector: 'app-appfooter',
  templateUrl: './appfooter.component.html',
  styleUrls: ['./appfooter.component.scss']
})
export class AppfooterComponent implements OnInit {
  @Input() millisecCouter: number;

  public appVersion = require('package.json').version;
  public appBuildDate = require('package.json').buildDate;

  public counter = 300;

  constructor(
    private autoLogoutService: AutoLogoutService,
  ) {
    this.counter = this.millisecCouter ?? 300;

    this.autoLogoutService.onCountDownCounter.subscribe((v) => {
      this.counter = v;
    });
  }

  ngOnInit(): void {
  }

}

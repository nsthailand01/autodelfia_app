import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-navigator',
  templateUrl: './breadcrumb-navigator.component.html',
  styleUrls: ['./breadcrumb-navigator.component.scss']
})
export class BreadcrumbNavigatorComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() currentPageName: string;
  @Input() listPageUrl: string = '/';

  constructor() { }

  ngOnInit(): void {
  }

}

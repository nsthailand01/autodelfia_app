import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { UtilitiesService } from '@app/services';

@Component({
  selector: 'app-diagnostic-result-amniotic-tab',
  templateUrl: './diagnostic-result-amniotic-tab.component.html',
  styleUrls: ['./diagnostic-result-amniotic-tab.component.scss']
})
export class DiagnosticResultAmnioticTabComponent extends BaseComponent implements OnInit {
  @Input() requestsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private requestsRepoService: RequestsRepoService,
    private utilService: UtilitiesService
  ) {
    super();
  }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { ResultsModel } from '@app/models/results.model';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { UtilitiesService } from '@app/services';

@Component({
  selector: 'app-nipt-result-tab',
  templateUrl: './nipt-result-tab.component.html',
  styleUrls: ['./nipt-result-tab.component.scss']
})
export class NiptResultTabComponent extends BaseComponent implements OnInit {
  @Input() requestsForm: FormGroup;
  public resultsLists: Array<ResultsModel>;

  constructor(
    private fb: FormBuilder,
    private requestsRepoService: RequestsRepoService,
    private utilService: UtilitiesService
  ) {
    super();
  }


  ngOnInit(): void {
    this.createInitialForm();
    this.doLoadResults();

    // console.log('nipt :: requestsForm >> ', this.requestsForm.value);
  }

  createInitialForm = () => {
    this.resultsLists = new Array<ResultsModel>();
  }

  get resultsForms(): FormArray {
    return this.requestsForm.get('resultsForms') as FormArray;
  }

  doLoadResults = () => {
    const requestId = this.requestsForm.get('requestID').value;
    const item = {
      requestID: ``,
      sqlSelect: `test.TestCode, test.TestName as TestNameText, test.ListNo as ListOrder, it.* `,
      sqlFrom: `RIGHT OUTER JOIN MSLabTest as test on (it.TestID = test.TestID and (it.RequestID = '${requestId}') ) `,
      sqlOrder: 'ListOrder',
      pageIndex: -1
    };

    this.requestsRepoService.getLabResults(item)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.LabResults);
        this.resultsLists = data;
        const results = this.requestsForm.get('resultsForms') as FormArray;
        results.clear();

        this.resultsLists.forEach(elem => {
          results.push(this.fb.group(elem));
        });
      }, (err) => {
        this.handleError(err);
      });
  }


}

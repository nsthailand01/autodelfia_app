import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-patient-profile-tab',
  templateUrl: './patient-profile-tab.component.html',
  styleUrls: ['./patient-profile-tab.component.scss']
})
export class PatientProfileTabComponent implements OnInit {
  @Input() requestsForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  public age: number;
  constructor() { }

  ngOnInit(): void {
    console.log('mores >> ', this.requestsForm.get('patientMoreForms'));
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY'
    });

    const pressureDate = this.requestsForm.get('bloodPressureDate').value;
    const date = new Date(pressureDate)?.toISOString().substring(0, 10);
    console.log('date >> ', date);
    this.requestsForm.get('bloodPressureDate').patchValue(date);

    this.age = this.onBlodDayChange();


  }

  get moreForms(): FormArray {
    return this.requestsForm.get('patientMoreForms') as FormArray;
  }


  onBlodDayChange() {
    const birthday = this.requestsForm.get('birthday').value;
    const sampleDate = this.requestsForm.get('sampleDate').value;
    //console.log('event birthday => ',birthday);
    //console.log('event sampleDate => ', sampleDate);

    if (birthday == null || sampleDate == null || birthday == '' || sampleDate == '') {
      this.age = 0;
    } else {
      const timeDiff = Math.abs(new Date(sampleDate).getTime() - new Date(birthday).getTime());
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }
    return this.age;

  }

}

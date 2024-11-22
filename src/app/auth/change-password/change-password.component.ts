import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OldPasswordValidators } from './old-password.validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form1: FormGroup;

  constructor(fb: FormBuilder) {
    this.form1 = fb.group({
      oldPwd: ['', Validators.required, OldPasswordValidators.shouldBe1234],
      newPwd: ['', Validators.required],
      confirmPwd: ['', Validators.required]
    });
    this.form1.setValidators(OldPasswordValidators.matchPwds);
  }

  ngOnInit(): void {

  }

  get oldPwd() {
    return this.form1.get('oldPwd');
  }

  get newPwd() {
    return this.form1.get('newPwd');
  }

  get confirmPwd() {
    return this.form1.get('confirmPwd');
  }

}

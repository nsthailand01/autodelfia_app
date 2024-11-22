import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from '../layout/auth-layout/auth-layout.component';
import { NoLayoutComponent } from '../layout/no-layout/no-layout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { Register2Component } from './register2/register2.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterUserComponent } from './register-user/register-user.component';

const authRoutes: Routes = [
  { path: '', component: NoLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register2', component: Register2Component },
      { path: 'create-account', component: CreateAccountComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'register-user', component: RegisterUserComponent },
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

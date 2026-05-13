import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MockHomeComponent } from './pages/mock-home/mock-home.component';
import { Instruction } from './pages/instruction/instruction.component';
import { Header1Component } from './layout/header1/header1.component';
import { Header2Component } from './layout/header2/header2.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'mock-home', component: MockHomeComponent },
  { path: 'instruction', component: Instruction },
  { path: 'header1', component: Header1Component },
  { path: 'header2', component: Header2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MockHomeComponent } from './pages/mock-home/mock-home.component';
import { Instruction } from './pages/instruction/instruction.component';
import { Header1Component } from './layout/header1/header1.component';
import { Header2Component } from './layout/header2/header2.component';
import { MockQuestion } from './pages/mock-question/mock-question.component';
import { MockSubmit } from './pages/mock-submit/mock-submit.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SubjectUploadComponent } from './pages/subject-upload/subject-upload.component';
import { MockListComponent } from './pages/mock-list/mock-list.component';
import { SelectMocktestComponent } from './pages/select-mocktest/select-mocktest.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/mock-home', pathMatch: 'full' },
  { path: 'mock-home', component: MockHomeComponent },
  { path: 'exam-home', component: MainLayoutComponent },
  { path: 'select-mocktest', component: SelectMocktestComponent },
  { path: 'instruction', component: Instruction },
  { path: 'header1', component: Header1Component },
  { path: 'header2', component: Header2Component },
  { path: 'mock-question', component: MockQuestion },
  { path: 'mock-submit', component: MockSubmit },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  {path: 'subject-upload/:subject', component: SubjectUploadComponent},
  { path: 'mock-list/:subject', component: MockListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

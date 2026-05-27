import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MockHomeComponent } from './pages/mock-home/mock-home.component';
import { Instruction } from './pages/instruction/instruction.component';
import { Header1Component } from './layout/header1/header1.component';
import { Header2Component } from './layout/header2/header2.component';
import { MockQuestion } from './pages/mock-question/mock-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockSubmit } from './pages/mock-submit/mock-submit.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SubjectUploadComponent } from './pages/subject-upload/subject-upload.component';
import { MockListComponent } from './pages/mock-list/mock-list.component';
import { SelectMocktestComponent } from './pages/select-mocktest/select-mocktest.component';
import { AdminManageboardComponent } from './pages/admin-manageboard/admin-manageboard.component';
import { AdminSidebarComponent } from './layout/admin-sidebar/admin-sidebar.component';
import { StudentRegistrationComponent } from './pages/student-registration/student-registration.component';
import { ScoreManagementComponent } from './pages/score-management/score-management.component';
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';
import { TeacherRegisterComponent } from './teacher-register/teacher-register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TeacherLoginComponent,
    TeacherRegisterComponent,
    MockHomeComponent,
    Instruction,
    Header1Component,
    Header2Component,
    MockQuestion,
    MockSubmit,
    MainLayoutComponent,
    FeedbackComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    SubjectUploadComponent,
    MockListComponent,
    SelectMocktestComponent,
    AdminManageboardComponent,
    AdminSidebarComponent,
    StudentRegistrationComponent,
    ScoreManagementComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MockHomeComponent } from './pages/mock-home/mock-home.component';
import { Instruction } from './pages/instruction/instruction.component';
import { Header1Component } from './layout/header1/header1.component';
import { Header2Component } from './layout/header2/header2.component';
import { Header3Component } from './layout/header3/header3.component';
import { MockQuestion } from './pages/mock-question/mock-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockSubmit } from './pages/mock-submit/mock-submit.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MainLayoutComponent2 } from './layout/main-layout2/main-layout2.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
/* Admin Components */
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminManageboardComponent } from './pages/admin-manageboard/admin-manageboard.component';
import { AdminSidebarComponent } from './layout/admin-sidebar/admin-sidebar.component';
import { StudentRegistrationComponent } from './pages/student-registration/student-registration.component';
/* Teacher Components */
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';
import { TeacherRegistrationComponent } from './pages/teacher-registration/teacher-registration.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherSidebarComponent } from './layout/teacher-sidebar/teacher-sidebar.component';
import { SubjectUploadComponent } from './pages/subject-upload/subject-upload.component';

import { MockListComponent } from './pages/mock-list/mock-list.component';
import { SelectMocktestComponent } from './pages/select-mocktest/select-mocktest.component';

import { ScoreManagementComponent } from './pages/score-management/score-management.component';
import { ExamSelectionComponent } from './pages/exam-selection/exam-selection.component';

import { JeeAdvancedMocktestComponent } from './pages/jee-advanced-mocktest/jee-advanced-mocktest.component';
import { AdvancedInstructionsComponent } from './pages/advanced-instructions/advanced-instructions.component';
import { JeeAdvancedQuestionsComponent } from './pages/jee-advanced-questions/jee-advanced-questions.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TeacherLoginComponent,
    MockHomeComponent,
    Instruction,
    Header1Component,
    Header2Component,
    Header3Component,
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
    TeacherRegistrationComponent,
    ScoreManagementComponent,
    ExamSelectionComponent,
    JeeAdvancedMocktestComponent,
    Header3Component,
    AdvancedInstructionsComponent,
    MainLayoutComponent2,
    JeeAdvancedQuestionsComponent,
    TeacherDashboardComponent,
    TeacherSidebarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [AppComponent],
})
export class AppModule {}

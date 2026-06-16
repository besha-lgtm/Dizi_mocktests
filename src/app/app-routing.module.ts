import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MockHomeComponent } from './pages/mock-home/mock-home.component';
import { Instruction } from './pages/instruction/instruction.component';
import { Header1Component } from './layout/header1/header1.component';
import { Header2Component } from './layout/header2/header2.component';
import { MockQuestion } from './pages/mock-question/mock-question.component';
import { MockSubmit } from './pages/mock-submit/mock-submit.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SubjectUploadComponent } from './pages/subject-upload/subject-upload.component';
import { MockListComponent } from './pages/mock-list/mock-list.component';
import { SelectMocktestComponent } from './pages/select-mocktest/select-mocktest.component';
import { AdminManageboardComponent } from './pages/admin-manageboard/admin-manageboard.component';
import { StudentRegistrationComponent } from './pages/student-registration/student-registration.component';
import { TeacherRegistrationComponent } from './pages/teacher-registration/teacher-registration.component';
import { ScoreManagementComponent } from './pages/score-management/score-management.component';

import { ExamSelectionComponent } from './pages/exam-selection/exam-selection.component';
import { JeeAdvancedMocktestComponent } from './pages/jee-advanced-mocktest/jee-advanced-mocktest.component';
import { Header3Component } from './layout/header3/header3.component';
import { AdvancedInstructionsComponent } from './pages/advanced-instructions/advanced-instructions.component';
import { MainLayoutComponent2 } from './layout/main-layout2/main-layout2.component';
import { JeeAdvancedQuestionsComponent } from './pages/jee-advanced-questions/jee-advanced-questions.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherSidebarComponent } from './layout/teacher-sidebar/teacher-sidebar.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'teacher-login', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/mock-home', pathMatch: 'full' },
  { path: 'mock-home', component: MockHomeComponent },
  { path: 'exam-home', component: MainLayoutComponent },
  { path: 'select-mocktest', component: SelectMocktestComponent },
  { path: 'instruction', component: Instruction },
  { path: 'header1', component: Header1Component },
  { path: 'header2', component: Header2Component },
  { path: 'header3', component: Header3Component },
  { path: 'mock-question', component: MockQuestion },
  { path: 'mock-submit', component: MockSubmit },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'admin-login', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  {path: 'subject-upload/:subject', component: SubjectUploadComponent},
  { path: 'mock-list/:subject', component: MockListComponent },
  {path: 'admin-manageboard', component: AdminManageboardComponent },
  { path: 'student-registration', component: StudentRegistrationComponent },
  { path: 'teacher-registration', component: TeacherRegistrationComponent },
  { path: 'score-management', component: ScoreManagementComponent },
  { path: 'exam-selection', component: ExamSelectionComponent },
  { path: 'jee-mains', component: SelectMocktestComponent, data: { examType: 'JEE Mains' } },
  { path: 'jee-advanced', component: SelectMocktestComponent, data: { examType: 'JEE Advanced' } },
  { path: 'advanced-instructions', component: AdvancedInstructionsComponent },
  { path: 'advanced-home', component: MainLayoutComponent2},
  { path: 'jee-advanced-questions', component: JeeAdvancedQuestionsComponent },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent },
  { path: 'teacher-sidebar', component: TeacherSidebarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

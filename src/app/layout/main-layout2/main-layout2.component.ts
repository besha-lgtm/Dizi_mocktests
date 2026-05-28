import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout2',
  standalone: false,
  templateUrl: './main-layout2.component.html',
  styleUrl: './main-layout2.component.css',
})
export class MainLayoutComponent2 {
  isExamStarted: boolean = false;

  startExam(): void {
    this.isExamStarted = true;
  }
}

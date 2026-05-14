import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styles: ``,
})
export class MainLayoutComponent {
  isExamStarted: boolean = false;

  startExam(): void {
    this.isExamStarted = true;
  }
}

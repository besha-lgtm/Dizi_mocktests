import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styles: ``,
})
export class MainLayoutComponent implements OnInit {
  isExamStarted: boolean = false;
  mockTestId: number = 1;
  examType: string = 'JEE Mains';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idParam = params['mockTestId'];
      this.mockTestId = idParam ? parseInt(idParam, 10) : 1;
      this.examType = params['examType'] || 'JEE Mains';
    });
  }

  startExam(): void {
    this.isExamStarted = true;
  }
}

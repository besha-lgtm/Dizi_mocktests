import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-selection',
  standalone: false,
  templateUrl: './exam-selection.component.html',
  styleUrls: ['./exam-selection.component.css']
})

export class ExamSelectionComponent {

  constructor(
    private router: Router
  ) {}

  // BACK TO HOME
  goBackToHome(): void {

    this.router.navigate(['/mock-home']);

  }

  // JEE MAINS
  navigateToJeeMains(): void {

    this.router.navigate(['/jee-mains']);

  }

  // JEE ADVANCED
  navigateToJeeAdvanced(): void {

    this.router.navigate(['/jee-advanced']);

  }

}
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-feedback',
  standalone: false,
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  options = [
    'Strongly Agree',
    'Agree',
    'Neutral',
    'Disagree',
    'Strongly Disagree'
  ];

  questions = [
    'Communicated clearly',
    'Assigned homework that was relevant to course material',
    'Allowed sufficient time to complete homework assignments',
    'Gave exams that reflected the material covered in lectures and assignments',
    'Provided constructive feedback on graded material'
  ];

  // Store selections: question index -> selected option
  selections: { [key: number]: string } = {};
  showPopup = false;

  constructor(private router: Router) {}

  get allQuestionsAnswered(): boolean {
    return Object.keys(this.selections).length === this.questions.length;
  }

  onSubmit() {
    this.showPopup = true;
    setTimeout(() => {
      this.router.navigate(['/mock-home']);
    }, 5000);
  }
}
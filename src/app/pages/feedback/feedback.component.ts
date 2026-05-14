import { Component } from '@angular/core';

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

  get allQuestionsAnswered(): boolean {
    return Object.keys(this.selections).length === this.questions.length;
  }

  onSubmit() {
    console.log('Feedback submitted:', this.selections);
    alert('Thank you for your feedback! The exam is now complete.');
  }
}

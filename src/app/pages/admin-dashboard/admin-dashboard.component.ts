import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  selectedSubject: string = '';
  selectedFile: File | null = null;

  selectedFileName: string = '';

  excelUploadSuccess: string = '';

  excelUploadError: string = '';

  activeTab: string = 'manual';

  questions: any[] = [
    {
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: ''
    }
  ];

  constructor() {}

  // SELECT SUBJECT
  selectSubject(subject: string): void {
    this.selectedSubject = subject;
  }

  // ADD QUESTION
  addQuestion(): void {

    this.questions.push({
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: ''
    });

  }

  // REMOVE QUESTION
  removeQuestion(index: number): void {

    this.questions.splice(index, 1);

  }

  // SUBMIT QUESTIONS
  submitQuestions(form: NgForm): void {

    // CHECK FORM VALIDATION
    if (form.invalid) {

      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }

    console.log('Uploaded Questions:', this.questions);

    alert('Questions uploaded successfully');

    // RESET FORM
    this.questions = [
      {
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: ''
      }
    ];

    form.resetForm();

  }

  // FILE SELECT
  onFileSelected(event: any): void {

  const file = event.target.files[0];

  if (file) {

    this.selectedFile = file;

    this.selectedFileName = file.name;

    this.excelUploadSuccess = '';

    this.excelUploadError = '';

  }

}
uploadExcelFile(): void {

  // CHECK FILE SELECTED
  if (!this.selectedFile) {

    this.excelUploadError = 'Please select an Excel file';

    this.excelUploadSuccess = '';

    return;

  }

  // SUCCESS MESSAGE
  this.excelUploadSuccess = 'Excel file uploaded successfully';

  this.excelUploadError = '';

  console.log('Uploaded File:', this.selectedFile);

  // AUTO HIDE
  setTimeout(() => {

    this.excelUploadSuccess = '';

  }, 3000);

}

}
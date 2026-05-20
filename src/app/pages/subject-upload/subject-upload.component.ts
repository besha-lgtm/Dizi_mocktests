import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-subject-upload',
  standalone: false,
  templateUrl: './subject-upload.component.html',
  styleUrls: ['./subject-upload.component.css']
})
export class SubjectUploadComponent implements OnInit {

  subject: string = '';

  selectedFile: File | null = null;

  selectedFileName: string = '';

  excelUploadSuccess: string = '';

  excelUploadError: string = '';

  activeTab: string = 'manual';

  questions: any[] = [
    {
      questionText: '',
      questionImage: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: ''
    }
  ];

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.subject = params['subject'];

    });

  }

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

  removeQuestion(index: number): void {

    this.questions.splice(index, 1);

  }

  submitQuestions(form: NgForm): void {

    if (form.invalid) {

      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }

    console.log(
      this.subject + ' Questions',
      this.questions
    );

    alert(
      this.subject + ' Questions Uploaded Successfully'
    );

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

    if (!this.selectedFile) {

      this.excelUploadError =
        'Please Select Excel File';

      return;

    }

    this.excelUploadSuccess =
      this.subject + ' Excel Uploaded Successfully';

    setTimeout(() => {

      this.excelUploadSuccess = '';

    }, 3000);

  }
  onQuestionImageSelected(
  event: any,
  index: number
): void {

  const file = event.target.files[0];

  if (file) {

    const reader = new FileReader();

    reader.onload = () => {

      this.questions[index].questionImage =
        reader.result as string;

    };

    reader.readAsDataURL(file);

  }

}
}
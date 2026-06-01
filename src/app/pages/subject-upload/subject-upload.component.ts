import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  isEditMode: boolean = false;
  examType = '';

  questions: any[] = [
    {
      topic: '',
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
  private route: ActivatedRoute,
  private router: Router,
  private location: Location
) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.subject = params['subject'];

    });
     this.route.queryParams.subscribe(params => {
    this.examType = params['examType'] || '';
  });

    const editData = history.state.editData;

  if (editData) {

    this.isEditMode = true;

    this.questions = [

      {
        topic: editData.topic || '',

        questionText: editData.questionText || '',

        questionImage: editData.questionImage || '',

        optionA: editData.optionA || '',

        optionB: editData.optionB || '',

        optionC: editData.optionC || '',

        optionD: editData.optionD || '',

        correctAnswer: editData.correctAnswer || ''
      }

    ];

  }

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

  // GET EXISTING QUESTIONS
  let savedQuestions = JSON.parse(
    localStorage.getItem('questions') || '[]'
  );

  if (this.isEditMode) {

    // UPDATE EXISTING QUESTION
    savedQuestions = savedQuestions.map((q: any) => {

      if (q.id === history.state.editData.id) {

        return {
          ...q,
          ...this.questions[0]
        };

      }

      return q;

    });

    alert('Question Updated Successfully');

  } else {

    // ADD NEW QUESTION
    const newQuestion = {

      id: Date.now(),

      subject: this.subject,

      ...this.questions[0]

    };

    savedQuestions.push(newQuestion);

    alert('Question Added Successfully');

  }

  // SAVE TO LOCAL STORAGE
  localStorage.setItem(
    'questions',
    JSON.stringify(savedQuestions)
  );

  console.log(savedQuestions);

  // RESET FORM
  this.questions = [
    {
      topic: '',
      questionText: '',
      questionImage: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: ''
    }
  ];

  form.resetForm();

  // GO BACK TO TABLE
  this.location.back();
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

// DOWNLOAD EXCEL TEMPLATE
downloadExcelTemplate(): void {
  // Create template data
  const templateData = [
    ['Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer'],
    ['Sample Question 1?', 'Option A', 'Option B', 'Option C', 'Option D', 'A'],
    ['Sample Question 2?', 'Option A', 'Option B', 'Option C', 'Option D', 'B'],
    ['Sample Question 3?', 'Option A', 'Option B', 'Option C', 'Option D', 'C'],
  ];

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create worksheet from data
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);

  // Set column widths
  const columnWidths = [
    { wch: 30 },  // Question column
    { wch: 20 },  // OptionA column
    { wch: 20 },  // OptionB column
    { wch: 20 },  // OptionC column
    { wch: 20 },  // OptionD column
    { wch: 15 }   // CorrectAnswer column
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

  // Generate XLSX file name with subject
  const fileName = `excel_template_${this.subject}_questions.xlsx`;

  // Write the file
  XLSX.writeFile(workbook, fileName);
}
 goBackToSubjects(): void {

    this.router.navigate([
        '/mock-list',
        this.subject.toLowerCase()
    ]);

}

}
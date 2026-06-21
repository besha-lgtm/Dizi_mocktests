import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector    : 'app-subject-upload',
  standalone  : false,
  templateUrl : './subject-upload.component.html',
  styleUrls   : ['./subject-upload.component.css']
})
export class SubjectUploadComponent implements OnInit {

  subject : string = '';
  examType: string = '';

  // Form state
  activeTab  : string  = 'manual';
  isEditMode : boolean = false;
  editId     : string  = '';         // stores the existing question ID when editing
  isSubmitting: boolean = false;

  // Manual form questions array
  questions: any[] = [
    {
      topic        : '',
      difficulty   : '',
      mockTestId   : 1,
      questionText : '',
      questionImage: '',
      optionA      : '',
      optionB      : '',
      optionC      : '',
      optionD      : '',
      correctAnswer: ''
    }
  ];

  // Bulk upload state
  selectedFile    : File | null = null;
  selectedFileName: string = '';
  excelMockTestId : number = 1;      // Mock Test ID selection for Excel upload
  excelUploadSuccess: string = '';
  excelUploadError  : string = '';
  isBulkUploading   : boolean = false;

  // Success/error feedback for manual form
  submitSuccess: string = '';
  submitError  : string = '';

  constructor(
    private route          : ActivatedRoute,
    private router         : Router,
    private location       : Location,
    private questionService: QuestionService,
    private authService    : AuthService
  ) {}

  ngOnInit(): void {
    // Get subject from route param
    this.route.params.subscribe(params => {
      this.subject = params['subject'];

      const userSubject = this.authService.getSubject();
      const userRole = this.authService.getRole();
      if (userRole === 'teacher' && userSubject && this.subject !== userSubject) {
        this.subject = userSubject;
      }
    });

    // Get examType from query param
    this.route.queryParams.subscribe(params => {
      this.examType = params['examType'] || '';
    });

    // Check if we're editing an existing question
    const editData = history.state.editData;

    if (editData) {
      this.isEditMode = true;
      this.editId     = editData.id;

      this.questions = [
        {
          topic        : editData.topic         || '',
          difficulty   : editData.difficulty     || '',
          mockTestId   : editData.mockTestId     || 1,
          questionText : editData.questionText   || '',
          questionImage: editData.questionImage  || '',
          optionA      : editData.optionA        || '',
          optionB      : editData.optionB        || '',
          optionC      : editData.optionC        || '',
          optionD      : editData.optionD        || '',
          correctAnswer: editData.correctAnswer  || ''
        }
      ];

      // Also carry the examType from the edit data if present
      if (editData.examType && !this.examType) {
        this.examType = editData.examType;
      }
    }
  }

  // ── Manual Form ────────────────────────────────────────────────────────────

  addQuestion(): void {
    this.questions.push({
      topic: '', difficulty: '', mockTestId: 1, questionText: '',
      questionImage: '',
      optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: ''
    });
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  submitQuestions(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      return;
    }

    this.isSubmitting  = true;
    this.submitSuccess = '';
    this.submitError   = '';

    const q = this.questions[0];

    if (this.isEditMode) {
      // ── UPDATE existing question ──────────────────────────────────────────
      const payload = {
        topic        : q.topic,
        examType     : this.examType || q.examType || 'JEE Mains',
        mockTestId   : q.mockTestId || 1,
        questionText : q.questionText,
        questionImage: q.questionImage || null,
        optionA      : q.optionA,
        optionB      : q.optionB,
        optionC      : q.optionC,
        optionD      : q.optionD,
        correctAnswer: q.correctAnswer,
        difficulty   : q.difficulty
      };

      this.questionService.updateQuestion(this.editId, payload).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.success) {
            this.submitSuccess = `Question ${this.editId} updated successfully!`;
            setTimeout(() => this.location.back(), 1500);
          } else {
            this.submitError = res.message || 'Update failed.';
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitError  = err.error?.message || 'Server error. Please try again.';
          console.error('updateQuestion error:', err);
        }
      });

    } else {
      // ── ADD new question ──────────────────────────────────────────────────
      const payload = {
        subject      : this.subject,
        topic        : q.topic,
        examType     : this.examType || 'JEE Mains',
        mockTestId   : q.mockTestId || 1,
        questionText : q.questionText,
        questionImage: q.questionImage || null,
        optionA      : q.optionA,
        optionB      : q.optionB,
        optionC      : q.optionC,
        optionD      : q.optionD,
        correctAnswer: q.correctAnswer,
        difficulty   : q.difficulty
      };

      this.questionService.addQuestion(payload).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.success) {
            this.submitSuccess = `Question ${res.id} added successfully!`;
            this.resetForm(form);
            setTimeout(() => {
              this.submitSuccess = '';
              this.location.back();
            }, 1500);
          } else {
            this.submitError = res.message || 'Failed to add question.';
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitError  = err.error?.message || 'Server error. Please try again.';
          console.error('addQuestion error:', err);
        }
      });
    }
  }

  private resetForm(form: NgForm): void {
    this.questions = [
      {
        topic: '', difficulty: '', mockTestId: 1, questionText: '', questionImage: '',
        optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: ''
      }
    ];
    form.resetForm();
  }

  // ── Image Upload ───────────────────────────────────────────────────────────

  onQuestionImageSelected(event: any, index: number): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.questions[index].questionImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // ── Excel Bulk Upload ──────────────────────────────────────────────────────

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile     = file;
      this.selectedFileName = file.name;
      this.excelUploadSuccess = '';
      this.excelUploadError   = '';
    }
  }

  uploadExcelFile(): void {
    if (!this.selectedFile) {
      this.excelUploadError = 'Please select an Excel file first.';
      return;
    }

    this.isBulkUploading    = true;
    this.excelUploadSuccess = '';
    this.excelUploadError   = '';

    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data      = new Uint8Array(e.target.result);
        const workbook  = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet     = workbook.Sheets[sheetName];

        // Convert sheet to JSON — uses first row as header keys
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
          this.isBulkUploading = false;
          this.excelUploadError = 'The Excel file is empty or has no data rows.';
          return;
        }

        // Map Excel columns → API payload fields
        // Expected columns: Question | Topic | Difficulty | OptionA | OptionB | OptionC | OptionD | CorrectAnswer | ExamType | MockTestId
        const questions = rows.map(row => ({
          topic        : String(row['Topic']        || '').trim(),
          examType     : String(row['ExamType']      || row['Exam Type'] || this.examType || 'JEE Mains').trim(),
          mockTestId   : Number(row['MockTestId']    || row['Mock Test ID'] || row['MockTest'] || this.excelMockTestId || 1),
          questionText : String(row['Question']      || '').trim(),
          optionA      : String(row['OptionA']       || row['Option A'] || '').trim(),
          optionB      : String(row['OptionB']       || row['Option B'] || '').trim(),
          optionC      : String(row['OptionC']       || row['Option C'] || '').trim(),
          optionD      : String(row['OptionD']       || row['Option D'] || '').trim(),
          correctAnswer: String(row['CorrectAnswer'] || row['Correct Answer'] || '').trim().toUpperCase(),
          difficulty   : String(row['Difficulty']    || '').trim()
        }));

        // POST bulk to API
        this.questionService.bulkAddQuestions({
          subject   : this.subject,
          mockTestId: this.excelMockTestId,
          questions : questions
        }).subscribe({
          next: (res) => {
            this.isBulkUploading = false;
            if (res.success) {
              this.excelUploadSuccess =
                `✅ ${res.addedCount} question(s) imported for ${this.subject}!` +
                (res.errors && res.errors.length > 0 ? `  (${res.errors.length} row(s) skipped)` : '');
              this.selectedFile     = null;
              this.selectedFileName = '';
              setTimeout(() => {
                this.excelUploadSuccess = '';
                this.location.back();
              }, 2500);
            } else {
              this.excelUploadError = res.message || 'Bulk import failed.';
            }
          },
          error: (err) => {
            this.isBulkUploading  = false;
            this.excelUploadError = err.error?.message || 'Server error during bulk upload. Please try again.';
            console.error('bulkAddQuestions error:', err);
          }
        });

      } catch (parseErr) {
        this.isBulkUploading  = false;
        this.excelUploadError = 'Failed to parse Excel file. Please use the template provided.';
        console.error('Excel parse error:', parseErr);
      }
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }

  // ── Excel Template Download ────────────────────────────────────────────────

  downloadExcelTemplate(): void {
    const templateData = [
      ['Question', 'Topic', 'Difficulty', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'ExamType', 'MockTestId'],
      ['Sample question 1?', 'Algebra',  'Easy',   'Option A', 'Option B', 'Option C', 'Option D', 'A', 'JEE Mains', '1'],
      ['Sample question 2?', 'Calculus', 'Medium', 'Option A', 'Option B', 'Option C', 'Option D', 'B', 'JEE Advanced', '1'],
      ['Sample question 3?', 'Geometry', 'Hard',   'Option A', 'Option B', 'Option C', 'Option D', 'C', 'JEE Mains', '2'],
    ];

    const workbook  = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);

    worksheet['!cols'] = [
      { wch: 35 }, { wch: 18 }, { wch: 12 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
    XLSX.writeFile(workbook, `template_${this.subject}_questions.xlsx`);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  goBackToSubjects(): void {
    this.router.navigate(['/mock-list', this.subject]);
  }
}
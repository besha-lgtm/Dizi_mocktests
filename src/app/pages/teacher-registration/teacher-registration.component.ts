import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { TeacherService } from '../../services/teacher.service';

interface Teacher {
  name:      string;
  mail:      string;
  password?: string;
  subject:   string;
  role?:     string;
}

interface Toast {
  id:      number;
  message: string;
  type:    'success' | 'info' | 'danger';
}

@Component({
  selector:    'app-teacher-registration',
  standalone:  false,
  templateUrl: './teacher-registration.component.html',
  styleUrls:   ['./teacher-registration.component.css']
})
export class TeacherRegistrationComponent implements OnInit {
  teachers:          Teacher[] = [];
  filteredTeachers:  Teacher[] = [];
  paginatedTeachers: Teacher[] = [];
  isPageLoading = false;

  // ── Form State ──────────────────────────────────────────────
  showModal              = false;
  editMode               = false;
  showPassword           = false;
  isSaving               = false;

  // ── Form Fields ──────────────────────────────────────────────
  teacherForm: Teacher = {
    name:     '',
    mail:     '',
    password: '',
    subject:  '',
    role:     'teacher'
  };

  // ── Delete Confirmation Modal State ──────────────────────────
  showDeleteModal     = false;
  teacherToDeleteMail = '';
  teacherToDeleteName = '';

  // ── Update Success Modal State ───────────────────────────────
  showUpdateSuccessModal = false;
  updateSuccessMessage   = '';

  // ── Bulk Upload State ────────────────────────────────────────
  bulkUploadMode       = false;
  isFileUploaded       = false;
  fileName             = '';
  bulkUploadedTeachers: Teacher[] = [];
  selectedSubjectBulk  = '';
  isDragOver           = false;
  isUploading          = false;

  // ── Search & Filter ──────────────────────────────────────────
  searchText            = '';
  selectedSubjectFilter = 'All';

  // ── Subjects Options ─────────────────────────────────────────
  subjects = ['Physics', 'Chemistry', 'Mathematics'];

  // Deterministic color palette for dynamic subject tagging
  private subjectColorsMap: { [key: string]: { [key: string]: string } } = {};
  private colorPalette = [
    { background: '#eff6ff', color: '#2563eb' }, // Blue
    { background: '#ecfdf5', color: '#059669' }, // Green
    { background: '#fffbeb', color: '#d97706' }, // Amber
    { background: '#fff1f2', color: '#e11d48' }, // Rose
    { background: '#f5f3ff', color: '#7c3aed' }, // Purple
    { background: '#ecfeff', color: '#0891b2' }, // Cyan
    { background: '#fdf2f8', color: '#db2777' }, // Pink
    { background: '#f0fdf4', color: '#16a34a' }  // Emerald
  ];

  // ── Pagination ───────────────────────────────────────────────
  currentPage  = 1;
  itemsPerPage = 5;
  pageNumbers: (number | string)[] = [];

  // ── Toasts ───────────────────────────────────────────────────
  toasts: Toast[] = [];
  private toastIdCounter = 0;

  constructor(
    private router:         Router,
    private teacherService: TeacherService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  // Helper to get deterministic styles for any dynamic subject
  getSubjectStyle(subject: string): { [key: string]: string } {
    if (!subject) {
      return { 'background-color': '#f1f5f9', 'color': '#475569' };
    }
    const normalized = subject.trim().toLowerCase();
    if (!this.subjectColorsMap[normalized]) {
      let hash = 0;
      for (let i = 0; i < normalized.length; i++) {
        hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % this.colorPalette.length;
      const paletteColor = this.colorPalette[index];
      this.subjectColorsMap[normalized] = {
        'background-color': paletteColor.background,
        'color': paletteColor.color
      };
    }
    return this.subjectColorsMap[normalized];
  }

  get uniqueSubjectsCount(): number {
    const subSet = new Set(this.teachers.map(t => t.subject.trim()).filter(s => !!s));
    return subSet.size;
  }

  // ─────────────────────────────────────────────────────────────
  // API: Load all teachers from DB
  // ─────────────────────────────────────────────────────────────
  loadTeachers(): void {
    this.isPageLoading = true;
    this.teacherService.getTeachers().subscribe({
      next: (res) => {
        this.isPageLoading = false;
        if (res.success) {
          this.teachers = (res.teachers as any[]).map(t => ({
            name:    t.name     || '',
            mail:    t.email    || '',
            subject: t.subject  || '',
            role:    t.role     || 'teacher'
          }));
          this.applyFilters();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isPageLoading = false;
        this.showToast('Failed to load teachers. Is the backend running?', 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  // Filter & Search Logic
  applyFilters(): void {
    const query = this.searchText.toLowerCase();
    this.filteredTeachers = this.teachers.filter(t => {
      const matchSearch =
        t.name.toLowerCase().includes(query) ||
        t.mail.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query);

      const matchSubject =
        this.selectedSubjectFilter === 'All' || t.subject === this.selectedSubjectFilter;

      return matchSearch && matchSubject;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination Logic
  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end   = start + this.itemsPerPage;
    this.paginatedTeachers = this.filteredTeachers.slice(start, end);

    const totalPages = this.totalPages;
    this.pageNumbers  = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        this.pageNumbers = [1, 2, 3, '...', totalPages];
      } else if (this.currentPage >= totalPages - 2) {
        this.pageNumbers = [1, '...', totalPages - 2, totalPages - 1, totalPages];
      } else {
        this.pageNumbers = [1, '...', this.currentPage, '...', totalPages];
      }
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTeachers.length / this.itemsPerPage);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getShowingText(): string {
    if (this.filteredTeachers.length === 0) return 'Showing 0 of 0 teachers';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end   = Math.min(start + this.itemsPerPage - 1, this.filteredTeachers.length);
    return `Showing ${start} to ${end} of ${this.filteredTeachers.length} teachers`;
  }

  // CRUD Operations
  openAddModal(): void {
    this.editMode          = false;
    this.showPassword      = false;
    this.bulkUploadMode    = false;
    this.isFileUploaded    = false;
    this.isUploading       = false;
    this.isSaving          = false;
    this.fileName          = '';
    this.bulkUploadedTeachers = [];
    this.selectedSubjectBulk  = '';
    this.teacherForm = {
      name:     '',
      mail:     '',
      password: '',
      subject:  this.subjects[0],
      role:     'teacher'
    };
    this.showModal = true;
  }

  openEditModal(teacher: Teacher): void {
    this.editMode          = true;
    this.showPassword      = false;
    this.bulkUploadMode    = false;
    this.isFileUploaded    = false;
    this.isUploading       = false;
    this.isSaving          = false;
    this.fileName          = '';
    this.bulkUploadedTeachers = [];
    this.selectedSubjectBulk  = '';
    this.teacherForm = { ...teacher };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isSaving  = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  enableBulkUpload(): void {
    this.bulkUploadMode  = true;
    this.isFileUploaded  = false;
    this.isUploading     = false;
    this.fileName        = '';
    this.bulkUploadedTeachers = [];
    this.selectedSubjectBulk  = '';
  }

  disableBulkUpload(): void {
    this.bulkUploadMode  = false;
    this.isFileUploaded  = false;
    this.isUploading     = false;
    this.fileName        = '';
    this.bulkUploadedTeachers = [];
    this.selectedSubjectBulk  = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (!this.selectedSubjectBulk) {
      this.showToast('Please select a subject for bulk upload first!', 'danger');
      return;
    }

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleExcelFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    if (!this.selectedSubjectBulk) {
      this.showToast('Please select a subject for bulk upload first!', 'danger');
      event.target.value = '';
      return;
    }
    const file = event.target.files?.[0];
    if (file) {
      this.handleExcelFile(file);
    }
  }

  private handleExcelFile(file: File): void {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      this.showToast('Please upload a valid Excel file (.xlsx or .xls)!', 'danger');
      return;
    }

    this.isUploading          = true;
    this.isFileUploaded       = false;
    this.bulkUploadedTeachers = [];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      setTimeout(() => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

          if (jsonData.length === 0) {
            this.showToast('The uploaded Excel file is empty!', 'danger');
            this.isUploading = false;
            return;
          }

          const parsedTeachers: Teacher[] = [];
          for (const row of jsonData) {
            const nameKey = Object.keys(row).find(k => k.toLowerCase() === 'name' || k.toLowerCase() === 'full name');
            const mailKey = Object.keys(row).find(k => k.toLowerCase() === 'email' || k.toLowerCase() === 'mail' || k.toLowerCase() === 'email address');
            const passwordKey = Object.keys(row).find(k => k.toLowerCase() === 'password');

            const name = nameKey ? String(row[nameKey]).trim() : '';
            const mail = mailKey ? String(row[mailKey]).trim() : '';

            if (!name || !mail) {
              continue;
            }

            const password = passwordKey ? String(row[passwordKey]).trim() : 'Password123';

            parsedTeachers.push({
              name,
              mail,
              password,
              subject: this.selectedSubjectBulk,
              role:    'teacher'
            });
          }

          if (parsedTeachers.length === 0) {
            this.showToast('No valid teacher entries found! Ensure columns for Name and Email exist.', 'danger');
            this.isUploading = false;
            return;
          }

          this.bulkUploadedTeachers = parsedTeachers;
          this.fileName             = file.name;
          this.isFileUploaded       = true;
          this.isUploading          = false;
          this.showToast('file upload succesfully', 'success');
          this.cdr.detectChanges();
        } catch (err) {
          console.error(err);
          this.showToast('Failed to parse the Excel file.', 'danger');
          this.isUploading = false;
          this.cdr.detectChanges();
        }
      }, 1200);
    };
    reader.readAsArrayBuffer(file);
  }

  downloadTemplate(): void {
    const templateData = [
      {
        'Full Name':     'Dr. Amit Patel',
        'Email Address': 'amit.patel@example.com',
        'Password':      'TeacherPassword123'
      }
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'teacher-registration-template.xlsx');
    this.showToast('Teacher Excel template downloaded successfully!', 'success');
  }

  importBulkTeachers(): void {
    if (!this.isFileUploaded || this.bulkUploadedTeachers.length === 0) {
      this.showToast('Please upload a valid Excel file first!', 'danger');
      return;
    }

    this.isSaving = true;
    const payload = this.bulkUploadedTeachers.map(t => ({
      name:     t.name,
      email:    t.mail,
      password: t.password || 'Password123',
      subject:  t.subject
    }));

    this.teacherService.bulkAddTeachers(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showToast(res.message || 'Imported teachers successfully!', 'success');
        if (res.errors?.length) {
          res.errors.forEach((e: string) => this.showToast(e, 'info'));
        }
        this.closeModal();
        this.loadTeachers();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.showToast(err.error?.message || 'Bulk import failed. Please try again.', 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  saveTeacher(): void {
    if (this.bulkUploadMode) {
      this.importBulkTeachers();
      return;
    }

    // Simple Validation
    if (!this.teacherForm.name.trim() || !this.teacherForm.mail.trim() || !this.teacherForm.password?.trim()) {
      this.showToast('Please fill all required fields correctly!', 'danger');
      return;
    }

    // Email format validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.teacherForm.mail)) {
      this.showToast('Please enter a valid email address!', 'danger');
      return;
    }

    this.isSaving = true;
    const payload = {
      name:     this.teacherForm.name.trim(),
      password: this.teacherForm.password?.trim() || '',
      subject:  this.teacherForm.subject
    };

    if (this.editMode) {
      this.teacherService.updateTeacher(this.teacherForm.mail, payload).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.showUpdateSuccessDialog(res.message || `Updated details for ${this.teacherForm.name} successfully!`);
          this.closeModal();
          this.loadTeachers();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          this.showToast(err.error?.message || 'Update failed. Please try again.', 'danger');
          this.cdr.detectChanges();
        }
      });
    } else {
      const fullPayload = {
        ...payload,
        email: this.teacherForm.mail.trim().toLowerCase()
      };

      this.teacherService.addTeacher(fullPayload).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.showToast(res.message || `Registered new teacher ${this.teacherForm.name} successfully!`, 'success');
          this.closeModal();
          this.loadTeachers();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          this.showToast(err.error?.message || 'Registration failed. Please try again.', 'danger');
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteTeacher(mail: string): void {
    const teacher = this.teachers.find(t => t.mail === mail);
    if (teacher) {
      this.teacherToDeleteMail = mail;
      this.teacherToDeleteName = teacher.name;
      this.showDeleteModal     = true;
    }
  }

  confirmDelete(): void {
    if (!this.teacherToDeleteMail) return;

    this.teacherService.deleteTeacher(this.teacherToDeleteMail).subscribe({
      next: () => {
        this.showToast(`Removed teacher registration for ${this.teacherToDeleteName}.`, 'info');
        this.cancelDelete();
        this.loadTeachers();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Delete failed. Please try again.', 'danger');
        this.cancelDelete();
        this.cdr.detectChanges();
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal     = false;
    this.teacherToDeleteMail = '';
    this.teacherToDeleteName = '';
  }

  showUpdateSuccessDialog(message: string): void {
    this.updateSuccessMessage  = message;
    this.showUpdateSuccessModal = true;
  }

  closeUpdateSuccessModal(): void {
    this.showUpdateSuccessModal = false;
    this.updateSuccessMessage   = '';
  }

  showToast(message: string, type: 'success' | 'info' | 'danger'): void {
    const id = ++this.toastIdCounter;
    this.toasts.push({ id, message, type });
    setTimeout(() => {
      this.removeToast(id);
      this.cdr.detectChanges();
    }, 4000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/admin-manageboard']);
  }
}
